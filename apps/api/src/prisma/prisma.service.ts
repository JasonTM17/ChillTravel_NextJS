import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@vietwander/db";

/**
 * PrismaService — wraps Prisma 7 client with the pg driver adapter.
 *
 * Connection string is resolved from ConfigService (DATABASE_URL). The
 * `onModuleInit` hook eagerly opens the pool so the app fails fast on
 * misconfiguration, and `onModuleDestroy` gracefully disconnects when the
 * Nest application shuts down.
 *
 * See design.md §5.1 and packages/db/prisma/seed.ts for the reference adapter
 * construction pattern.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>("DATABASE_URL");
    if (!connectionString) {
      throw new Error("DATABASE_URL is not configured");
    }
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log("Prisma connected to PostgreSQL");
    } catch (err) {
      this.logger.error("Prisma failed to connect", err as Error);
      throw err;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
