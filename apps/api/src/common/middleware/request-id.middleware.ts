import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

/**
 * Minimal request/response interfaces matching Express signatures.
 * Avoids hard dependency on @types/express which may not be installed.
 */
interface HttpRequest {
  headers: Record<string, string | string[] | undefined>;
  requestId?: string;
  id?: string;
}

interface HttpResponse {
  setHeader(name: string, value: string): void;
}

/**
 * RequestIdMiddleware — generates or propagates a UUID v4 request ID.
 *
 * Behavior:
 *   1. Checks for an incoming `X-Request-Id` header; uses it if present and non-empty.
 *   2. Generates a new UUID v4 if no header is provided.
 *   3. Attaches the ID to `req.requestId` for downstream access.
 *   4. Sets the `X-Request-Id` response header so clients can correlate.
 *   5. The ID is automatically picked up by nestjs-pino via `genReqId` in the
 *      LoggerModule config, ensuring it propagates through the entire log context.
 *
 * Requirements: Req 5.2, 5.3
 * Design: §5 Observability Stack, Property 8
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: HttpRequest, res: HttpResponse, next: () => void): void {
    const incoming = req.headers['x-request-id'];
    const requestId =
      typeof incoming === 'string' && incoming.length > 0
        ? incoming
        : randomUUID();

    // Attach to request for downstream consumers (guards, interceptors, services)
    req.requestId = requestId;

    // Also set as req.id so nestjs-pino picks it up via genReqId
    req.id = requestId;

    // Set response header for client correlation
    res.setHeader('X-Request-Id', requestId);

    next();
  }
}
