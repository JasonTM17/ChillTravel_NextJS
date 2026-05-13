import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Observable, tap } from 'rxjs';
import type { Counter, Histogram } from 'prom-client';
import {
  HTTP_REQUEST_DURATION_METRIC,
  HTTP_REQUESTS_TOTAL_METRIC,
} from './metrics.constants';

/**
 * MetricsInterceptor — records HTTP request duration and count.
 *
 * Automatically observes every HTTP request and records:
 *   - `http_request_duration_seconds` histogram (route, method, status_code)
 *   - `http_requests_total` counter (route, method, status_code)
 *
 * The route label uses the matched NestJS route pattern (e.g., `/api/v1/tours/:id`)
 * rather than the full URL to keep cardinality bounded.
 *
 * Requirements: Req 5.1
 * Design: §5 Observability Stack
 */
@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric(HTTP_REQUEST_DURATION_METRIC)
    private readonly httpDuration: Histogram,
    @InjectMetric(HTTP_REQUESTS_TOTAL_METRIC)
    private readonly httpTotal: Counter,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<{
      method: string;
      route?: { path: string };
      url: string;
    }>();

    const method = request.method;
    // Use the matched route pattern for bounded cardinality; fall back to URL path
    const route = request.route?.path ?? request.url.split('?')[0] ?? 'unknown';
    const startTime = process.hrtime.bigint();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = httpContext.getResponse<{ statusCode: number }>();
          this.recordMetrics(method, route, response.statusCode, startTime);
        },
        error: (error: { status?: number; getStatus?: () => number }) => {
          const statusCode = error.getStatus?.() ?? error.status ?? 500;
          this.recordMetrics(method, route, statusCode, startTime);
        },
      }),
    );
  }

  private recordMetrics(
    method: string,
    route: string,
    statusCode: number,
    startTime: bigint,
  ): void {
    const durationSeconds = Number(process.hrtime.bigint() - startTime) / 1e9;
    const labels = {
      method,
      route,
      status_code: String(statusCode),
    };

    this.httpDuration.observe(labels, durationSeconds);
    this.httpTotal.inc(labels);
  }
}
