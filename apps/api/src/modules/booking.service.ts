import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "../common/services/email.service";
import { generateBookingCode } from "../common/utils/booking-code.util";
import { buildPagination } from "../common/dto/paginated-response.dto";
import type { PaginationQueryDto } from "../common/dto/pagination.dto";
import type { CreateBookingDto } from "./booking/dto/create-booking.dto";

/**
 * BookingService — real implementation (Task 13, Req 10, 35, Design §5.2, §7).
 *
 * Handles:
 *  - createBooking: validate tour/departure/coupon, compute price, persist booking + guests + payment.
 *  - listMyBookings: paginated list of the calling user's bookings.
 *  - getByCode: fetch booking by bookingCode (owner-only, 403 otherwise).
 *  - cancelBooking: state-machine cancel (PENDING→CANCELLED, CONFIRMED→CANCELLED+restore slots).
 */
@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService
  ) {}

  // ---------------------------------------------------------------------------
  // Create Booking
  // ---------------------------------------------------------------------------

  async createBooking(userId: string, dto: CreateBookingDto) {
    // 1. Find tour (throw 404 if not found or DELETED/INACTIVE)
    const tour = await this.prisma.tour.findUnique({
      where: { id: dto.tourId }
    });

    if (!tour || tour.status === "DELETED" || tour.status === "INACTIVE") {
      throw new BadRequestException("Tour không khả dụng");
    }

    // 2. Check available slots
    let departure = null;
    if (dto.departureId) {
      departure = await this.prisma.tourDeparture.findUnique({
        where: { id: dto.departureId }
      });
      if (!departure || departure.tourId !== tour.id) {
        throw new BadRequestException("Ngày khởi hành không hợp lệ");
      }
      if (dto.numberOfGuests > departure.availableSlots) {
        throw new BadRequestException("Không đủ chỗ cho ngày khởi hành này");
      }
    } else {
      if (dto.numberOfGuests > tour.availableSlots) {
        throw new BadRequestException("Không đủ chỗ");
      }
    }

    // 3. Compute base total before discount
    const unitPrice = tour.salePrice ?? tour.basePrice;
    const totalBeforeDiscount = unitPrice * dto.numberOfGuests;

    // 4. Validate coupon and compute discount
    let discountAmount = 0;
    let couponId: string | null = null;

    if (dto.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: dto.couponCode }
      });

      if (!coupon) {
        throw new BadRequestException("Mã giảm giá không hợp lệ");
      }

      const now = new Date();

      if (!coupon.isActive) {
        throw new BadRequestException("Mã giảm giá không còn hiệu lực");
      }
      if (coupon.validFrom > now || coupon.validTo < now) {
        throw new BadRequestException("Mã giảm giá đã hết hạn hoặc chưa có hiệu lực");
      }
      if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        throw new BadRequestException("Mã giảm giá đã hết lượt sử dụng");
      }
      if (totalBeforeDiscount < coupon.minBookingAmount) {
        throw new BadRequestException(
          `Đơn hàng tối thiểu ${coupon.minBookingAmount.toLocaleString()} VND để dùng mã này`
        );
      }

      // Compute discount
      if (coupon.discountType === "PERCENT") {
        const raw = Math.floor((coupon.discountValue / 100) * totalBeforeDiscount);
        discountAmount =
          coupon.maxDiscountAmount !== null
            ? Math.min(raw, coupon.maxDiscountAmount)
            : raw;
      } else {
        // FIXED
        discountAmount = Math.min(coupon.discountValue, totalBeforeDiscount);
      }

      couponId = coupon.id;
    }

    // 5. Compute final total
    const totalAmount = totalBeforeDiscount - discountAmount;

    // 6. Generate booking code (retry on collision)
    let bookingCode = generateBookingCode();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await this.prisma.booking.findUnique({ where: { bookingCode } });
      if (!existing) break;
      bookingCode = generateBookingCode();
      attempts++;
    }

    // 7. Persist booking + guests + payment in a transaction
    const booking = await this.prisma.$transaction(async (tx) => {
      // Create booking
      const newBooking = await tx.booking.create({
        data: {
          bookingCode,
          userId,
          tourId: tour.id,
          departureId: dto.departureId ?? null,
          couponId,
          contactName: dto.contactName,
          contactEmail: dto.contactEmail,
          contactPhone: dto.contactPhone,
          numberOfGuests: dto.numberOfGuests,
          totalAmount,
          discountAmount,
          specialRequest: dto.specialRequest ?? null,
          status: "pending",
          paymentStatus: "pending",
          paymentMethod: "MOCK_CARD",
          isDemo: true,
          bookingDate: new Date()
        }
      });

      // Create BookingGuest records
      if (dto.guests && dto.guests.length > 0) {
        await tx.bookingGuest.createMany({
          data: dto.guests.map((g) => ({
            bookingId: newBooking.id,
            fullName: g.fullName,
            dateOfBirth: g.dateOfBirth ? new Date(g.dateOfBirth) : null,
            gender: g.gender ?? null,
            note: g.note ?? null
          }))
        });
      }

      // Create Payment record
      await tx.payment.create({
        data: {
          bookingId: newBooking.id,
          provider: "MOCK",
          amount: totalAmount,
          currency: "VND",
          status: "pending"
        }
      });

      // Increment coupon usedCount if coupon was applied
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } }
        });
      }

      return newBooking;
    });

    // 8. Trigger email notification (non-blocking)
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      this.emailService.sendBookingConfirmation(user.email, bookingCode);
    }

    // 9. Return booking with relations
    return this.prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
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
        departure: true,
        guests: true,
        payment: true,
        coupon: {
          select: { id: true, code: true, discountType: true, discountValue: true }
        }
      }
    });
  }

  // ---------------------------------------------------------------------------
  // List My Bookings (paginated)
  // ---------------------------------------------------------------------------

  async listMyBookings(userId: string, query: PaginationQueryDto) {
    const page = query.page ?? 0;
    const size = query.size ?? 10;
    const skip = page * size;

    const [items, totalElements] = await Promise.all([
      this.prisma.booking.findMany({
        where: { userId },
        skip,
        take: size,
        orderBy: { createdAt: "desc" },
        include: {
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
            select: { id: true, departureDate: true, returnDate: true }
          },
          payment: {
            select: { id: true, status: true, amount: true, paidAt: true }
          }
        }
      }),
      this.prisma.booking.count({ where: { userId } })
    ]);

    return buildPagination(items, page, size, totalElements);
  }

  // ---------------------------------------------------------------------------
  // Get By Booking Code (owner only)
  // ---------------------------------------------------------------------------

  async getByCode(userId: string, bookingCode: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { bookingCode },
      include: {
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
          select: { id: true, code: true, discountType: true, discountValue: true }
        }
      }
    });

    if (!booking) {
      throw new NotFoundException("Không tìm thấy booking");
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException("Bạn không có quyền xem booking này");
    }

    return booking;
  }

  // ---------------------------------------------------------------------------
  // Cancel Booking (state machine)
  // ---------------------------------------------------------------------------

  async cancelBooking(userId: string, bookingCode: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { bookingCode }
    });

    if (!booking) {
      throw new NotFoundException("Không tìm thấy booking");
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException("Bạn không có quyền hủy booking này");
    }

    if (booking.status === "completed" || booking.status === "cancelled") {
      throw new BadRequestException("Không thể hủy booking này");
    }

    if (booking.status === "refunded_mock") {
      throw new BadRequestException("Không thể hủy booking này");
    }

    // State machine
    if (booking.status === "pending") {
      // PENDING → CANCELLED (no slot restore)
      const updated = await this.prisma.booking.update({
        where: { id: booking.id },
        data: { status: "cancelled" },
        include: {
          tour: {
            select: { id: true, title: true, slug: true, imageUrl: true }
          },
          payment: true
        }
      });
      return updated;
    }

    if (booking.status === "confirmed") {
      // CONFIRMED → CANCELLED + restore slots
      const updated = await this.prisma.$transaction(async (tx) => {
        const cancelledBooking = await tx.booking.update({
          where: { id: booking.id },
          data: { status: "cancelled" },
          include: {
            tour: {
              select: { id: true, title: true, slug: true, imageUrl: true }
            },
            payment: true
          }
        });

        // Restore tour.availableSlots
        if (booking.tourId && booking.numberOfGuests) {
          await tx.tour.update({
            where: { id: booking.tourId },
            data: { availableSlots: { increment: booking.numberOfGuests } }
          });
        }

        // Restore departure.availableSlots if departureId present
        if (booking.departureId && booking.numberOfGuests) {
          await tx.tourDeparture.update({
            where: { id: booking.departureId },
            data: { availableSlots: { increment: booking.numberOfGuests } }
          });
        }

        return cancelledBooking;
      });

      return updated;
    }

    throw new BadRequestException("Không thể hủy booking này");
  }

  // ---------------------------------------------------------------------------
  // Legacy mock methods (kept for backward compat with old controller shape)
  // ---------------------------------------------------------------------------

  /** @deprecated Use createBooking() instead */
  create(input: { itemName: string; amount: number; method: string }) {
    const suffix = Date.now().toString().slice(-6);
    return {
      id: "book_" + suffix,
      bookingCode: "CT-" + suffix,
      status: "confirmed",
      totalAmount: input.amount,
      currency: "VND",
      paymentStatus: "confirmed_mock",
      paymentMethod: input.method,
      isDemo: true,
      warning: "Thanh toán demo — không phát sinh giao dịch thật"
    };
  }

  /** @deprecated Use getByCode() instead */
  find(code: string) {
    return {
      bookingCode: code,
      status: "confirmed",
      paymentStatus: "confirmed_mock",
      isDemo: true,
      warning: "Thanh toán demo — không phát sinh giao dịch thật"
    };
  }

  /** @deprecated Use cancelBooking() instead */
  cancel(id: string) {
    return { id, status: "cancelled", paymentStatus: "refunded_mock", isDemo: true };
  }
}
