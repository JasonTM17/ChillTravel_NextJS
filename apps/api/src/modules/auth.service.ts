import { createHash, randomBytes } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { EmailService } from '../common/services/email.service';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthResponseDto, UserProfileDto } from './auth/dto/auth-response.dto';
import type { ChangePasswordDto } from './auth/dto/change-password.dto';
import type { LoginDto } from './auth/dto/login.dto';
import type { RefreshTokenDto } from './auth/dto/refresh-token.dto';
import type { RegisterDto } from './auth/dto/register.dto';
import type { UpdateProfileDto } from './auth/dto/update-profile.dto';

/** Number of bcrypt salt rounds (design §4.4). */
const BCRYPT_ROUNDS = 12;

/** Max failed login attempts before account lockout (Req 28). */
const MAX_FAILED_ATTEMPTS = 5;

/** Lockout window in milliseconds (15 minutes). */
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;

/** Lockout duration in milliseconds (15 minutes). */
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

/** Email verification token TTL in milliseconds (24 hours). */
const EMAIL_VERIFY_TTL_MS = 24 * 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  // ---------------------------------------------------------------------------
  // Register
  // ---------------------------------------------------------------------------

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: passwordHash,
        fullName: dto.fullName,
        phone: dto.phone ?? null,
        role: 'USER',
        status: 'ACTIVE',
        emailVerified: false,
      },
    });

    // Create email verification token and send (mock)
    const rawVerifyToken = randomBytes(32).toString('hex');
    await this.prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawVerifyToken),
        expiresAt: new Date(Date.now() + EMAIL_VERIFY_TTL_MS),
      },
    });
    this.emailService.sendEmailVerification(user.email, rawVerifyToken);

    return this.generateTokensAndRespond(user);
  }

  // ---------------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------------

  async login(dto: LoginDto, ipAddress: string): Promise<AuthResponseDto> {
    // Check account lockout first (Req 28)
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (user) {
      const lockout = await this.prisma.accountLockout.findUnique({ where: { userId: user.id } });
      if (lockout && lockout.lockedUntil > new Date()) {
        const remainingMs = lockout.lockedUntil.getTime() - Date.now();
        const remainingMin = Math.ceil(remainingMs / 60_000);
        throw new HttpException(
          `Account locked. Try again in ${remainingMin} minute(s).`,
          HttpStatus.LOCKED,
        );
      }
      // Remove expired lockout if present
      if (lockout && lockout.lockedUntil <= new Date()) {
        await this.prisma.accountLockout.delete({ where: { userId: user.id } });
      }
    }

    // Generic 401 — do not reveal whether email exists
    if (!user) {
      await this.prisma.loginAttempt.create({
        data: { email: dto.email, ipAddress, success: false },
      });
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check user status
    if (user.status === 'INACTIVE' || user.status === 'BANNED') {
      throw new UnauthorizedException('Account is not active');
    }

    // Verify password
    const passwordValid = await bcrypt.compare(dto.password, user.password);

    // Record login attempt
    await this.prisma.loginAttempt.create({
      data: { email: dto.email, ipAddress, success: passwordValid },
    });

    if (!passwordValid) {
      // Check if we should lock the account
      const windowStart = new Date(Date.now() - LOCKOUT_WINDOW_MS);
      const recentFailures = await this.prisma.loginAttempt.count({
        where: {
          email: dto.email,
          success: false,
          createdAt: { gte: windowStart },
        },
      });

      if (recentFailures >= MAX_FAILED_ATTEMPTS) {
        const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
        await this.prisma.accountLockout.upsert({
          where: { userId: user.id },
          create: { userId: user.id, lockedUntil, reason: 'Too many failed login attempts' },
          update: { lockedUntil, reason: 'Too many failed login attempts' },
        });
      }

      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateTokensAndRespond(user);
  }

  // ---------------------------------------------------------------------------
  // Refresh
  // ---------------------------------------------------------------------------

  async refresh(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    const tokenHash = hashToken(dto.refreshToken);

    const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Revoke old token
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });

    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status === 'INACTIVE' || user.status === 'BANNED') {
      throw new UnauthorizedException('Account is not active');
    }

    return this.generateTokensAndRespond(user);
  }

  // ---------------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------------

  async logout(userId: string, refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });

    if (stored && stored.userId === userId && !stored.revoked) {
      await this.prisma.refreshToken.update({
        where: { id: stored.id },
        data: { revoked: true },
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Get Me
  // ---------------------------------------------------------------------------

  async getMe(userId: string): Promise<UserProfileDto> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.toUserProfile(user);
  }

  // ---------------------------------------------------------------------------
  // Update Me
  // ---------------------------------------------------------------------------

  async updateMe(userId: string, dto: UpdateProfileDto): Promise<UserProfileDto> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.fullName !== undefined && { fullName: dto.fullName }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
      },
    });
    return this.toUserProfile(user);
  }

  // ---------------------------------------------------------------------------
  // Change Password
  // ---------------------------------------------------------------------------

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const valid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!valid) {
      throw new BadRequestException('Old password is incorrect');
    }

    const newHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newHash },
    });

    // Revoke all refresh tokens for this user
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async generateTokensAndRespond(user: {
    id: string;
    email: string;
    fullName: string | null;
    phone: string | null;
    avatarUrl: string | null;
    role: string;
    status: string;
    emailVerified: boolean;
    createdAt: Date;
  }): Promise<AuthResponseDto> {
    const { accessToken, refreshToken } = await this.generateTokens(user);
    return {
      accessToken,
      refreshToken,
      user: this.toUserProfile(user),
    };
  }

  private async generateTokens(user: { id: string; email: string; role: string }): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessExpiration = this.configService.get<string>('JWT_ACCESS_EXPIRATION') ?? '15m';
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'refresh_secret';
    const refreshExpiration = this.configService.get<string>('JWT_REFRESH_EXPIRATION') ?? '7d';

    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expiresIn: accessExpiration as any,
    });

    const rawRefreshToken = randomBytes(40).toString('hex');
    const _refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { secret: refreshSecret, expiresIn: refreshExpiration as any },
    );

    // Parse expiration to compute expiresAt
    const refreshExpiresAt = this.parseExpiration(refreshExpiration);

    // Store hash of the raw refresh token (not the JWT — we use the raw random bytes)
    const tokenHash = hashToken(rawRefreshToken);
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: refreshExpiresAt,
        revoked: false,
      },
    });

    // Return the raw token to the client (not the JWT)
    return { accessToken, refreshToken: rawRefreshToken };
  }

  private parseExpiration(exp: string): Date {
    const now = Date.now();
    const match = /^(\d+)([smhd])$/.exec(exp);
    if (!match?.[1] || !match[2]) return new Date(now + 7 * 24 * 60 * 60 * 1000);
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return new Date(now + value * (multipliers[unit] ?? 1000));
  }

  private toUserProfile(user: {
    id: string;
    email: string;
    fullName: string | null;
    phone: string | null;
    avatarUrl: string | null;
    role: string;
    status: string;
    emailVerified: boolean;
    createdAt: Date;
  }): UserProfileDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    };
  }
}
