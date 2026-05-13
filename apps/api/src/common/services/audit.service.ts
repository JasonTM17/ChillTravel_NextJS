import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@vietwander/db';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * AuditService — writes admin action records to the AuditLog table.
 *
 * Non-blocking: errors are logged but never propagate to the caller so that
 * a failed audit write never breaks the primary request.
 *
 * Req 20, Design §5.6.
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(params: {
    actorId?: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          actorId: params.actorId ?? null,
          action: params.action,
          entity: params.resourceType,
          resourceType: params.resourceType,
          resourceId: params.resourceId ?? null,
          metadata: params.metadata ? (params.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
        },
      });
    } catch (err) {
      // Non-blocking — log error but don't fail the request
      this.logger.error('Failed to write audit log', err);
    }
  }
}
