import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@vietwander/db';

/**
 * Mask PII in SQL query parameters for safe logging.
 * Replaces email-like patterns, phone numbers, and long strings with [MASKED].
 */
function maskPii(params: string): string {
  return params
    // Mask email patterns
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[MASKED_EMAIL]')
    // Mask phone patterns (10+ digits)
    .replace(/\b\d{10,}\b/g, '[MASKED_PHONE]')
    // Mask long quoted strings (potential PII like names, addresses)
    .replace(/'[^']{20,}'/g, "'[MASKED]'");
}

/**
 * PrismaService — wraps Prisma 7 client with the pg driver adapter.
 *
 * Connection string is resolved from ConfigService (DATABASE_URL). The
 * `onModuleInit` hook eagerly opens the pool so the app fails fast on
 * misconfiguration, and `onModuleDestroy` gracefully disconnects when the
 * Nest application shuts down.
 *
 * In dev mode, logs slow queries (≥ 200ms) with masked PII (Req 5.5, 5.6).
 *
 * See design.md §5.1 and packages/db/prisma/seed.ts for the reference adapter
 * construction pattern.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly isDev: boolean;

  constructor(private readonly configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL');
    if (!connectionString) {
      throw new Error('DATABASE_URL is not configured');
    }
    const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';
    const isDev = nodeEnv === 'development';

    const adapter = new PrismaPg({ connectionString });
    super({
      adapter,
      log: isDev
        ? [{ emit: 'event', level: 'query' }]
        : undefined,
    });

    this.isDev = isDev;
  }

  async onModuleInit(): Promise<void> {
    // Register slow query logging in dev mode (Req 5.6)
    if (this.isDev) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).$on('query', (e: { query: string; params: string; duration: number }) => {
        if (e.duration >= 200) {
          const maskedParams = maskPii(e.params ?? '');
          this.logger.warn(
            `Slow query (${e.duration}ms): ${e.query} | Params: ${maskedParams}`,
          );
        }
      });
    }

    try {
      await this.$connect();
      this.logger.log('Prisma connected to PostgreSQL');
    } catch (err) {
      this.logger.error('Prisma failed to connect', err as Error);
      throw err;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
