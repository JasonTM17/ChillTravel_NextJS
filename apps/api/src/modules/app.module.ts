import { randomUUID } from 'node:crypto';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomThrottlerGuard } from '../common/guards/custom-throttler.guard';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { LoggerModule } from 'nestjs-pino';
import { GlobalExceptionFilter } from '../common/filters/global-exception.filter';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { AuditService } from '../common/services/audit.service';
import { EmailService } from '../common/services/email.service';
import { LocalErrorTracker } from '../common/services/error-tracker.service';
import { LocalUploadService } from '../common/services/upload.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { validateEnv, type NodeEnv } from '../config/env.validation';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminUsersController } from './admin/admin-users.controller';
import { DashboardController } from './admin/dashboard.controller';
import { DashboardService } from './admin/dashboard.service';
import { AdminController } from './admin.controller';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BlogController } from './blog/blog.controller';
import { BlogService } from './blog/blog.service';
import { AdminBookingController } from './booking/admin-booking.controller';
import { BookingScheduler } from './booking/booking.scheduler';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingsController } from './bookings/bookings.controller';
import { ContactController } from './contact/contact.controller';
import { ContactService } from './contact/contact.service';
import { CouponController } from './coupon/coupon.controller';
import { CouponService } from './coupon/coupon.service';
import { DestinationsController } from './destinations.controller';
import { DestinationsService } from './destinations.service';
import { FlightsController } from './flights/flights.controller';
import { FlightsService } from './flights/flights.service';
import { HealthController } from './health.controller';
import { HotelsController } from './hotels/hotels.controller';
import { HotelsService } from './hotels/hotels.service';
import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.service';
import { PaymentController } from './payment/payment.controller';
import { PromotionsController } from './promotions/promotions.controller';
import { PromotionsService } from './promotions/promotions.service';
import { ReviewController } from './review/review.controller';
import { ReviewService } from './review/review.service';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';
import { TourController } from './tour/tour.controller';
import { TourService } from './tour/tour.service';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { UploadController } from './upload/upload.controller';
import { WishlistController } from './wishlist/wishlist.controller';
import { WishlistService } from './wishlist/wishlist.service';

/**
 * Root application module for the WanderViet API (Req 22, 28, 29, 32).
 *
 * Wires up global platform concerns:
 *   - `ConfigModule` with schema validation (env.validation.ts).
 *   - `PrismaModule` (already @Global) for database access.
 *   - `LoggerModule` (nestjs-pino) with structured JSON logs + request IDs.
 *   - `ThrottlerModule` for rate limiting (default 100/min, auth 5/min).
 *   - `ScheduleModule` for cron-based background jobs (booking lifecycle).
 *   - `PassportModule` + `JwtModule` for JWT authentication.
 *   - Global interceptor / filter / guards via APP_* providers.
 *
 * Guard execution order (APP_GUARD registration order):
 *   1. JwtAuthGuard  — verifies Bearer token, respects @Public()
 *   2. RolesGuard    — checks user.role against @Roles() metadata
 *   3. ThrottlerGuard — rate limiting
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: ['.env', '../../.env'],
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const nodeEnv = config.get<NodeEnv>('NODE_ENV') ?? 'development';
        const isProd = nodeEnv === 'production';
        return {
          pinoHttp: {
            level: isProd ? 'info' : 'debug',
            genReqId: (req) => {
              const existing = (req.headers?.['x-request-id'] ?? undefined) as string | undefined;
              return existing && existing.length > 0 ? existing : randomUUID();
            },
            customProps: (req) => ({
              requestId: (req as { id?: string }).id,
            }),
            redact: {
              paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'res.headers["set-cookie"]',
              ],
              remove: true,
            },
            transport: isProd
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    colorize: true,
                    translateTime: 'SYS:HH:MM:ss.l',
                  },
                },
          },
        };
      },
    }),
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60_000, limit: 100 },
      { name: 'auth', ttl: 60_000, limit: 5 },
    ]),
    ScheduleModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const expiresIn = config.get<string>('JWT_ACCESS_EXPIRATION') ?? '15m';
        return {
          secret: config.get<string>('JWT_ACCESS_SECRET'),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          signOptions: { expiresIn: expiresIn as any },
        };
      },
    }),
    PrismaModule,
    PrometheusModule.register({
      defaultMetrics: { enabled: true },
      path: '/metrics',
    }),
  ],
  controllers: [
    HealthController,
    AuthController,
    DestinationsController,
    TourController,
    SearchController,
    HotelsController,
    FlightsController,
    PromotionsController,
    AiController,
    BookingController,
    BookingsController,
    TripsController,
    AdminController,
    AdminBookingController,
    PaymentController,
    ReviewController,
    WishlistController,
    BlogController,
    ContactController,
    UploadController,
    NotificationController,
    CouponController,
    DashboardController,
    AdminUsersController,
  ],
  providers: [
    AuthService,
    EmailService,
    AuditService,
    LocalErrorTracker,
    DestinationsService,
    TourService,
    SearchService,
    HotelsService,
    FlightsService,
    PromotionsService,
    AiService,
    BookingService,
    TripsService,
    ReviewService,
    WishlistService,
    BlogService,
    ContactService,
    LocalUploadService,
    NotificationService,
    CouponService,
    DashboardService,
    BookingScheduler,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: CustomThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}
