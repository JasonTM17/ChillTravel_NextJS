import { Body, Controller, Get, HttpCode, HttpStatus, Put, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import type { AuthenticatedUser } from '../common/strategies/jwt.strategy';
import { ChangePasswordDto } from './auth/dto/change-password.dto';
import { LoginDto } from './auth/dto/login.dto';
import { RefreshTokenDto } from './auth/dto/refresh-token.dto';
import { RegisterDto } from './auth/dto/register.dto';
import { UpdateProfileDto } from './auth/dto/update-profile.dto';
import { AuthService } from './auth.service';

interface RequestWithIp {
  ip?: string;
  headers?: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}

function extractIp(req: RequestWithIp): string {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0]?.trim() ?? 'unknown';
  return req.ip ?? req.socket?.remoteAddress ?? 'unknown';
}

/**
 * Auth controller — register, login, refresh, logout, me, change-password.
 * Design §4, §5.2. Requirements 1, 2, 3, 4, 5, 28.
 */
@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // -------------------------------------------------------------------------
  // POST /auth/register
  // -------------------------------------------------------------------------

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // -------------------------------------------------------------------------
  // POST /auth/login
  // -------------------------------------------------------------------------

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ auth: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful, returns tokens' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 423, description: 'Account locked due to too many failed attempts' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  login(@Body() dto: LoginDto, @Req() req: RequestWithIp) {
    const ip = extractIp(req);
    return this.authService.login(dto, ip);
  }

  // -------------------------------------------------------------------------
  // POST /auth/refresh
  // -------------------------------------------------------------------------

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'New tokens issued' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  // -------------------------------------------------------------------------
  // POST /auth/logout
  // -------------------------------------------------------------------------

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@CurrentUser() user: AuthenticatedUser, @Body() dto: RefreshTokenDto) {
    await this.authService.logout(user.id, dto.refreshToken);
    return { revoked: true };
  }

  // -------------------------------------------------------------------------
  // GET /auth/me
  // -------------------------------------------------------------------------

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getMe(user.id);
  }

  // -------------------------------------------------------------------------
  // PUT /auth/me
  // -------------------------------------------------------------------------

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Updated profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateMe(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) {
    return this.authService.updateMe(user.id, dto);
  }

  // -------------------------------------------------------------------------
  // PUT /auth/change-password
  // -------------------------------------------------------------------------

  @Put('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Old password is incorrect' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(@CurrentUser() user: AuthenticatedUser, @Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(user.id, dto);
    return { changed: true };
  }
}
