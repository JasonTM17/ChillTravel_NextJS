import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MetricsInterceptor } from './metrics.interceptor';
import { of, throwError } from 'rxjs';
import type { CallHandler, ExecutionContext } from '@nestjs/common';

describe('MetricsInterceptor', () => {
  let interceptor: MetricsInterceptor;
  let mockHistogram: { observe: ReturnType<typeof vi.fn> };
  let mockCounter: { inc: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockHistogram = { observe: vi.fn() };
    mockCounter = { inc: vi.fn() };
    interceptor = new MetricsInterceptor(
      mockHistogram as never,
      mockCounter as never,
    );
  });

  function createMockContext(
    method: string,
    routePath: string,
    statusCode: number,
  ): { context: ExecutionContext; handler: CallHandler } {
    const request = { method, route: { path: routePath }, url: routePath };
    const response = { statusCode };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as unknown as ExecutionContext;
    const handler = { handle: () => of({ data: 'test' }) } as CallHandler;
    return { context, handler };
  }

  it('records duration histogram and counter on successful response', async () => {
    const { context, handler } = createMockContext('GET', '/api/v1/tours', 200);

    const result$ = interceptor.intercept(context, handler);
    await new Promise<void>((resolve) => {
      result$.subscribe({ complete: resolve });
    });

    expect(mockHistogram.observe).toHaveBeenCalledTimes(1);
    expect(mockCounter.inc).toHaveBeenCalledTimes(1);

    const [labels] = mockHistogram.observe.mock.calls[0] as [Record<string, string>, number];
    expect(labels.method).toBe('GET');
    expect(labels.route).toBe('/api/v1/tours');
    expect(labels.status_code).toBe('200');
  });

  it('records metrics on error response', async () => {
    const request = { method: 'POST', route: { path: '/api/v1/bookings' }, url: '/api/v1/bookings' };
    const response = { statusCode: 400 };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as unknown as ExecutionContext;
    const error = { getStatus: () => 400 };
    const handler = { handle: () => throwError(() => error) } as unknown as CallHandler;

    const result$ = interceptor.intercept(context, handler);

    let errorCaught = false;
    result$.subscribe({
      error: () => { errorCaught = true; },
    });

    // throwError is synchronous, so tap fires immediately
    expect(errorCaught).toBe(true);
    expect(mockHistogram.observe).toHaveBeenCalledTimes(1);
    expect(mockCounter.inc).toHaveBeenCalledTimes(1);

    const [labels] = mockHistogram.observe.mock.calls[0] as [Record<string, string>, number];
    expect(labels.method).toBe('POST');
    expect(labels.route).toBe('/api/v1/bookings');
    expect(labels.status_code).toBe('400');
  });

  it('uses URL path when route is not available', async () => {
    const request = { method: 'GET', url: '/metrics?format=json' };
    const response = { statusCode: 200 };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as unknown as ExecutionContext;
    const handler = { handle: () => of('metrics data') } as CallHandler;

    const result$ = interceptor.intercept(context, handler);
    await new Promise<void>((resolve) => {
      result$.subscribe({ complete: resolve });
    });

    const [labels] = mockHistogram.observe.mock.calls[0] as [Record<string, string>, number];
    expect(labels.route).toBe('/metrics');
  });

  it('records a positive duration value', async () => {
    const { context, handler } = createMockContext('GET', '/api/v1/health', 200);

    const result$ = interceptor.intercept(context, handler);
    await new Promise<void>((resolve) => {
      result$.subscribe({ complete: resolve });
    });

    const [, duration] = mockHistogram.observe.mock.calls[0] as [Record<string, string>, number];
    expect(duration).toBeGreaterThanOrEqual(0);
    expect(duration).toBeLessThan(1); // Should be very fast in tests
  });
});
