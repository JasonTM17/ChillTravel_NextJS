import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import type { AuthenticatedUser } from "../../common/strategies/jwt.strategy";
import { PaginationQueryDto } from "../../common/dto/pagination.dto";
import { buildPagination } from "../../common/dto/paginated-response.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../common/services/audit.service";
import {
  UpdateBookingStatusDto,
  UpdatePaymentStatusDto
} from "./dto/update-booking-status.dto";

/**
 * AdminBookingController — admin endpoints for booking management.
 *
 * All endpoints require ADMIN role (enforced via @Roles + global RolesGuard).
 *
 * Endpoints:
 *   GET  /admin/bookings              — list all bookings (filter + paginate)
 *   GET  /admin/bookings/:id          — booking detail with guest list
 *   PUT  /admin/bookings/:id/status   — update booking status + audit log
 *   PUT  /admin/bookings/:id/payment-status — update payment status + audit log
 *
 * Req 11, 20 / Design §3.3 Admin Booking.
 */
@ApiTags("Admin — Bookings")
@ApiBearerAuth()
@Roles("ADMIN")
@Controller()
export class AdminBookingController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService
  ) {}

  // =========================================================================
  // GET /admin/bookings
  // =========================================================================

  /**
   * List all bookings with optional status/paymentStatus filters and pagination.
   * Req 11 — Admin only.
   */
  @Get("admin/bookings")
  @ApiOperation({
    summary: "List all bookings (Admin)",
    description:
      "Returns a paginated list of all bookings. Supports optional filtering by status and paymentStatus."
  })
  @ApiQuery({
    name: "status",
    required: false,
    enum: ["pending", "confirmed", "cancelled", "completed", "refunded_mock"],
    description: "Filter by booking status"
  })
  @ApiQuery({
    name: "paymentStatus",
    required: false,
    enum: ["pending", "confirmed_mock", "failed_mock", "refunded_mock"],
    description: "Filter by payment status"
  })
  @ApiResponse({ status: 200, description: "Paginated list of bookings" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden — ADMIN role required" })
  async listBookings(
    @Query() pagination: PaginationQueryDto,
    @Query("status") status?: string,
    @Query("paymentStatus") paymentStatus?: string
  ) {
    const page = pagination.page ?? 0;
    const size = pagination.size ?? 20;
    const skip = page * size;

    // Build where clause
    const where: Record<string, unknown> = {};
    if (status) where["status"] = status;
    if (paymentStatus) where["paymentStatus"] = paymentStatus;

    const [items, totalElements] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: size,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              phone: true
            }
          },
          tour: {
            select: {
              id: true,
              title: true,
              slug: true,
              imageUrl: true,
              durationDays: true,
              durationNights: true
            }
          },
          departure: {
            select: {
              id: true,
              departureDate: true,
              returnDate: true
            }
          },
          payment: {
            select: {
              id: true,
              status: true,
              amount: true,
              paidAt: true,
              transactionCode: true
            }
          }
        }
      }),
      this.prisma.booking.count({ where })
    ]);

    return buildPagination(items, page, size, totalElements);
  }

  // =========================================================================
  // GET /admin/bookings/:id
  // =========================================================================

  /**
   * Get booking detail by ID including guest list.
   * Req 11 — Admin only.
   */
  @Get("admin/bookings/:id")
  @ApiOperation({
    summary: "Get booking detail (Admin)",
    description:
      "Returns full booking detail including tour info, user info, guest list, payment, and coupon."
  })
  @ApiParam({ name: "id", description: "Booking ID" })
  @ApiResponse({ status: 200, description: "Booking detail" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden — ADMIN role required" })
  @ApiResponse({ status: 404, description: "Booking not found" })
  async getBooking(@Param("id") id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            avatarUrl: true
          }
        },
        tour: {
          select: {
            id: true,
            title: true,
            slug: true,
            imageUrl: true,
            durationDays: true,
            durationNights: true,
            basePrice: true,
            salePrice: true
          }
        },
        departure: true,
        guests: true,
        payment: true,
        coupon: {
          select: {
            id: true,
            code: true,
            discountType: true,
            discountValue: true
          }
        }
      }
    });

    if (!booking) {
      throw new NotFoundException("Không tìm thấy booking");
    }

    return booking;
  }

  // =========================================================================
  // PUT /admin/bookings/:id/status
  // =========================================================================

  /**
   * Update booking status and write an audit log entry.
   * Req 11, 20 — Admin only.
   */
  @Put("admin/bookings/:id/status")
  @ApiOperation({
    summary: "Update booking status (Admin)",
    description:
      "Updates the booking status and writes an audit log entry with old/new status metadata."
  })
  @ApiParam({ name: "id", description: "Booking ID" })
  @ApiResponse({ status: 200, description: "Booking status updated" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden — ADMIN role required" })
  @ApiResponse({ status: 404, description: "Booking not found" })
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateBookingStatusDto,
    @CurrentUser() actor: AuthenticatedUser
  ) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      throw new BadRequestException("Không tìm thấy booking");
    }

    const oldStatus = booking.status;

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: dto.status as never },
      include: {
        user: {
          select: { id: true, email: true, fullName: true }
        },
        tour: {
          select: { id: true, title: true, slug: true }
        },
        payment: {
          select: { id: true, status: true, amount: true }
        }
      }
    });

    // Write audit log (non-blocking)
    await this.auditService.log({
      actorId: actor?.id,
      action: "UPDATE_BOOKING_STATUS",
      resourceType: "Booking",
      resourceId: id,
      metadata: {
        oldStatus,
        newStatus: dto.status,
        bookingCode: booking.bookingCode
      }
    });

    return updated;
  }

  // =========================================================================
  // PUT /admin/bookings/:id/payment-status
  // =========================================================================

  /**
   * Update booking payment status (and the linked Payment record) + audit log.
   * Req 11, 20 — Admin only.
   */
  @Put("admin/bookings/:id/payment-status")
  @ApiOperation({
    summary: "Update booking payment status (Admin)",
    description:
      "Updates the booking paymentStatus and the linked Payment.status, then writes an audit log entry."
  })
  @ApiParam({ name: "id", description: "Booking ID" })
  @ApiResponse({ status: 200, description: "Payment status updated" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden — ADMIN role required" })
  @ApiResponse({ status: 404, description: "Booking not found" })
  async updatePaymentStatus(
    @Param("id") id: string,
    @Body() dto: UpdatePaymentStatusDto,
    @CurrentUser() actor: AuthenticatedUser
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { payment: true }
    });

    if (!booking) {
      throw new BadRequestException("Không tìm thấy booking");
    }

    const oldPaymentStatus = booking.paymentStatus;

    // Update booking.paymentStatus + payment.status atomically
    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedBooking = await tx.booking.update({
        where: { id },
        data: { paymentStatus: dto.paymentStatus as never },
        include: {
          user: {
            select: { id: true, email: true, fullName: true }
          },
          tour: {
            select: { id: true, title: true, slug: true }
          },
          payment: true
        }
      });

      // Also update the linked Payment record if it exists
      if (booking.payment) {
        await tx.payment.update({
          where: { bookingId: id },
          data: { status: dto.paymentStatus as never }
        });
      }

      return updatedBooking;
    });

    // Write audit log (non-blocking)
    await this.auditService.log({
      actorId: actor?.id,
      action: "UPDATE_PAYMENT_STATUS",
      resourceType: "Booking",
      resourceId: id,
      metadata: {
        oldPaymentStatus,
        newPaymentStatus: dto.paymentStatus,
        bookingCode: booking.bookingCode
      }
    });

    return updated;
  }
}
