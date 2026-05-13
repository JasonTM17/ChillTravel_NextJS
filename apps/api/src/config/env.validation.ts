/**
 * Environment variable schema + validator for the WanderViet API.
 *
 * Manual validation (no Joi/zod dependency) that:
 *   1. Ensures all required env vars are present.
 *   2. Applies defaults for optional vars.
 *   3. Narrows types (numbers, enums) with clear error messages.
 *
 * Wired into `ConfigModule.forRoot({ validate: validateEnv })` so the app
 * fails fast at bootstrap if configuration is invalid (Req 25, design §13).
 */

/** Allowed values for `NODE_ENV`. */
export const NODE_ENVS = ['development', 'test', 'production'] as const;
export type NodeEnv = (typeof NODE_ENVS)[number];

/** Typed shape produced by {@link validateEnv}. */
export interface WanderViewerEnv {
  NODE_ENV: NodeEnv;
  PORT: number;
  DATABASE_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRATION: string;
  JWT_REFRESH_EXPIRATION: string;
  FRONTEND_URL: string;
  CORS_ORIGINS: string;
  UPLOAD_DIR: string;
}

/** Keys the consumer can request with typed config getters. */
export const ENV_KEYS = {
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  DATABASE_URL: 'DATABASE_URL',
  JWT_ACCESS_SECRET: 'JWT_ACCESS_SECRET',
  JWT_REFRESH_SECRET: 'JWT_REFRESH_SECRET',
  JWT_ACCESS_EXPIRATION: 'JWT_ACCESS_EXPIRATION',
  JWT_REFRESH_EXPIRATION: 'JWT_REFRESH_EXPIRATION',
  FRONTEND_URL: 'FRONTEND_URL',
  CORS_ORIGINS: 'CORS_ORIGINS',
  UPLOAD_DIR: 'UPLOAD_DIR',
} as const;

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

function requireString(
  config: Record<string, unknown>,
  key: string,
  errors: string[],
  opts: { minLength?: number } = {},
): string | undefined {
  const raw = config[key];
  if (raw === undefined || raw === null || raw === '') {
    errors.push(`Missing required env var ${key}`);
    return undefined;
  }
  if (typeof raw !== 'string') {
    errors.push(`Env var ${key} must be a string`);
    return undefined;
  }
  if (opts.minLength !== undefined && raw.length < opts.minLength) {
    errors.push(
      `Env var ${key} must be at least ${opts.minLength} characters (received ${raw.length})`,
    );
    return undefined;
  }
  return raw;
}

function optionalString(config: Record<string, unknown>, key: string, fallback: string): string {
  const raw = config[key];
  if (raw === undefined || raw === null || raw === '') {
    return fallback;
  }
  return String(raw);
}

function optionalNumber(
  config: Record<string, unknown>,
  key: string,
  fallback: number,
  errors: string[],
): number {
  const raw = config[key];
  if (raw === undefined || raw === null || raw === '') {
    return fallback;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    errors.push(`Env var ${key} must be a finite number (received "${String(raw)}")`);
    return fallback;
  }
  return parsed;
}

function optionalEnum<T extends string>(
  config: Record<string, unknown>,
  key: string,
  allowed: readonly T[],
  fallback: T,
  errors: string[],
): T {
  const raw = config[key];
  if (raw === undefined || raw === null || raw === '') {
    return fallback;
  }
  const value = String(raw) as T;
  if (!allowed.includes(value)) {
    errors.push(`Env var ${key} must be one of: ${allowed.join(', ')} (received "${String(raw)}")`);
    return fallback;
  }
  return value;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Validate the `process.env`-shaped record supplied by `@nestjs/config`.
 *
 * Required (fail fast if missing or malformed):
 *   - DATABASE_URL
 *   - JWT_ACCESS_SECRET (≥ 16 chars)
 *   - JWT_REFRESH_SECRET (≥ 16 chars)
 *
 * Optional (default applied):
 *   - NODE_ENV (default "development")
 *   - PORT (default 4000)
 *   - JWT_ACCESS_EXPIRATION (default "15m")
 *   - JWT_REFRESH_EXPIRATION (default "7d")
 *   - FRONTEND_URL (default "http://localhost:3000")
 *   - UPLOAD_DIR (default "./uploads")
 *
 * Returns a normalized record merged back into `ConfigService` (NestJS
 * uses whatever this function returns as the active config map).
 */
export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const errors: string[] = [];

  const databaseUrl = requireString(config, ENV_KEYS.DATABASE_URL, errors);
  const accessSecret = requireString(config, ENV_KEYS.JWT_ACCESS_SECRET, errors, {
    minLength: 16,
  });
  const refreshSecret = requireString(config, ENV_KEYS.JWT_REFRESH_SECRET, errors, {
    minLength: 16,
  });

  const nodeEnv = optionalEnum<NodeEnv>(
    config,
    ENV_KEYS.NODE_ENV,
    NODE_ENVS,
    'development',
    errors,
  );
  const port = optionalNumber(config, ENV_KEYS.PORT, 4000, errors);
  const accessExp = optionalString(config, ENV_KEYS.JWT_ACCESS_EXPIRATION, '15m');
  const refreshExp = optionalString(config, ENV_KEYS.JWT_REFRESH_EXPIRATION, '7d');
  const frontendUrl = optionalString(config, ENV_KEYS.FRONTEND_URL, 'http://localhost:3000');
  const corsOrigins = optionalString(config, ENV_KEYS.CORS_ORIGINS, '');
  const uploadDir = optionalString(config, ENV_KEYS.UPLOAD_DIR, './uploads');

  if (errors.length > 0) {
    throw new Error(`Invalid environment configuration:\n  - ${errors.join('\n  - ')}`);
  }

  // All validated values re-injected so downstream ConfigService.get<T>()
  // returns the normalized form (e.g. PORT is a number, not a string).
  return {
    ...config,
    [ENV_KEYS.NODE_ENV]: nodeEnv,
    [ENV_KEYS.PORT]: port,
    [ENV_KEYS.DATABASE_URL]: databaseUrl,
    [ENV_KEYS.JWT_ACCESS_SECRET]: accessSecret,
    [ENV_KEYS.JWT_REFRESH_SECRET]: refreshSecret,
    [ENV_KEYS.JWT_ACCESS_EXPIRATION]: accessExp,
    [ENV_KEYS.JWT_REFRESH_EXPIRATION]: refreshExp,
    [ENV_KEYS.FRONTEND_URL]: frontendUrl,
    [ENV_KEYS.CORS_ORIGINS]: corsOrigins,
    [ENV_KEYS.UPLOAD_DIR]: uploadDir,
  };
}
