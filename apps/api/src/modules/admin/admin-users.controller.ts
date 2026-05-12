import { Controller, Get, Query } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import { Roles } from "../../common/decorators/roles.decorator";
import { DashboardService } from "./dashboard.service";

/**
 * AdminUsersController — Read-only user list for admin.
 *
 * GET /admin/users — paginated list of all users (read-only).
 *
 * Req 45 / Design §6.4.
 */
@ApiTags("Admin — Users")
@ApiBearerAuth()
@Roles("ADMIN")
@Controller("admin/users")
export class AdminUsersController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary: "List all users (Admin, read-only)",
    description: "Returns paginated list of all users. Read-only view."
  })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "keyword", required: false, type: String })
  @ApiResponse({ status: 200, description: "Paginated user list" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden — ADMIN role required" })
  getUsers(
    @Query("page") page?: string,
    @Query("size") size?: string,
    @Query("keyword") keyword?: string
  ) {
    return this.dashboardService.getUsers({
      page: page ? parseInt(page, 10) : 0,
      size: size ? parseInt(size, 10) : 20,
      keyword
    });
  }
}
