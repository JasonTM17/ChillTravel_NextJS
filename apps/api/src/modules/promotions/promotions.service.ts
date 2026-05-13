import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * PromotionsService — business logic for public promotions endpoints.
 *
 * Handles:
 *  - getActivePromotions: returns active promo banners and flash sale items.
 *  - validateCoupon: validates a coupon code and returns discount info.
 */
@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns active promo banners and flash sale items.
   * Banners: active, within date range, ordered by sortOrder.
   * Flash sales: active, not expired, with remaining quantity.
   */
  async getActivePromotions() {
    const now = new Date();

    const [banners, flashSales] = await Promise.all([
      this.prisma.promoBanner.findMany({
        where: {
          isActive: true,
          startDate: { lte: now },
          endDate: { gte: now },
        },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.flashSaleItem.findMany({
        where: {
          isActive: true,
          endTime: { gte: now },
          startTime: { lte: now },
        },
        orderBy: { endTime: 'asc' },
      }),
    ]);

    // Add computed fields to flash sales
    const flashSalesWithMeta = flashSales.map((item) => ({
      ...item,
      remainingQuantity: item.maxQuantity - item.soldCount,
      isSoldOut: item.soldCount >= item.maxQuantity,
    }));

    return {
      banners,
      flashSales: flashSalesWithMeta,
    };
  }

  /**
   * Validates a coupon code against the given booking amount.
   * Returns discount info on success, throws BadRequestException on failure.
   */
  async validateCoupon(code: string, amount: number) {
    const normalised = code.toUpperCase().trim();

    const coupon = await this.prisma.coupon.findUnique({
      where: { code: normalised },
    });

    if (!coupon) {
      throw new BadRequestException('Mã giảm giá không hợp lệ');
    }

    const now = new Date();

    if (!coupon.isActive) {
      throw new BadRequestException('Mã giảm giá không còn hiệu lực');
    }

    if (coupon.validFrom > now || coupon.validTo < now) {
      throw new BadRequestException('Mã giảm giá đã hết hạn hoặc chưa có hiệu lực');
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Mã giảm giá đã hết lượt sử dụng');
    }

    if (amount < coupon.minBookingAmount) {
      throw new BadRequestException(
        `Đơn hàng tối thiểu ${coupon.minBookingAmount.toLocaleString()} VND để dùng mã này`,
      );
    }

    // Compute discount
    let discountAmount: number;

    if (coupon.discountType === 'PERCENT') {
      const raw = Math.floor((coupon.discountValue / 100) * amount);
      discountAmount =
        coupon.maxDiscountAmount !== null ? Math.min(raw, coupon.maxDiscountAmount) : raw;
    } else {
      // FIXED amount discount
      discountAmount = Math.min(coupon.discountValue, amount);
    }

    return {
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      finalAmount: amount - discountAmount,
      description: coupon.description,
    };
  }
}
