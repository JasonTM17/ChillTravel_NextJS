import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../common/strategies/jwt.strategy';
import { AddWishlistDto } from './dto/add-wishlist.dto';
import { WishlistService } from './wishlist.service';

/**
 * WishlistController — user wishlist endpoints.
 *
 * All routes require authentication (no @Public() decorator).
 * The global JwtAuthGuard enforces this by default.
 *
 * Routes:
 *   GET    /wishlist       — list user's wishlist with populated item info
 *   POST   /wishlist       — add item to wishlist (idempotent)
 *   DELETE /wishlist/:id   — remove item from wishlist by WishlistEntry.id
 *
 * Req 14 / Design §3.3 Wishlist.
 */
@ApiTags('Wishlist')
@ApiBearerAuth()
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  // =========================================================================
  // GET /wishlist
  // =========================================================================

  /**
   * GET /wishlist
   * Returns the authenticated user's wishlist with populated tour/destination info.
   * Req 14.
   */
  @Get()
  @ApiOperation({
    summary: 'Get user wishlist',
    description:
      'Returns all wishlist entries for the authenticated user. Each entry is populated with tour or destination details based on itemType.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of wishlist entries with populated item info',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.wishlistService.list(user.id);
  }

  // =========================================================================
  // POST /wishlist
  // =========================================================================

  /**
   * POST /wishlist
   * Add an item to the wishlist. Idempotent — if the entry already exists,
   * returns the existing entry without error.
   * Req 14.
   */
  @Post()
  @ApiOperation({
    summary: 'Add item to wishlist',
    description:
      "Adds a tour or destination to the authenticated user's wishlist. If the item is already in the wishlist, returns the existing entry (idempotent — no error).",
  })
  @ApiResponse({ status: 201, description: 'Wishlist entry created or existing entry returned' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  add(@Body() dto: AddWishlistDto, @CurrentUser() user: AuthenticatedUser) {
    return this.wishlistService.add(user.id, dto);
  }

  // =========================================================================
  // DELETE /wishlist/:id
  // =========================================================================

  /**
   * DELETE /wishlist/:id
   * Remove an item from the wishlist by WishlistEntry.id (not itemId).
   * Returns 403 if the entry does not belong to the authenticated user.
   * Req 14.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove item from wishlist',
    description:
      'Removes a wishlist entry by its ID. The entry must belong to the authenticated user, otherwise a 403 is returned.',
  })
  @ApiParam({ name: 'id', description: 'WishlistEntry ID' })
  @ApiResponse({ status: 204, description: 'Wishlist entry removed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — entry does not belong to user' })
  @ApiResponse({ status: 404, description: 'Wishlist entry not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    await this.wishlistService.remove(user.id, id);
  }
}
