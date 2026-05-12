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
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/strategies/jwt.strategy";
import { PaginationQueryDto } from "../../common/dto/pagination.dto";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create-review.dto";

/**
 * ReviewController — public + user + admin endpoints for reviews.
 *
 * Uses a single controller with no class-level prefix so both
 * /tours/:tourId/reviews (public/user) and /admin/reviews (admin) routes
 * live in the same file.
 *
 * Req 13, 20 / Design §3.3 Reviews.
 */
@ApiTags("Reviews")
@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // =========================================================================
  // PUBLIC: GET /tours/:tourId/reviews
  // =========================================================================

  /**
   * GET /tours/:tourId/reviews
   * Returns paginated APPROVED reviews for a tour.
   * Req 13 — public, no auth required.
   */
  @Get("tours/:tourId/reviews")
  @Public()
  @ApiOperation({
    summary: "List approved reviews for a tour",
    description:
      "Returns a paginated list of APPROVED reviews for the specified tour. No authentication required."
  })
  @ApiParam({ name: "tourId", description: "Tour ID" })
  @ApiResponse({ status: 200, description: "Paginated list of approved reviews" })
  @ApiResponse({ status: 404, description: "Tour not found" })
  listByTour(
    @Param("tourId") tourId: string,
    @Query() query: PaginationQueryDto
  ) {
    return this.reviewService.listByTour(tourId, query);
  }

  // =========================================================================
  // USER: POST /tours/:tourId/reviews
  // =========================================================================

  /**
   * POST /tours/:tourId/reviews
   * Create a review for a tour. Requires the user to have a COMPLETED booking.
   * Req 13 — requires authentication.
   */
  @Post("tours/:tourId/reviews")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create a review for a tour",
    description:
      "Creates a new review (status=PENDING) for the specified tour. The authenticated user must have at least one COMPLETED booking for this tour, otherwise a 403 is returned."
  })
  @ApiParam({ name: "tourId", description: "Tour ID" })
  @ApiResponse({ status: 201, description: "Review created (status=PENDING, awaiting admin approval)" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden — no completed booking for this tour" })
  @ApiResponse({ status: 404, description: "Tour not found" })
  createReview(
    @Param("tourId") tourId: string,
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.reviewService.create(user.id, tourId, dto);
  }

  // =========================================================================
  // USER: PUT /reviews/:id
  // =========================================================================

  /**
   * PUT /reviews/:id
   * Update own review. Only the review owner can update.
   * Req 13 — requires authentication.
   */
  @Put("reviews/:id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update own review",
    description:
      "Updates the authenticated user's review. Returns 403 if the user is not the review owner."
  })
  @ApiParam({ name: "id", description: "Review ID" })
  @ApiResponse({ status: 200, description: "Review updated" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden — not the review owner" })
  @ApiResponse({ status: 404, description: "Review not found" })
  updateReview(
    @Param("id") id: string,
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.reviewService.update(user.id, id, dto);
  }

  // =========================================================================
  // USER: DELETE /reviews/:id
  // =========================================================================

  /**
   * DELETE /reviews/:id
   * Delete own review. Only the review owner can delete.
   * Req 13 — requires authentication.
   */
  @Delete("reviews/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete own review",
    description:
      "Deletes the authenticated user's review. Returns 403 if the user is not the review owner."
  })
  @ApiParam({ name: "id", description: "Review ID" })
  @ApiResponse({ status: 204, description: "Review deleted" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden — not the review owner" })
  @ApiResponse({ status: 404, description: "Review not found" })
  async deleteReview(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    await this.reviewService.remove(user.id, id);
  }

  // =========================================================================
  // ADMIN: GET /admin/reviews
  // =========================================================================

  /**
   * GET /admin/reviews
   * List all reviews with optional status filter and pagination.
   * Req 13, 20 — requires ADMIN role.
   */
  @Get("admin/reviews")
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "List all reviews (Admin)",
    description:
      "Returns a paginated list of all reviews. Supports optional filtering by status (PENDING, APPROVED, REJECTED, HIDDEN)."
  })
  @ApiQuery({
    name: "status",
    required: false,
    enum: ["PENDING", "APPROVED", "REJECTED", "HIDDEN"],
    description: "Filter by review status"
  })
  @ApiResponse({ status: 200, description: "Paginated list of reviews" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden — ADMIN role required" })
  adminList(
    @Query() query: PaginationQueryDto,
    @Query("status") status?: string
  ) {
    return this.reviewService.adminList({ ...query, status });
  }

  // =========================================================================
  // ADMIN: PUT /admin/reviews/:id/approve
  // =========================================================================

  /**
   * PUT /admin/reviews/:id/approve
   * Approve a review. Writes an audit log entry.
   * Req 13, 20 — requires ADMIN role.
   */
  @Put("admin/reviews/:id/approve")
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Approve a review (Admin)",
    description:
      "Sets the review status to APPROVED and writes an audit log entry."
  })
  @ApiParam({ name: "id", description: "Review ID" })
  @ApiResponse({ status: 200, description: "Review approved" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden — ADMIN role required" })
  @ApiResponse({ status: 404, description: "Review not found" })
  approveReview(
    @Param("id") id: string,
    @CurrentUser() actor: AuthenticatedUser
  ) {
    return this.reviewService.approve(id, actor.id);
  }

  // =========================================================================
  // ADMIN: PUT /admin/reviews/:id/reject
  // =========================================================================

  /**
   * PUT /admin/reviews/:id/reject
   * Reject a review. Writes an audit log entry.
   * Req 13, 20 — requires ADMIN role.
   */
  @Put("admin/reviews/:id/reject")
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Reject a review (Admin)",
    description:
      "Sets the review status to REJECTED and writes an audit log entry."
  })
  @ApiParam({ name: "id", description: "Review ID" })
  @ApiResponse({ status: 200, description: "Review rejected" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden — ADMIN role required" })
  @ApiResponse({ status: 404, description: "Review not found" })
  rejectReview(
    @Param("id") id: string,
    @CurrentUser() actor: AuthenticatedUser
  ) {
    return this.reviewService.reject(id, actor.id);
  }

  // =========================================================================
  // ADMIN: PUT /admin/reviews/:id/hide
  // =========================================================================

  /**
   * PUT /admin/reviews/:id/hide
   * Hide a review. Writes an audit log entry.
   * Req 13, 20 — requires ADMIN role.
   */
  @Put("admin/reviews/:id/hide")
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Hide a review (Admin)",
    description:
      "Sets the review status to HIDDEN and writes an audit log entry."
  })
  @ApiParam({ name: "id", description: "Review ID" })
  @ApiResponse({ status: 200, description: "Review hidden" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden — ADMIN role required" })
  @ApiResponse({ status: 404, description: "Review not found" })
  hideReview(
    @Param("id") id: string,
    @CurrentUser() actor: AuthenticatedUser
  ) {
    return this.reviewService.hide(id, actor.id);
  }
}
