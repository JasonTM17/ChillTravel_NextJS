import "reflect-metadata";
import { join } from "node:path";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { Logger } from "nestjs-pino";
import { AppModule } from "./modules/app.module";
import { configureApiApp } from "./modules/api.setup";
import type { NodeEnv } from "./config/env.validation";

/**
 * Entry point for the WanderViet API.
 *
 * Bootstrapping order matches design §3.1:
 *   1. Create app with nestjs-pino buffer so bootstrap logs use the
 *      structured pipeline.
 *   2. Apply the global prefix (`/api/v1`) + ValidationPipe via
 *      {@link configureApiApp}.
 *   3. Harden with helmet + CORS (FRONTEND_URL from env).
 *   4. Mount Swagger at `/api/docs` (excluded from the global prefix so
 *      the URL stays stable across versions, Req 23).
 *   5. Listen on `PORT` from ConfigService (validated env).
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });

  const logger = app.get(Logger);
  app.useLogger(logger);

  configureApiApp(app);

  const config = app.get(ConfigService);
  const frontendUrl = config.get<string>("FRONTEND_URL") ?? "http://localhost:3000";
  const port = config.get<number>("PORT") ?? 4000;
  const nodeEnv = config.get<NodeEnv>("NODE_ENV") ?? "development";

  app.use(helmet());
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-request-id"]
  });

  // Serve uploaded files as static assets at /uploads/* (Req 18, Design §9)
  const uploadDir = config.get<string>("UPLOAD_DIR") ?? "./uploads";
  app.useStaticAssets(join(process.cwd(), uploadDir), { prefix: "/uploads" });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("WanderViet Travel Platform API")
    .setDescription(
      `## WanderViet Travel Platform — REST API v1

**Base path:** \`/api/v1\`

### Authentication
All protected endpoints require a Bearer JWT token in the \`Authorization\` header:
\`\`\`
Authorization: Bearer <accessToken>
\`\`\`

Obtain tokens via \`POST /api/v1/auth/login\` or \`POST /api/v1/auth/register\`.

### Demo Accounts
| Email | Password | Role |
|-------|----------|------|
| admin@wanderviet.com | Admin@123456 | ADMIN |
| user@wanderviet.com | User@123456 | USER |
| staff@wanderviet.com | Staff@123456 | STAFF |

### Payment Notice
All payment flows are **demo/mock only** — no real transactions are processed.
\`Thanh toán demo — không phát sinh giao dịch thật\`

### Response Format
All endpoints return a unified envelope:
\`\`\`json
{ "success": true, "message": "OK", "data": {}, "timestamp": "..." }
\`\`\`
Errors: \`{ "success": false, "message": "...", "errors": [{...}], "timestamp": "..." }\``
    )
    .setVersion("1.0.0")
    .setContact("WanderViet Team", "https://wanderviet.com", "support@wanderviet.com")
    .setLicense("MIT", "https://opensource.org/licenses/MIT")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description: "Enter JWT access token",
        in: "header"
      },
      "JWT"
    )
    .addTag("Auth", "Authentication — register, login, refresh, logout, profile")
    .addTag("Destinations", "Travel destinations — public browse + admin CRUD")
    .addTag("Tours", "Tours — public search/filter + admin CRUD + itinerary + departures")
    .addTag("Bookings", "Bookings — create, list, cancel (user endpoints)")
    .addTag("Admin — Bookings", "Admin booking management — list all, update status")
    .addTag("Payment", "Mock payment — checkout + callback (demo only)")
    .addTag("Reviews", "Tour reviews — public list + user create/update + admin moderation")
    .addTag("Wishlist", "User wishlist — add/remove/list tours and destinations")
    .addTag("Blog", "Blog CMS — public read + admin CRUD")
    .addTag("Contact", "Contact requests — public submit + admin triage")
    .addTag("Upload", "Image upload — local disk storage (admin only)")
    .addTag("Notifications", "In-app notifications — list, mark read")
    .addTag("Coupons", "Coupon management — admin CRUD + validation")
    .addTag("Admin — Dashboard", "Admin dashboard — summary, revenue, top tours, recent activities")
    .addTag("Health", "Health check endpoints for liveness and readiness probes")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(port);

  logger.log(
    `WanderViet API listening on http://localhost:${port}/api/v1 (env=${nodeEnv}, cors=${frontendUrl})`
  );
}

void bootstrap();
