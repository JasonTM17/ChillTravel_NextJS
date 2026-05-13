import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import type { Gauge } from 'prom-client';
import { NODEJS_HEAP_SIZE_USED_METRIC } from './metrics.constants';

/**
 * HeapMetricsService — periodically collects Node.js heap usage.
 *
 * Updates the `nodejs_heap_size_used_bytes` gauge every 10 seconds so
 * Prometheus scrapes always get a recent value.
 *
 * Requirements: Req 5.1
 * Design: §5 Observability Stack
 */
@Injectable()
export class HeapMetricsService implements OnModuleInit, OnModuleDestroy {
  private intervalHandle: ReturnType<typeof setInterval> | null = null;

  constructor(
    @InjectMetric(NODEJS_HEAP_SIZE_USED_METRIC)
    private readonly heapGauge: Gauge,
  ) {}

  onModuleInit(): void {
    // Collect immediately on startup
    this.collectHeapMetrics();
    // Then collect every 10 seconds
    this.intervalHandle = setInterval(() => this.collectHeapMetrics(), 10_000);
  }

  onModuleDestroy(): void {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }

  private collectHeapMetrics(): void {
    const memUsage = process.memoryUsage();
    this.heapGauge.set(memUsage.heapUsed);
  }
}
