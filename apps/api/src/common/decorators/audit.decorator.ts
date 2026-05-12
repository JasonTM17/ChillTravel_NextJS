import { SetMetadata } from "@nestjs/common";

export const AUDIT_KEY = "audit";

export interface AuditMeta {
  action: string;
  resourceType: string;
}

/**
 * Decorator that marks a controller method for audit logging.
 * The AuditInterceptor reads this metadata and writes to AuditLog after
 * a successful response.
 *
 * @example
 * @Audit('CREATE_TOUR', 'Tour')
 * @Post('admin/tours')
 * create(@Body() dto: CreateTourDto) { ... }
 *
 * Req 20 / Design §5.6.
 */
export const Audit = (action: string, resourceType: string) =>
  SetMetadata(AUDIT_KEY, { action, resourceType } satisfies AuditMeta);
