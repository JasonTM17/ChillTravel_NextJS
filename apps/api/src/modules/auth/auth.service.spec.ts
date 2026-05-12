import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  HttpException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { AuthService } from "../auth.service";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// ---------------------------------------------------------------------------
// Mock factories
// ---------------------------------------------------------------------------

function makePrisma() {
  return {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    loginAttempt: {
      create: vi.fn().mockResolvedValue({}),
      count: vi.fn().mockResolvedValue(0),
    },
    accountLockout: {
      findUnique: vi.fn().mockResolvedValue(null),
      delete: vi.fn().mockResolvedValue({}),
      upsert: vi.fn().mockResolvedValue({}),
    },
    emailVerificationToken: {
      create: vi.fn().mockResolvedValue({}),
    },
  };
}

function makeJwt() {
  return {
    sign: vi.fn().mockReturnValue("mock-access-token"),
  };
}

function makeConfig() {
  return {
    get: vi.fn((key: string) => {
      const map: Record<string, string> = {
        JWT_ACCESS_SECRET: "test_access_secret_at_least_16_chars",
        JWT_REFRESH_SECRET: "test_refresh_secret_at_least_16_chars",
        JWT_ACCESS_EXPIRATION: "15m",
        JWT_REFRESH_EXPIRATION: "7d",
      };
      return map[key];
    }),
  };
}

function makeEmail() {
  return {
    sendEmailVerification: vi.fn(),
    sendBookingConfirmation: vi.fn(),
    sendBookingStatusUpdate: vi.fn(),
    sendReviewApproved: vi.fn(),
    sendPasswordReset: vi.fn(),
  };
}

// ---------------------------------------------------------------------------
// Shared test data
// ---------------------------------------------------------------------------

const HASHED_PASSWORD = bcrypt.hashSync("Password@123", 10);

const MOCK_USER = {
  id: "user-id-1",
  email: "user@wanderviet.com",
  password: HASHED_PASSWORD,
  fullName: "Test User",
  phone: null,
  avatarUrl: null,
  role: "USER",
  status: "ACTIVE",
  emailVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// A raw token whose hash we can pre-compute for refresh tests
const RAW_REFRESH_TOKEN = "a".repeat(80); // 80-char hex-like string
const REFRESH_TOKEN_HASH = hashToken(RAW_REFRESH_TOKEN);

const MOCK_REFRESH_TOKEN_ROW = {
  id: "rt-id-1",
  userId: "user-id-1",
  tokenHash: REFRESH_TOKEN_HASH,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  revoked: false,
  createdAt: new Date(),
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("AuthService", () => {
  let service: AuthService;
  let prisma: ReturnType<typeof makePrisma>;
  let jwt: ReturnType<typeof makeJwt>;
  let config: ReturnType<typeof makeConfig>;
  let email: ReturnType<typeof makeEmail>;

  beforeEach(() => {
    prisma = makePrisma();
    jwt = makeJwt();
    config = makeConfig();
    email = makeEmail();
    service = new AuthService(
      prisma as any,
      jwt as any,
      config as any,
      email as any
    );
  });

  // -------------------------------------------------------------------------
  // register
  // -------------------------------------------------------------------------

  describe("register", () => {
    it("registers a new user and returns tokens", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(MOCK_USER);
      prisma.emailVerificationToken.create.mockResolvedValue({});
      prisma.refreshToken.create.mockResolvedValue(MOCK_REFRESH_TOKEN_ROW);

      const result = await service.register({
        fullName: "Test User",
        email: "user@wanderviet.com",
        password: "Password@123",
      });

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user.email).toBe("user@wanderviet.com");
      // password must not be exposed in the response
      expect((result.user as any).password).toBeUndefined();
      expect(prisma.user.create).toHaveBeenCalledOnce();
      expect(email.sendEmailVerification).toHaveBeenCalledWith(
        "user@wanderviet.com",
        expect.any(String)
      );
    });

    it("throws ConflictException when email already exists", async () => {
      prisma.user.findUnique.mockResolvedValue(MOCK_USER);

      await expect(
        service.register({
          fullName: "Test User",
          email: "user@wanderviet.com",
          password: "Password@123",
        })
      ).rejects.toThrow(ConflictException);

      // user.create must NOT be called
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // login
  // -------------------------------------------------------------------------

  describe("login", () => {
    it("logs in with correct credentials and returns tokens", async () => {
      prisma.user.findUnique.mockResolvedValue(MOCK_USER);
      prisma.accountLockout.findUnique.mockResolvedValue(null);
      prisma.loginAttempt.create.mockResolvedValue({});
      prisma.loginAttempt.count.mockResolvedValue(0);
      prisma.refreshToken.create.mockResolvedValue(MOCK_REFRESH_TOKEN_ROW);

      const result = await service.login(
        { email: "user@wanderviet.com", password: "Password@123" },
        "127.0.0.1"
      );

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user.email).toBe("user@wanderviet.com");
      expect((result.user as any).password).toBeUndefined();
    });

    it("throws UnauthorizedException on wrong password", async () => {
      prisma.user.findUnique.mockResolvedValue(MOCK_USER);
      prisma.accountLockout.findUnique.mockResolvedValue(null);
      prisma.loginAttempt.create.mockResolvedValue({});
      prisma.loginAttempt.count.mockResolvedValue(1);

      await expect(
        service.login(
          { email: "user@wanderviet.com", password: "WrongPassword" },
          "127.0.0.1"
        )
      ).rejects.toThrow(UnauthorizedException);
    });

    it("throws UnauthorizedException when user does not exist", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.loginAttempt.create.mockResolvedValue({});

      await expect(
        service.login(
          { email: "nonexistent@wanderviet.com", password: "Password@123" },
          "127.0.0.1"
        )
      ).rejects.toThrow(UnauthorizedException);
    });

    it("throws 423 HttpException when account is locked", async () => {
      prisma.user.findUnique.mockResolvedValue(MOCK_USER);
      prisma.accountLockout.findUnique.mockResolvedValue({
        userId: "user-id-1",
        lockedUntil: new Date(Date.now() + 10 * 60 * 1000), // 10 min from now
        reason: "Too many failed login attempts",
      });

      let caughtError: unknown;
      try {
        await service.login(
          { email: "user@wanderviet.com", password: "Password@123" },
          "127.0.0.1"
        );
      } catch (err) {
        caughtError = err;
      }

      expect(caughtError).toBeInstanceOf(HttpException);
      expect((caughtError as HttpException).getStatus()).toBe(423);
      expect((caughtError as HttpException).message).toContain("locked");
    });

    it("locks account after 5 failed attempts", async () => {
      prisma.user.findUnique.mockResolvedValue(MOCK_USER);
      prisma.accountLockout.findUnique.mockResolvedValue(null);
      prisma.loginAttempt.create.mockResolvedValue({});
      // Simulate 5 recent failures already recorded
      prisma.loginAttempt.count.mockResolvedValue(5);
      prisma.accountLockout.upsert.mockResolvedValue({});

      await expect(
        service.login(
          { email: "user@wanderviet.com", password: "WrongPassword" },
          "127.0.0.1"
        )
      ).rejects.toThrow(UnauthorizedException);

      expect(prisma.accountLockout.upsert).toHaveBeenCalledOnce();
    });
  });

  // -------------------------------------------------------------------------
  // refresh
  // -------------------------------------------------------------------------

  describe("refresh", () => {
    it("rotates refresh token and returns new tokens", async () => {
      // The service hashes the incoming raw token and looks it up
      prisma.refreshToken.findUnique.mockResolvedValue(MOCK_REFRESH_TOKEN_ROW);
      prisma.refreshToken.update.mockResolvedValue({
        ...MOCK_REFRESH_TOKEN_ROW,
        revoked: true,
      });
      prisma.user.findUnique.mockResolvedValue(MOCK_USER);
      prisma.refreshToken.create.mockResolvedValue(MOCK_REFRESH_TOKEN_ROW);

      const result = await service.refresh({ refreshToken: RAW_REFRESH_TOKEN });

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      // Old token must be revoked
      expect(prisma.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { revoked: true } })
      );
    });

    it("throws UnauthorizedException for revoked refresh token", async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        ...MOCK_REFRESH_TOKEN_ROW,
        revoked: true,
      });

      await expect(
        service.refresh({ refreshToken: RAW_REFRESH_TOKEN })
      ).rejects.toThrow(UnauthorizedException);
    });

    it("throws UnauthorizedException for expired refresh token", async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        ...MOCK_REFRESH_TOKEN_ROW,
        expiresAt: new Date(Date.now() - 1000), // expired
      });

      await expect(
        service.refresh({ refreshToken: RAW_REFRESH_TOKEN })
      ).rejects.toThrow(UnauthorizedException);
    });

    it("throws UnauthorizedException for non-existent refresh token", async () => {
      prisma.refreshToken.findUnique.mockResolvedValue(null);

      await expect(
        service.refresh({ refreshToken: "unknown-token" })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // -------------------------------------------------------------------------
  // changePassword
  // -------------------------------------------------------------------------

  describe("changePassword", () => {
    it("changes password when old password is correct", async () => {
      prisma.user.findUnique.mockResolvedValue(MOCK_USER);
      prisma.user.update.mockResolvedValue(MOCK_USER);
      prisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });

      await expect(
        service.changePassword("user-id-1", {
          oldPassword: "Password@123",
          newPassword: "NewPassword@456",
        })
      ).resolves.not.toThrow();

      expect(prisma.user.update).toHaveBeenCalledOnce();
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ data: { revoked: true } })
      );
    });

    it("throws BadRequestException when old password is wrong", async () => {
      prisma.user.findUnique.mockResolvedValue(MOCK_USER);

      await expect(
        service.changePassword("user-id-1", {
          oldPassword: "WrongOldPassword",
          newPassword: "NewPassword@456",
        })
      ).rejects.toThrow(BadRequestException);

      // user.update must NOT be called
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });
});
