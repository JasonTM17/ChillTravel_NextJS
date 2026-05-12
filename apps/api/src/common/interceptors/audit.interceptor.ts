import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Optional
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, tap } from "rxjs";
import { AUDIT_KEY, type AuditMeta } from "../decorators/audit.decorator";
import type { AuthenticatedUser } from "../strategies/jwt.strategy";
import { AuditService } from "../services/audit.service";

interface RequestWithUser {
  user?: AuthenticatedUser;
  url?: string;
}

/**
 * AuditInterceptor — writes an AuditLog entry after a successful response
 * on any endpoint decorated with `@Audit(action, resourceType)`.
 *
 * The interceptor is non-blocking: audit failures are swallowed so they
 * never break the primary request.
 *
 * Req 20 / Design §5.6.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Optional() private readonly auditService?: AuditService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const meta = this.reflector.getAllAndOverride<AuditMeta | undefined>(AUDIT_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!meta || !this.auditService) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const actorId = request.user?.id;

    return next.handle().pipe(
      tap((responseData: unknown) => {
        // Extract resourceId from the response if it has an `id` field
        const resourceId =
          responseData !== null &&
          typeof responseData === "object" &&
          "id" in responseData &&
          typeof (responseData as { id: unknown }).id === "string"
            ? (responseData as { id: string }).id
            : undefined;

        // Fire-and-forget — don't await so we don't block the response
        void this.auditService!.log({
          actorId,
          action: meta.action,
          resourceType: meta.resourceType,
          resourceId,
          metadata: { path: request["url"] }
        });
      })
    );
  }
}
