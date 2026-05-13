import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import { PromotionsService } from './promotions.service';

/**
 * PromotionsController — public promotions endpoints.
 *
 * GET  /promotions                — active promo banners and flash sale items.
 * POST /promotions/validate-coupon — validate a coupon code and return discount info.
 *
 * Both endpoints are public (no auth required).
 */
@ApiTags('Promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  /**
   * GET /promotions
   * Returns active promo banners and flash sale items.
   * Public endpoint — no auth required.
   */
  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get active promotions',
    description:
      'Returns currently active promo banners (sorted by display order) and ' +
      'flash sale items (sorted by end time). Only items within their active ' +
      'date range are returned.',
  })
  @ApiResponse({ status: 200, description: 'Active promotions' })
  getActivePromotions() {
    return this.promotionsService.getActivePromotions();
  }

  /**
   * POST /promotions/validate-coupon
   * Validates a coupon code and returns discount information.
   * Public endpoint — no auth required.
   */
  @Post('validate-coupon')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate a coupon code',
    description:
      'Validates the given coupon code against the provided booking amount. ' +
      'Returns discount type, discount amount, and final amount on success. ' +
      'Returns 400 with error message if the coupon is invalid, expired, or ' +
      'the booking amount is below the minimum required.',
  })
  @ApiResponse({ status: 200, description: 'Coupon is valid — discount info returned' })
  @ApiResponse({ status: 400, description: 'Invalid coupon — error message in response' })
  validateCoupon(@Body() dto: ValidateCouponDto) {
    return this.promotionsService.validateCoupon(dto.code, dto.amount);
  }
}
