import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { RequestIdMiddleware } from './request-id.middleware';

/**
 * Property-based tests for RequestIdMiddleware.
 *
 * Feature: wanderviet-pro-upgrade-plan, Property 8: Request Middleware Structured Output
 *
 * **Validates: Requirements 5.2, 5.3**
 *
 * Properties verified:
 *   1. Response always contains X-Request-Id header with a valid UUID v4
 *   2. If incoming request has X-Request-Id, it is propagated unchanged
 *   3. If no incoming X-Request-Id, a new UUID v4 is generated
 *   4. The requestId is attached to the request object
 */

// UUID v4 regex pattern
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// General UUID regex (any version)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Arbitrary that generates valid UUID strings using fast-check's built-in uuid().
 */
const uuidArb = fc.uuid();

/**
 * Arbitrary that generates non-empty strings that are NOT UUIDs.
 */
const nonUuidStringArb = fc.string({ minLength: 1, maxLength: 100 }).filter(
  (s) => !UUID_REGEX.test(s),
);

/**
 * Creates a mock Express request object.
 */
function createMockRequest(headers: Record<string, string | undefined> = {}): {
  headers: Record<string, string | undefined>;
  requestId?: string;
  id?: string;
} {
  return { headers };
}

/**
 * Creates a mock Express response object that captures setHeader calls.
 */
function createMockResponse(): {
  headers: Record<string, string>;
  setHeader: (name: string, value: string) => void;
  statusCode: number;
} {
  const headers: Record<string, string> = {};
  return {
    headers,
    setHeader(name: string, value: string) {
      headers[name] = value;
    },
    statusCode: 200,
  };
}

describe('RequestIdMiddleware — Property Tests', () => {
  const middleware = new RequestIdMiddleware();

  it('Property 8.1: Response always contains X-Request-Id header with valid UUID v4 when no incoming header', () => {
    fc.assert(
      fc.property(fc.constant(undefined), () => {
        const req = createMockRequest({});
        const res = createMockResponse();
        let called = false;

        middleware.use(req as any, res as any, () => { called = true; });

        expect(called).toBe(true);
        expect(res.headers['X-Request-Id']).toBeDefined();
        expect(res.headers['X-Request-Id']).toMatch(UUID_V4_REGEX);
      }),
      { numRuns: 100 },
    );
  });

  it('Property 8.2: If incoming request has X-Request-Id, it is propagated unchanged to response', () => {
    fc.assert(
      fc.property(uuidArb, (incomingId) => {
        const req = createMockRequest({ 'x-request-id': incomingId });
        const res = createMockResponse();
        let called = false;

        middleware.use(req as any, res as any, () => { called = true; });

        expect(called).toBe(true);
        expect(res.headers['X-Request-Id']).toBe(incomingId);
      }),
      { numRuns: 100 },
    );
  });

  it('Property 8.3: requestId is always attached to the request object', () => {
    fc.assert(
      fc.property(
        fc.option(uuidArb, { nil: undefined }),
        (maybeId) => {
          const req = createMockRequest(
            maybeId ? { 'x-request-id': maybeId } : {},
          );
          const res = createMockResponse();

          middleware.use(req as any, res as any, () => {});

          // requestId should be set on the request
          expect((req as any).requestId).toBeDefined();
          expect(typeof (req as any).requestId).toBe('string');
          expect((req as any).requestId.length).toBeGreaterThan(0);

          // req.id should also be set for nestjs-pino
          expect((req as any).id).toBeDefined();
          expect((req as any).id).toBe((req as any).requestId);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('Property 8.4: When incoming header is empty string, a new UUID v4 is generated', () => {
    fc.assert(
      fc.property(fc.constant(''), () => {
        const req = createMockRequest({ 'x-request-id': '' });
        const res = createMockResponse();

        middleware.use(req as any, res as any, () => {});

        // Empty string should be treated as absent — generate new UUID
        expect(res.headers['X-Request-Id']).toMatch(UUID_V4_REGEX);
        expect((req as any).requestId).toMatch(UUID_V4_REGEX);
      }),
      { numRuns: 100 },
    );
  });

  it('Property 8.5: Non-UUID incoming X-Request-Id is still propagated (passthrough)', () => {
    fc.assert(
      fc.property(nonUuidStringArb, (arbitraryId) => {
        const req = createMockRequest({ 'x-request-id': arbitraryId });
        const res = createMockResponse();

        middleware.use(req as any, res as any, () => {});

        // Non-empty strings are propagated as-is (middleware trusts upstream)
        expect(res.headers['X-Request-Id']).toBe(arbitraryId);
        expect((req as any).requestId).toBe(arbitraryId);
      }),
      { numRuns: 100 },
    );
  });

  it('Property 8.6: next() is always called exactly once', () => {
    fc.assert(
      fc.property(
        fc.option(uuidArb, { nil: undefined }),
        (maybeId) => {
          const req = createMockRequest(
            maybeId ? { 'x-request-id': maybeId } : {},
          );
          const res = createMockResponse();
          let callCount = 0;

          middleware.use(req as any, res as any, () => { callCount++; });

          expect(callCount).toBe(1);
        },
      ),
      { numRuns: 100 },
    );
  });
});
