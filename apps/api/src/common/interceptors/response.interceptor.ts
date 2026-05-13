import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { successResponse, type ApiPaginated } from '@vietwander/shared';
import { Observable, map } from 'rxjs';

/**
 * Shapes the interceptor recognises as "already wrapped" and therefore
 * passes through unchanged.
 *
 * We cover two envelope families that currently coexist:
 *   - Legacy ChillTravel envelope from `envelope()` helper:
 *       `{ success: boolean, data, message, meta }`
 *   - New WanderViet envelope from `successResponse()` / `errorResponse()`:
 *       `{ success: boolean, message, data|errors, timestamp }`
 *
 * Both are detected via the presence of a boolean `success` property.
 */
function isAlreadyWrapped(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    typeof (value as { success: unknown }).success === 'boolean'
  );
}

/**
 * Loose duck-typing check for the {@link ApiPaginated} shape. When a handler
 * returns a raw paginated payload we still wrap it in {@link ApiSuccess}, but
 * leave the inner structure alone so the envelope looks like:
 *
 *     { success, message, data: { items, page, size, ... }, timestamp }
 */
function isRawPaginated(value: unknown): value is ApiPaginated<unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    Array.isArray(candidate.items) &&
    typeof candidate.page === 'number' &&
    typeof candidate.size === 'number' &&
    typeof candidate.totalElements === 'number'
  );
}

/**
 * Global response interceptor (design §3.2).
 *
 * Wraps controller return values in {@link ApiSuccess} using
 * {@link successResponse} from `@vietwander/shared`. Already-wrapped
 * responses (legacy envelope, manually-constructed envelopes, or values
 * returned from AI passthroughs) flow through untouched to avoid
 * double-wrapping.
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((value): unknown => {
        if (isAlreadyWrapped(value)) {
          return value;
        }
        // Raw paginated payloads are valid `data` inside ApiSuccess — the
        // duck-type check keeps the inner pagination fields intact.
        if (isRawPaginated(value)) {
          return successResponse(value);
        }
        return successResponse(value);
      }),
    );
  }
}
