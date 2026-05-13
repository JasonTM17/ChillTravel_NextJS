import { Module } from '@nestjs/common';
import {
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';
import {
  DB_QUERY_DURATION_METRIC,
  HTTP_REQUEST_DURATION_METRIC,
  HTTP_REQUESTS_TOTAL_METRIC,
  NODEJS_HEAP_SIZE_USED_METRIC,
} from './metrics.constants';
import { MetricsInterceptor } from './metrics.interceptor';
import { HeapMetricsService } from './heap-metrics.service';
import { DbMetricsService } from './db-metrics.service';

/**
 * MetricsModule — registers custom Prometheus metrics for the WanderViet API.
 *
 * Provides:
 *   - `http_request_duration_seconds` — histogram by route, method, status_code
 *   - `http_requests_total` — counter by route, method, status_code
 *   - `nodejs_heap_size_used_bytes` — gauge (collected on interval)
 *   - `db_query_duration_seconds` — histogram by operation
 *
 * The MetricsInterceptor is exported so it can be registered as a global
 * interceptor in AppModule.
 *
 * Requirements: Req 5.1
 * Design: §5 Observability Stack
 */
@Module({
  providers: [
    makeHistogramProvider({
      name: HTTP_REQUEST_DURATION_METRIC,
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['route', 'method', 'status_code'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    }),
    makeCounterProvider({
      name: HTTP_REQUESTS_TOTAL_METRIC,
      help: 'Total number of HTTP requests',
      labelNames: ['route', 'method', 'status_code'],
    }),
    makeGaugeProvider({
      name: NODEJS_HEAP_SIZE_USED_METRIC,
      help: 'Node.js heap size used in bytes',
    }),
    makeHistogramProvider({
      name: DB_QUERY_DURATION_METRIC,
      help: 'Duration of database queries in seconds',
      labelNames: ['operation'],
      buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
    }),
    MetricsInterceptor,
    HeapMetricsService,
    DbMetricsService,
  ],
  exports: [
    MetricsInterceptor,
    HeapMetricsService,
    DbMetricsService,
    HTTP_REQUEST_DURATION_METRIC,
    HTTP_REQUESTS_TOTAL_METRIC,
    NODEJS_HEAP_SIZE_USED_METRIC,
    DB_QUERY_DURATION_METRIC,
  ],
})
export class MetricsModule {}
