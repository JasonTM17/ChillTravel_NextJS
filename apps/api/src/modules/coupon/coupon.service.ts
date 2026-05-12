import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { buildPagination } from "../../common/dto/paginated-response.dto";
import type { PaginationQueryDto } from "../../common/dto/pagination.dto";
import type { CreateCouponDto } from "./dto/create-coupon.dto";
import type { UpdateCouponDto } from "./dto/update-coupon.dto";

/**
 * CouponService — admin CRUD + coupon validation helper.
 *
 * Handles:
 *  - adminList:         paginated list of all coupons with stats (usedCount, usageLimit).
 *  - adminCreate:       create a coupon (throws 409 if code already exists).
 *  - adminUpdate:       update an existing coupon.
 *  - adminDelete:       hard-delete a coupon (admin-managed resource).
 *  - validateAndApply:  validate coupon code against a booking amount and compute
 *                       the discount. Returns { couponId, discountAmount } or throws
 *                       BadRequestException if the coupon is invalid.
 *
 * Req 35 / Design §18.1 Coupon model.
 */
@Injectable()
export class CouponService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // adminList — paginated list of all coupons
  // ---------------------------------------------------------------------------

  async adminList(query: PaginationQueryDto) {
    const page = query.page ?? 0;
    const size = query.size ?? 10;
    const skip = page * size;

    const [items, totalElements] = await Promise.all([
      this.prisma.coupon.findMany({
        skip,
        take: size,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          code: true,
          description: true,
          discountType: true,
          discountValue: true,
          minBookingAmount: true,
          maxDiscountAmount: true,
          usageLimit: true,
          usedCount: true,
          validFrom: true,
          validTo: true,
          isActive: true,
          createdAt: true
        }
      }),
      this.prisma.coupon.count()
    ]);

    return buildPagination(items, page, size, totalElements);
  }

  // ---------------------------------------------------------------------------
  // adminCreate — create a new coupon
  // ---------------------------------------------------------------------------

  async adminCreate(dto: CreateCouponDto) {
    // Normalise code to uppercase for consistency
    const code = dto.code.toUpperCase();

    // Check for duplicate code
    const existing = await this.prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      throw new ConflictException(`Mã giảm giá "${code}" đã tồn tại`);
    }

    return this.prisma.coupon.create({
      data: {
        code,
        description: dto.description ?? null,
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        minBookingAmount: dto.minBookingAmount ?? 0,
        maxDiscountAmount: dto.maxDiscountAmount ?? null,
        usageLimit: dto.usageLimit ?? null,
        usedCount: 0,
        validFrom: new Date(dto.validFrom),
        validTo: new Date(dto.validTo),
        isActive: dto.isActive ?? true
      }
    });
  }

  // ---------------------------------------------------------------------------
  // adminUpdate — update an existing coupon
  // ---------------------------------------------------------------------------

  async adminUpdate(id: string, dto: UpdateCouponDto) {
    // Ensure coupon exists
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      throw new NotFoundException("Không tìm thấy mã giảm giá");
    }

    // If code is being changed, check for conflicts
    if (dto.code !== undefined) {
      const newCode = dto.code.toUpperCase();
      if (newCode !== coupon.code) {
        const conflict = await this.prisma.coupon.findUnique({ where: { code: newCode } });
        if (conflict) {
          throw new ConflictException(`Mã giảm giá "${newCode}" đã tồn tại`);
        }
        dto = { ...dto, code: newCode };
      }
    }

    return this.prisma.coupon.update({
      where: { id },
      data: {
        ...(dto.code !== undefined && { code: dto.code.toUpperCase() }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.discountType !== undefined && { discountType: dto.discountType }),
        ...(dto.discountValue !== undefined && { discountValue: dto.discountValue }),
        ...(dto.minBookingAmount !== undefined && { minBookingAmount: dto.minBookingAmount }),
        ...(dto.maxDiscountAmount !== undefined && { maxDiscountAmount: dto.maxDiscountAmount }),
        ...(dto.usageLimit !== undefined && { usageLimit: dto.usageLimit }),
        ...(dto.validFrom !== undefined && { validFrom: new Date(dto.validFrom) }),
        ...(dto.validTo !== undefined && { validTo: new Date(dto.validTo) }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive })
      }
    });
  }

  // ---------------------------------------------------------------------------
  // adminDelete — hard-delete a coupon
  // ---------------------------------------------------------------------------

  async adminDelete(id: string): Promise<void> {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      throw new NotFoundException("Không tìm thấy mã giảm giá");
    }

    await this.prisma.coupon.delete({ where: { id } });
  }

  // ---------------------------------------------------------------------------
  // validateAndApply — validate coupon and compute discount amount
  // ---------------------------------------------------------------------------

  /**
   * Validates a coupon code against the given booking amount and computes
   * the discount. Returns `{ couponId, discountAmount }` on success.
   *
   * Throws `BadRequestException` if:
   *  - The coupon code does not exist.
   *  - The coupon is inactive.
   *  - The coupon is outside its validity window.
   *  - The coupon has reached its usage limit.
   *  - The booking amount is below the minimum required.
   *
   * NOTE: This method does NOT increment `usedCount`. The caller (BookingService)
   * is responsible for incrementing it inside the booking transaction.
   *
   * Req 35 / Design §18.1 Coupon model.
   */
  async validateAndApply(
    code: string,
    bookingAmount: number
  ): Promise<{ couponId: string; discountAmount: number }> {
    const normalised = code.toUpperCase();

    const coupon = await this.prisma.coupon.findUnique({ where: { code: normalised } });

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

    if (bookingAmount < coupon.minBookingAmount) {
      throw new BadRequestException(
        `Đơn hàng tối thiểu ${coupon.minBookingAmount.toLocaleString()} VND để dùng mã này`
      );
    }

    // Compute discount
    let discountAmount: number;

    if (coupon.discountType === "PERCENT") {
      const raw = Math.floor((coupon.discountValue / 100) * bookingAmount);
      discountAmount =
        coupon.maxDiscountAmount !== null
          ? Math.min(raw, coupon.maxDiscountAmount)
          : raw;
    } else {
      // FIXED — cannot exceed the booking amount itself
      discountAmount = Math.min(coupon.discountValue, bookingAmount);
    }

    return { couponId: coupon.id, discountAmount };
  }
}
