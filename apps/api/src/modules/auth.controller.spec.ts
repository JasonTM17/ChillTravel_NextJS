/**
 * AuthController unit tests — Task 48, Req 24, Design §11.2
 *
 * Tests the HTTP layer (controller methods) with a fully mocked AuthService.
 * No real DB, no real JWT verification needed.
 */
import { UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AuthenticatedUser } from '../common/strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// ---------------------------------------------------------------------------
// Mock factory
// ---------------------------------------------------------------------------

function makeAuthService(): AuthService {
  return {
    register: vi.fn(),
    login: vi.fn(),
    refresh: vi.fn(),
    logout: vi.fn(),
    getMe: vi.fn(),
    updateMe: vi.fn(),
    changePassword: vi.fn(),
  } as unknown as AuthService;
}

// ---------------------------------------------------------------------------
// Shared test data
// ---------------------------------------------------------------------------

const MOCK_USER_PROFILE = {
  id: 'user-id-1',
  email: 'test@wanderviet.com',
  fullName: 'Test User',
  phone: null,
  avatarUrl: null,
  role: 'USER',
  status: 'ACTIVE',
  emailVerified: false,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

const MOCK_AUTH_RESPONSE = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: MOCK_USER_PROFILE,
};

const MOCK_AUTHENTICATED_USER: AuthenticatedUser = {
  id: 'user-id-1',
  email: 'test@wanderviet.com',
  role: 'USER',
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(() => {
    service = makeAuthService();
    controller = new AuthController(service);
  });

  // -------------------------------------------------------------------------
  // register
  // -------------------------------------------------------------------------

  describe('register', () => {
    it('calls authService.register with dto and returns tokens', async () => {
      const dto = {
        fullName: 'Test User',
        email: 'test@wanderviet.com',
        password: 'Password@123',
      };
      vi.mocked(service.register).mockResolvedValue(MOCK_AUTH_RESPONSE as any);

      const result = await controller.register(dto as any);

      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(MOCK_AUTH_RESPONSE);
    });

    it('propagates ConflictException when email already exists', async () => {
      vi.mocked(service.register).mockRejectedValue(
        new ConflictException('Email already registered'),
      );

      await expect(
        controller.register({
          fullName: 'Test',
          email: 'existing@wanderviet.com',
          password: 'Password@123',
        } as any),
      ).rejects.toThrow(ConflictException);
    });
  });

  // -------------------------------------------------------------------------
  // login
  // -------------------------------------------------------------------------

  describe('login', () => {
    it('calls authService.login with dto and ip, returns tokens', async () => {
      const dto = { email: 'test@wanderviet.com', password: 'Password@123' };
      const mockReq = { ip: '127.0.0.1', headers: {}, socket: {} };
      vi.mocked(service.login).mockResolvedValue(MOCK_AUTH_RESPONSE as any);

      const result = await controller.login(dto as any, mockReq as any);

      expect(service.login).toHaveBeenCalledWith(dto, '127.0.0.1');
      expect(result).toEqual(MOCK_AUTH_RESPONSE);
    });

    it('propagates UnauthorizedException on wrong password', async () => {
      vi.mocked(service.login).mockRejectedValue(
        new UnauthorizedException('Invalid email or password'),
      );

      await expect(
        controller.login(
          { email: 'test@wanderviet.com', password: 'WrongPassword' } as any,
          { ip: '127.0.0.1', headers: {}, socket: {} } as any,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('extracts ip from x-forwarded-for header when present', async () => {
      const dto = { email: 'test@wanderviet.com', password: 'Password@123' };
      const mockReq = {
        ip: '10.0.0.1',
        headers: { 'x-forwarded-for': '203.0.113.5, 10.0.0.1' },
        socket: {},
      };
      vi.mocked(service.login).mockResolvedValue(MOCK_AUTH_RESPONSE as any);

      await controller.login(dto as any, mockReq as any);

      // Should use the first IP from x-forwarded-for
      expect(service.login).toHaveBeenCalledWith(dto, '203.0.113.5');
    });
  });

  // -------------------------------------------------------------------------
  // refresh
  // -------------------------------------------------------------------------

  describe('refresh', () => {
    it('calls authService.refresh with dto and returns new tokens', async () => {
      const dto = { refreshToken: 'old-refresh-token' };
      vi.mocked(service.refresh).mockResolvedValue(MOCK_AUTH_RESPONSE as any);

      const result = await controller.refresh(dto as any);

      expect(service.refresh).toHaveBeenCalledWith(dto);
      expect(result).toEqual(MOCK_AUTH_RESPONSE);
    });

    it('propagates UnauthorizedException for invalid refresh token', async () => {
      vi.mocked(service.refresh).mockRejectedValue(
        new UnauthorizedException('Invalid or expired refresh token'),
      );

      await expect(controller.refresh({ refreshToken: 'invalid-token' } as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // -------------------------------------------------------------------------
  // logout
  // -------------------------------------------------------------------------

  describe('logout', () => {
    it('calls authService.logout with userId and refreshToken, returns revoked:true', async () => {
      const dto = { refreshToken: 'some-refresh-token' };
      vi.mocked(service.logout).mockResolvedValue(undefined);

      const result = await controller.logout(MOCK_AUTHENTICATED_USER, dto as any);

      expect(service.logout).toHaveBeenCalledWith('user-id-1', 'some-refresh-token');
      expect(result).toEqual({ revoked: true });
    });
  });

  // -------------------------------------------------------------------------
  // getMe
  // -------------------------------------------------------------------------

  describe('getMe', () => {
    it('calls authService.getMe with userId and returns user profile', async () => {
      vi.mocked(service.getMe).mockResolvedValue(MOCK_USER_PROFILE as any);

      const result = await controller.getMe(MOCK_AUTHENTICATED_USER);

      expect(service.getMe).toHaveBeenCalledWith('user-id-1');
      expect(result).toEqual(MOCK_USER_PROFILE);
    });

    it('propagates UnauthorizedException when user not found', async () => {
      vi.mocked(service.getMe).mockRejectedValue(new UnauthorizedException('User not found'));

      await expect(controller.getMe(MOCK_AUTHENTICATED_USER)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // -------------------------------------------------------------------------
  // updateMe
  // -------------------------------------------------------------------------

  describe('updateMe', () => {
    it('calls authService.updateMe with userId and dto, returns updated profile', async () => {
      const dto = { fullName: 'Updated Name', phone: '0901234567' };
      const updatedProfile = {
        ...MOCK_USER_PROFILE,
        fullName: 'Updated Name',
        phone: '0901234567',
      };
      vi.mocked(service.updateMe).mockResolvedValue(updatedProfile as any);

      const result = await controller.updateMe(MOCK_AUTHENTICATED_USER, dto as any);

      expect(service.updateMe).toHaveBeenCalledWith('user-id-1', dto);
      expect(result).toEqual(updatedProfile);
    });
  });

  // -------------------------------------------------------------------------
  // changePassword
  // -------------------------------------------------------------------------

  describe('changePassword', () => {
    it('calls authService.changePassword and returns changed:true', async () => {
      const dto = { oldPassword: 'Password@123', newPassword: 'NewPassword@456' };
      vi.mocked(service.changePassword).mockResolvedValue(undefined);

      const result = await controller.changePassword(MOCK_AUTHENTICATED_USER, dto as any);

      expect(service.changePassword).toHaveBeenCalledWith('user-id-1', dto);
      expect(result).toEqual({ changed: true });
    });

    it('propagates BadRequestException when old password is wrong', async () => {
      vi.mocked(service.changePassword).mockRejectedValue(
        new BadRequestException('Old password is incorrect'),
      );

      await expect(
        controller.changePassword(MOCK_AUTHENTICATED_USER, {
          oldPassword: 'WrongOld',
          newPassword: 'NewPassword@456',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
