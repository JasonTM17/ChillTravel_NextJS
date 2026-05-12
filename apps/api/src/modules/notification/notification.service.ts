import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { NotificationType } from "@vietwander/db";
import { PrismaService } from "../../prisma/prisma.service";
import { buildPagination } from "../../common/dto/paginated-response.dto";
import type { NotificationQueryDto } from "./dto/notification-query.dto";

/**
 * NotificationService — in-app notification business logic.
 *
 * Handles:
 *  - list: paginated notifications for a user, ordered by createdAt desc.
 *  - markRead: mark a single notification as read (ownership check).
 *  - markAllRead: mark all unread notifications for a user as read.
 *  - create: create a notification record (called by other services).
 *
 * Req 37 / Design §18.1 Notification model.
 */
@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // list — paginated notifications for the authenticated user
  // ---------------------------------------------------------------------------

  async list(userId: string, query: NotificationQueryDto) {
    const page = query.page ?? 0;
    const size = query.size ?? 10;
    const skip = page * size;

    const where: { userId: string; read?: boolean } = { userId };
    if (query.unreadOnly === true) {
      where.read = false;
    }

    const [items, totalElements] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: size,
        orderBy: { createdAt: "desc" }
      }),
      this.prisma.notification.count({ where })
    ]);

    return buildPagination(items, page, size, totalElements);
  }

  // ---------------------------------------------------------------------------
  // markRead — mark a single notification as read (owner only)
  // ---------------------------------------------------------------------------

  async markRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification) {
      throw new NotFoundException("Không tìm thấy thông báo");
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException("Bạn không có quyền truy cập thông báo này");
    }

    if (notification.read) {
      // Already read — return as-is (idempotent)
      return notification;
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    });
  }

  // ---------------------------------------------------------------------------
  // markAllRead — mark all unread notifications for a user as read
  // ---------------------------------------------------------------------------

  async markAllRead(userId: string): Promise<{ count: number }> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    });

    return { count: result.count };
  }

  // ---------------------------------------------------------------------------
  // create — create a notification record (called by other services)
  // ---------------------------------------------------------------------------

  async create(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    link?: string
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        link: link ?? null,
        read: false
      }
    });
  }
}
