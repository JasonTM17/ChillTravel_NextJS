import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../common/services/audit.service";
import { buildPagination } from "../../common/dto/paginated-response.dto";
import type { PaginationQueryDto } from "../../common/dto/pagination.dto";
import type { CreateReviewDto } from "./dto/create-review.dto";

/**
 * ReviewService — business logic for reviews.
 *
 * Handles:
 *  - listByTour: paginated APPROVED reviews for a tour.
 *  - create: verify user has a COMPLETED booking for the tour, then create PENDING review.
 *  - update: owner-only update.
 *  - remove: owner-only delete.
 *  - adminList: paginated all reviews with optional status filter.
 *  - approve / reject / hide: admin moderation with audit log.
 *
 * Req 13, 20 / Design §3.3 Reviews.
 */
@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService
  ) {}

  // ---------------------------------------------------------------------------
  // Public: list APPROVED reviews for a tour (paginated)
  // ---------------------------------------------------------------------------

  async listByTour(tourId: string, query: PaginationQueryDto) {
    const page = query.page ?? 0;
    const size = query.size ?? 10;
    const skip = page * size;

    const [items, totalElements] = await Promise.all([
      this.prisma.review.findMany({
        where: { tourId, status: "APPROVED" },
        skip,
        take: size,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, fullName: true, avatarUrl: true }
          }
        }
      }),
      this.prisma.review.count({ where: { tourId, status: "APPROVED" } })
    ]);

    return buildPagination(items, page, size, totalElements);
  }

  // ---------------------------------------------------------------------------
  // User: create review (requires COMPLETED booking)
  // ---------------------------------------------------------------------------

  async create(userId: string, tourId: string, dto: CreateReviewDto) {
    // Check tour exists
    const tour = await this.prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour || tour.status === "DELETED") {
      throw new NotFoundException("Tour không tồn tại");
    }

    // Check user has at least one COMPLETED booking for this tour
    const completedBooking = await this.prisma.booking.findFirst({
      where: {
        userId,
        tourId,
        status: "completed"
      }
    });

    if (!completedBooking) {
      throw new ForbiddenException(
        "Bạn chỉ có thể đánh giá tour sau khi hoàn thành chuyến đi"
      );
    }

    const review = await this.prisma.review.create({
      data: {
        userId,
        tourId,
        rating: dto.rating,
        title: dto.title ?? null,
        content: dto.content,
        status: "PENDING"
      },
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true }
        },
        tour: {
          select: { id: true, title: true, slug: true }
        }
      }
    });

    return review;
  }

  // ---------------------------------------------------------------------------
  // User: update own review
  // ---------------------------------------------------------------------------

  async update(userId: string, reviewId: string, dto: Partial<CreateReviewDto>) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });

    if (!review) {
      throw new NotFoundException("Không tìm thấy đánh giá");
    }

    if (review.userId !== userId) {
      throw new ForbiddenException("Bạn không có quyền chỉnh sửa đánh giá này");
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(dto.rating !== undefined && { rating: dto.rating }),
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.content !== undefined && { content: dto.content })
      },
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true }
        },
        tour: {
          select: { id: true, title: true, slug: true }
        }
      }
    });

    return updated;
  }

  // ---------------------------------------------------------------------------
  // User: delete own review
  // ---------------------------------------------------------------------------

  async remove(userId: string, reviewId: string): Promise<void> {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });

    if (!review) {
      throw new NotFoundException("Không tìm thấy đánh giá");
    }

    if (review.userId !== userId) {
      throw new ForbiddenException("Bạn không có quyền xóa đánh giá này");
    }

    await this.prisma.review.delete({ where: { id: reviewId } });
  }

  // ---------------------------------------------------------------------------
  // Admin: list all reviews with optional status filter (paginated)
  // ---------------------------------------------------------------------------

  async adminList(query: PaginationQueryDto & { status?: string }) {
    const page = query.page ?? 0;
    const size = query.size ?? 20;
    const skip = page * size;

    const where: Record<string, unknown> = {};
    if (query.status) {
      where["status"] = query.status;
    }

    const [items, totalElements] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: size,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, fullName: true, email: true, avatarUrl: true }
          },
          tour: {
            select: { id: true, title: true, slug: true }
          }
        }
      }),
      this.prisma.review.count({ where })
    ]);

    return buildPagination(items, page, size, totalElements);
  }

  // ---------------------------------------------------------------------------
  // Admin: approve review
  // ---------------------------------------------------------------------------

  async approve(reviewId: string, actorId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException("Không tìm thấy đánh giá");
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: { status: "APPROVED" },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        tour: { select: { id: true, title: true, slug: true } }
      }
    });

    await this.auditService.log({
      actorId,
      action: "APPROVE_REVIEW",
      resourceType: "Review",
      resourceId: reviewId,
      metadata: { tourId: review.tourId, userId: review.userId }
    });

    return updated;
  }

  // ---------------------------------------------------------------------------
  // Admin: reject review
  // ---------------------------------------------------------------------------

  async reject(reviewId: string, actorId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException("Không tìm thấy đánh giá");
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: { status: "REJECTED" },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        tour: { select: { id: true, title: true, slug: true } }
      }
    });

    await this.auditService.log({
      actorId,
      action: "REJECT_REVIEW",
      resourceType: "Review",
      resourceId: reviewId,
      metadata: { tourId: review.tourId, userId: review.userId }
    });

    return updated;
  }

  // ---------------------------------------------------------------------------
  // Admin: hide review
  // ---------------------------------------------------------------------------

  async hide(reviewId: string, actorId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException("Không tìm thấy đánh giá");
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: { status: "HIDDEN" },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        tour: { select: { id: true, title: true, slug: true } }
      }
    });

    await this.auditService.log({
      actorId,
      action: "HIDE_REVIEW",
      resourceType: "Review",
      resourceId: reviewId,
      metadata: { tourId: review.tourId, userId: review.userId }
    });

    return updated;
  }
}
