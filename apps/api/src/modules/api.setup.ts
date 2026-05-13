import { ValidationPipe, type INestApplication } from '@nestjs/common';

/**
 * Paths that must remain reachable at the root URL (no `/api/v1` prefix).
 * Kept here so tests and `main.ts` apply the same exclusion list.
 *
 * - Swagger UI (design §3.1, Req 23) lives at `/api/docs` to match the spec.
 * - Health / metrics endpoints live at the root so Kubernetes-style probes
 *   (Req 32) don't need version pinning.
 */
export const API_GLOBAL_PREFIX = 'api/v1';
export const API_PREFIX_EXCLUDE = [
  'api/docs',
  'api/docs-json',
  'health',
  'health/live',
  'health/ready',
  'metrics',
];

/**
 * Apply shared NestJS bootstrap steps used by both `main.ts` and
 * integration tests.
 *
 * Global concerns that are registered via `APP_*` providers in
 * `AppModule` (ResponseInterceptor, GlobalExceptionFilter, ThrottlerGuard)
 * are NOT re-registered here — that would double-wrap.
 */
export function configureApiApp(app: INestApplication): void {
  app.setGlobalPrefix(API_GLOBAL_PREFIX, { exclude: API_PREFIX_EXCLUDE });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
}
