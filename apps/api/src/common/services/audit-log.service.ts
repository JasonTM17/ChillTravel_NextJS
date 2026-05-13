/**
 * AuditLogService — re-exports AuditService for naming consistency.
 *
 * The canonical implementation lives in `./audit.service.ts`. This file
 * provides the `AuditLogService` alias referenced by the pro-upgrade spec
 * (Task 4.4, Req 4.9) without duplicating logic.
 */
export { AuditService as AuditLogService } from './audit.service';
