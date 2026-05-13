import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';

/**
 * Custom ThrottlerGuard that adds a `Retry-After` header to HTTP 429 responses.
 *
 * Extends the default NestJS ThrottlerGuard to comply with RFC 6585 §4 which
 * recommends including a Retry-After header when rate limiting is applied.
 *
 * Requirements: Req 4.3
 * Design: §4 Security Middleware Stack
 */
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  /**
   * Override to attach the Retry-After header before throwing the 429 exception.
   *
   * The `Retry-After` value is the TTL (time-to-live) of the throttle window
   * expressed in seconds, telling the client how long to wait before retrying.
   */
  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    const response = context.switchToHttp().getResponse<{ header: (name: string, value: string) => void }>();

    // timeToBlockExpire is in milliseconds — convert to seconds for the header
    const retryAfterSeconds = Math.ceil(throttlerLimitDetail.timeToBlockExpire / 1000);
    response.header('Retry-After', String(retryAfterSeconds));

    throw new ThrottlerException(`Too many requests. Please try again in ${retryAfterSeconds} second(s).`);
  }
}
