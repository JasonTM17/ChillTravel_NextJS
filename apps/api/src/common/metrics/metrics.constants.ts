/**
 * Prometheus custom metric injection tokens and names.
 *
 * These constants are used to inject custom metrics into services and
 * interceptors via NestJS DI.
 *
 * Requirements: Req 5.1
 * Design: §5 Observability Stack
 */

/** Histogram: HTTP request duration in seconds, labeled by route, method, status_code */
export const HTTP_REQUEST_DURATION_METRIC = 'http_request_duration_seconds';

/** Counter: Total HTTP requests, labeled by route, method, status_code */
export const HTTP_REQUESTS_TOTAL_METRIC = 'http_requests_total';

/** Gauge: Node.js heap size used in bytes */
export const NODEJS_HEAP_SIZE_USED_METRIC = 'nodejs_heap_size_used_bytes';

/** Histogram: Database query duration in seconds, labeled by operation */
export const DB_QUERY_DURATION_METRIC = 'db_query_duration_seconds';
