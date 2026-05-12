import { randomUUID } from "node:crypto";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { LoggerModule } from "nestjs-pino";
import { PrismaModule } from "../prisma/prisma.module";
import { validateEnv, type NodeEnv } from "../config/env.validation";
import { GlobalExceptionFilter } from "../common/filters/global-exception.filter";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { ResponseInterceptor } from "../common/interceptors/response.interceptor";
import { JwtStrategy } from "../common/strategies/jwt.strategy";
import { AdminController } from "./admin.controller";
import { AdminBookingController } from "./booking/admin-booking.controller";
import { AiController } from "./ai.controller";
import { AuthController } from "./auth.controller";
import { BookingController } from "./booking.controller";
import { DestinationsController } from "./destinations.controller";
import { HealthController } from "./health.controller";
import { TripsController } from "./trips.controller";
import { TourController } from "./tour/tour.controller";
import { PaymentController } from "./payment/payment.controller";
import { ReviewController } from "./review/review.controller";
import { WishlistController } from "./wishlist/wishlist.controller";
import { BlogController } from "./blog/blog.controller";
import { ContactController } from "./contact/contact.controller";
import { UploadController } from "./upload/upload.controller";
import { NotificationController } from "./notification/notification.controller";
import { CouponController } from "./coupon/coupon.controller";
import { AiService } from "./ai.service";
import { AuthService } from "./auth.service";
import { BookingService } from "./booking.service";
import { ReviewService } from "./review/review.service";
import { WishlistService } from "./wishlist/wishlist.service";
import { BlogService } from "./blog/blog.service";
import { ContactService } from "./contact/contact.service";
import { LocalUploadService } from "../common/services/upload.service";
import { NotificationService } from "./notification/notification.service";
import { CouponService } from "./coupon/coupon.service";
import { DashboardController } from "./admin/dashboard.controller";
import { AdminUsersController } from "./admin/admin-users.controller";
import { DashboardService } from "./admin/dashboard.service";
import { DestinationsService } from "./destinations.service";
import { TripsService } from "./trips.service";
import { TourService } from "./tour/tour.service";
import { EmailService } from "../common/services/email.service";
import { AuditService } from "../common/services/audit.service";
import { LocalErrorTracker } from "../common/services/error-tracker.service";
import { BookingScheduler } from "./booking/booking.scheduler";

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
      envFilePath: [".env", "../../.env"]
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const nodeEnv = config.get<NodeEnv>("NODE_ENV") ?? "development";
        const isProd = nodeEnv === "production";
        return {
          pinoHttp: {
            level: isProd ? "info" : "debug",
            genReqId: (req) => {
              const existing = (req.headers?.["x-request-id"] ?? undefined) as
                | string
                | undefined;
              return existing && existing.length > 0 ? existing : randomUUID();
            },
            customProps: (req) => ({
              requestId: (req as { id?: string }).id
            }),
            redact: {
              paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'res.headers["set-cookie"]'
              ],
              remove: true
            },
            transport: isProd
              ? undefined
              : {
                  target: "pino-pretty",
                  options: {
                    singleLine: true,
                    colorize: true,
                    translateTime: "SYS:HH:MM:ss.l"
                  }
                }
          }
        };
      }
    }),
    ThrottlerModule.forRoot([
      { name: "default", ttl: 60_000, limit: 100 },
      { name: "auth", ttl: 60_000, limit: 5 }
    ]),
    ScheduleModule.forRoot(),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const expiresIn = config.get<string>("JWT_ACCESS_EXPIRATION") ?? "15m";
        return {
          secret: config.get<string>("JWT_ACCESS_SECRET"),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          signOptions: { expiresIn: expiresIn as any },
        };
      },
    }),
    PrismaModule,
    PrometheusModule.register({
      defaultMetrics: { enabled: true },
      path: "/metrics"
    })
  ],
  controllers: [
    HealthController,
    AuthController,
    DestinationsController,
    TourController,
    AiController,
    BookingController,
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
    AdminUsersController
  ],
  providers: [
    AuthService,
    EmailService,
    AuditService,
    LocalErrorTracker,
    DestinationsService,
    TourService,
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
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter }
  ]
})
export class AppModule {}
