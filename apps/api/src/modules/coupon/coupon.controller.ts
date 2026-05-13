import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

/**
 * CouponController — admin CRUD endpoints for coupon management.
 *
 * All routes require ADMIN role (enforced via @Roles('ADMIN') + global RolesGuard).
 *
 * Routes:
 *   GET    /admin/coupons      — paginated list of all coupons with stats
 *   POST   /admin/coupons      — create a new coupon
 *   PUT    /admin/coupons/:id  — update an existing coupon
 *   DELETE /admin/coupons/:id  — hard-delete a coupon
 *
 * Req 35 / Design §18.1 Coupon model.
 */
@ApiTags('Coupons')
@ApiBearerAuth()
@Roles('ADMIN')
@Controller('admin/coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  // =========================================================================
  // GET /admin/coupons
  // =========================================================================

  /**
   * GET /admin/coupons
   * Returns a paginated list of all coupons including usage stats
   * (usedCount, usageLimit). Ordered by createdAt descending.
   * Req 35 — requires ADMIN role.
   */
  @Get()
  @ApiOperation({
    summary: 'List all coupons (Admin)',
    description:
      'Returns a paginated list of all coupons with usage statistics (usedCount, usageLimit). ' +
      'Ordered by creation date (newest first). Requires ADMIN role.',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of coupons' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  adminList(@Query() query: PaginationQueryDto) {
    return this.couponService.adminList(query);
  }

  // =========================================================================
  // POST /admin/coupons
  // =========================================================================

  /**
   * POST /admin/coupons
   * Create a new coupon. The code is normalised to uppercase.
   * Returns 409 if a coupon with the same code already exists.
   * Req 35 — requires ADMIN role.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create coupon (Admin)',
    description:
      'Creates a new coupon. The code is automatically normalised to uppercase. ' +
      'Returns 409 Conflict if a coupon with the same code already exists. Requires ADMIN role.',
  })
  @ApiResponse({ status: 201, description: 'Coupon created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error — check required fields' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  @ApiResponse({ status: 409, description: 'Conflict — coupon code already exists' })
  adminCreate(@Body() dto: CreateCouponDto) {
    return this.couponService.adminCreate(dto);
  }

  // =========================================================================
  // PUT /admin/coupons/:id
  // =========================================================================

  /**
   * PUT /admin/coupons/:id
   * Update an existing coupon. All fields are optional (partial update).
   * Returns 409 if the new code conflicts with an existing coupon.
   * Req 35 — requires ADMIN role.
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Update coupon (Admin)',
    description:
      'Updates an existing coupon. All fields are optional — only provided fields are updated. ' +
      'If the code is changed, it is normalised to uppercase and checked for conflicts. Requires ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Coupon ID' })
  @ApiResponse({ status: 200, description: 'Coupon updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  @ApiResponse({ status: 409, description: 'Conflict — coupon code already exists' })
  adminUpdate(@Param('id') id: string, @Body() dto: UpdateCouponDto) {
    return this.couponService.adminUpdate(id, dto);
  }

  // =========================================================================
  // DELETE /admin/coupons/:id
  // =========================================================================

  /**
   * DELETE /admin/coupons/:id
   * Hard-delete a coupon. Coupons are admin-managed resources so a hard
   * delete is appropriate (no soft-delete needed).
   * Req 35 — requires ADMIN role.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete coupon (Admin)',
    description:
      'Permanently deletes a coupon. This is a hard delete — the record is removed from the database. ' +
      'Requires ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Coupon ID' })
  @ApiResponse({ status: 204, description: 'Coupon deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  async adminDelete(@Param('id') id: string) {
    await this.couponService.adminDelete(id);
  }
}
