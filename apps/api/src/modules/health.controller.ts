import { Controller, Get, Res } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { envelope } from "@vietwander/shared";
import { Public } from "../common/decorators/public.decorator";
import { PrismaService } from "../prisma/prisma.service";
import { register } from "prom-client";

@ApiTags("Health")
@Controller("health")
@Public()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  /** GET /health — aggregate liveness + readiness */
  @Get()
  @ApiOperation({ summary: "Health check (aggregate)" })
  @ApiResponse({ status: 200, description: "Service is healthy" })
  health() {
    return envelope({
      status: "ok",
      service: "wanderviet-api",
      version: "1.0.0",
      paymentMode: "mock",
      aiRuntime: "local-first",
      uptime: Math.floor(process.uptime())
    });
  }

  /** GET /health/live — Kubernetes liveness probe */
  @Get("live")
  @ApiOperation({ summary: "Liveness probe — is the process alive?" })
  @ApiResponse({ status: 200, description: "Process is alive" })
  live() {
    return envelope({ status: "alive", uptime: Math.floor(process.uptime()) });
  }

  /** GET /health/ready — Kubernetes readiness probe */
  @Get("ready")
  @ApiOperation({ summary: "Readiness probe — is the DB connected?" })
  @ApiResponse({ status: 200, description: "Service is ready" })
  @ApiResponse({ status: 503, description: "Service not ready" })
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return envelope({ status: "ready", db: "connected" });
    } catch {
      return envelope({ status: "not_ready", db: "disconnected" });
    }
  }

  /** GET /metrics — Prometheus metrics endpoint */
  @Get("/metrics")
  @ApiOperation({ summary: "Prometheus metrics" })
  @ApiResponse({ status: 200, description: "Prometheus metrics in text format" })
  async metrics(@Res() res: { set: (k: string, v: string) => void; end: (body: string) => void }) {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  }
}
