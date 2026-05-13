import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { envelope } from '@vietwander/shared';
import { Public } from '../common/decorators/public.decorator';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
@Public()
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly health: HealthCheckService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * GET /health — production health check (Req 5.7)
   *
   * Returns `{ status: "ok", db: "up", redis: "up" | "down" }` within 500ms.
   * Uses @nestjs/terminus for structured health indicators.
   */
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check — DB + Redis status (Req 5.7)' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @ApiResponse({ status: 503, description: 'Service degraded' })
  async check() {
    const result = await this.health.check([
      () => this.checkDatabase(),
      () => this.checkRedis(),
    ]);

    const dbStatus = result.details?.['database']?.status === 'up' ? 'up' : 'down';
    const redisStatus = result.details?.['redis']?.status === 'up' ? 'up' : 'down';

    return {
      status: result.status === 'ok' ? 'ok' : 'degraded',
      db: dbStatus,
      redis: redisStatus,
    };
  }

  /** GET /health/live — Kubernetes liveness probe */
  @Get('live')
  @ApiOperation({ summary: 'Liveness probe — is the process alive?' })
  @ApiResponse({ status: 200, description: 'Process is alive' })
  live() {
    return envelope({ status: 'alive', uptime: Math.floor(process.uptime()) });
  }

  /** GET /health/ready — Kubernetes readiness probe */
  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe — is the DB connected?' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  @ApiResponse({ status: 503, description: 'Service not ready' })
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return envelope({ status: 'ready', db: 'connected' });
    } catch {
      return envelope({ status: 'not_ready', db: 'disconnected' });
    }
  }

  // ─── Private health indicators ──────────────────────────────────────────────

  private async checkDatabase(): Promise<HealthIndicatorResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { database: { status: 'up' } };
    } catch {
      return { database: { status: 'down' } };
    }
  }

  private async checkRedis(): Promise<HealthIndicatorResult> {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (!redisUrl) {
      return { redis: { status: 'down', message: 'REDIS_URL not configured' } };
    }

    try {
      // Lightweight TCP check — connect and disconnect within timeout
      const url = new URL(redisUrl);
      const net = await import('node:net');
      const isUp = await new Promise<boolean>((resolve) => {
        const socket = net.createConnection(
          { host: url.hostname, port: Number(url.port) || 6379, timeout: 300 },
          () => {
            socket.destroy();
            resolve(true);
          },
        );
        socket.on('error', () => {
          socket.destroy();
          resolve(false);
        });
        socket.on('timeout', () => {
          socket.destroy();
          resolve(false);
        });
      });

      return { redis: { status: isUp ? 'up' : 'down' } };
    } catch {
      return { redis: { status: 'down' } };
    }
  }
}
