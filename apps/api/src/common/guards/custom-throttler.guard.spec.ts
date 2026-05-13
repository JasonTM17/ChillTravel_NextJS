import { ExecutionContext } from '@nestjs/common';
import { ThrottlerException, ThrottlerLimitDetail } from '@nestjs/throttler';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomThrottlerGuard } from './custom-throttler.guard';

describe('CustomThrottlerGuard', () => {
  let guard: CustomThrottlerGuard;

  beforeEach(() => {
    // Create an instance without full DI — we only test the throwThrottlingException override
    guard = Object.create(CustomThrottlerGuard.prototype);
  });

  describe('throwThrottlingException', () => {
    it('sets Retry-After header and throws ThrottlerException', async () => {
      const headerFn = vi.fn();
      const mockResponse = { header: headerFn };
      const mockContext = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => ({}),
        }),
      } as unknown as ExecutionContext;

      const throttlerLimitDetail: ThrottlerLimitDetail = {
        limit: 100,
        ttl: 60000,
        key: 'test-key',
        tracker: 'test-tracker',
        totalHits: 101,
        timeToExpire: 45000,
        timeToBlockExpire: 45000,
        isBlocked: false,
      };

      await expect(
        (guard as any).throwThrottlingException(mockContext, throttlerLimitDetail),
      ).rejects.toThrow(ThrottlerException);

      expect(headerFn).toHaveBeenCalledWith('Retry-After', '45');
    });

    it('rounds up Retry-After to the nearest second', async () => {
      const headerFn = vi.fn();
      const mockResponse = { header: headerFn };
      const mockContext = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => ({}),
        }),
      } as unknown as ExecutionContext;

      const throttlerLimitDetail: ThrottlerLimitDetail = {
        limit: 100,
        ttl: 60000,
        key: 'test-key',
        tracker: 'test-tracker',
        totalHits: 101,
        timeToExpire: 1500,
        timeToBlockExpire: 1500, // 1.5 seconds → should round up to 2
        isBlocked: false,
      };

      await expect(
        (guard as any).throwThrottlingException(mockContext, throttlerLimitDetail),
      ).rejects.toThrow(ThrottlerException);

      expect(headerFn).toHaveBeenCalledWith('Retry-After', '2');
    });

    it('includes retry time in the exception message', async () => {
      const headerFn = vi.fn();
      const mockResponse = { header: headerFn };
      const mockContext = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => ({}),
        }),
      } as unknown as ExecutionContext;

      const throttlerLimitDetail: ThrottlerLimitDetail = {
        limit: 100,
        ttl: 60000,
        key: 'test-key',
        tracker: 'test-tracker',
        totalHits: 101,
        timeToExpire: 30000,
        timeToBlockExpire: 30000,
        isBlocked: false,
      };

      try {
        await (guard as any).throwThrottlingException(mockContext, throttlerLimitDetail);
      } catch (error) {
        expect(error).toBeInstanceOf(ThrottlerException);
        expect((error as ThrottlerException).message).toContain('30 second(s)');
      }
    });
  });
});
