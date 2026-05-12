import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/strategies/jwt.strategy";
import { NotificationService } from "./notification.service";
import { NotificationQueryDto } from "./dto/notification-query.dto";

/**
 * NotificationController — in-app notification endpoints.
 *
 * All routes require authentication (global JwtAuthGuard enforces this).
 *
 * Routes:
 *   GET  /notifications           — paginated list of user's notifications
 *   PUT  /notifications/read-all  — mark all notifications as read
 *   PUT  /notifications/:id/read  — mark a single notification as read
 *
 * NOTE: /notifications/read-all MUST be declared before /notifications/:id/read
 * to avoid the router matching "read-all" as an :id parameter.
 *
 * Req 37 / Design §18.1 Notification model.
 */
@ApiTags("Notifications")
@ApiBearerAuth()
@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // =========================================================================
  // GET /notifications
  // =========================================================================

  /**
   * GET /notifications
   * Returns a paginated list of the authenticated user's notifications,
   * ordered by createdAt descending (newest first).
   * Req 37.
   */
  @Get()
  @ApiOperation({
    summary: "List user notifications",
    description:
      "Returns a paginated list of in-app notifications for the authenticated user, ordered by newest first. Supports optional unreadOnly filter."
  })
  @ApiResponse({
    status: 200,
    description: "Paginated list of notifications"
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: NotificationQueryDto
  ) {
    return this.notificationService.list(user.id, query);
  }

  // =========================================================================
  // PUT /notifications/read-all  (MUST be before /:id to avoid routing conflict)
  // =========================================================================

  /**
   * PUT /notifications/read-all
   * Marks all unread notifications for the authenticated user as read.
   * Returns the count of notifications updated.
   * Req 37.
   */
  @Put("read-all")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Mark all notifications as read",
    description:
      "Marks all unread notifications for the authenticated user as read. Returns the count of updated notifications."
  })
  @ApiResponse({
    status: 200,
    description: "All notifications marked as read, returns { count: number }"
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  markAllRead(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationService.markAllRead(user.id);
  }

  // =========================================================================
  // PUT /notifications/:id/read
  // =========================================================================

  /**
   * PUT /notifications/:id/read
   * Marks a single notification as read. Returns 403 if the notification
   * does not belong to the authenticated user.
   * Req 37.
   */
  @Put(":id/read")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Mark notification as read",
    description:
      "Marks a single notification as read. The notification must belong to the authenticated user, otherwise a 403 is returned."
  })
  @ApiParam({ name: "id", description: "Notification ID" })
  @ApiResponse({ status: 200, description: "Notification marked as read" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden — notification does not belong to user"
  })
  @ApiResponse({ status: 404, description: "Notification not found" })
  markRead(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.notificationService.markRead(user.id, id);
  }
}
