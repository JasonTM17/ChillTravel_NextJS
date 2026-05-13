import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import type { Histogram } from 'prom-client';
import { DB_QUERY_DURATION_METRIC } from './metrics.constants';

/**
 * DbMetricsService — records database query durations.
 *
 * Provides a simple API for recording Prisma query durations into the
 * `db_query_duration_seconds` histogram, labeled by operation type
 * (e.g., findMany, create, update, delete, raw).
 *
 * Usage:
 *   this.dbMetrics.observeQuery('findMany', durationInSeconds);
 *
 * Requirements: Req 5.1
 * Design: §5 Observability Stack
 */
@Injectable()
export class DbMetricsService {
  constructor(
    @InjectMetric(DB_QUERY_DURATION_METRIC)
    private readonly dbQueryDuration: Histogram,
  ) {}

  /**
   * Record a database query duration.
   * @param operation - The type of operation (e.g., 'findMany', 'create', 'update', 'delete', 'raw')
   * @param durationSeconds - Duration in seconds
   */
  observeQuery(operation: string, durationSeconds: number): void {
    this.dbQueryDuration.observe({ operation }, durationSeconds);
  }

  /**
   * Start a timer for a database query. Returns a function that, when called,
   * records the elapsed time.
   * @param operation - The type of operation
   * @returns A function to call when the query completes
   */
  startTimer(operation: string): () => void {
    const startTime = process.hrtime.bigint();
    return () => {
      const durationSeconds = Number(process.hrtime.bigint() - startTime) / 1e9;
      this.dbQueryDuration.observe({ operation }, durationSeconds);
    };
  }
}
