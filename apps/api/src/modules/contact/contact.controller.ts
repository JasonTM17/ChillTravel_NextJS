import {
  Body,
  Controller,
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
import { PaginationQueryDto } from "../../common/dto/pagination.dto";
import { ContactService } from "./contact.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactStatusDto } from "./dto/update-contact-status.dto";

/**
 * ContactController — public submission + admin triage endpoints.
 *
 * Public routes:
 *   POST /contact-requests — submit a contact request (no auth required)
 *
 * Admin routes (ADMIN role required):
 *   GET  /admin/contact-requests              — list all contact requests (paginated)
 *   PUT  /admin/contact-requests/:id/status   — update status
 *   PUT  /admin/contact-requests/:id/assign   — assign to staff
 *   PUT  /admin/contact-requests/:id/note     — add/update admin note
 *
 * Req 16 / Design §3.3 Contact.
 */
@ApiTags("Contact")
@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // =========================================================================
  // PUBLIC: POST /contact-requests
  // =========================================================================

  /**
   * POST /contact-requests
   * Submit a new contact/consultation request.
   * Req 16 — public, no auth required.
   */
  @Post("contact-requests")
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Submit a contact request",
    description:
      "Allows any visitor (guest or logged-in user) to submit a contact/consultation request. " +
      "The request is created with status=NEW and will appear in the admin triage queue."
  })
  @ApiResponse({ status: 201, description: "Contact request submitted successfully" })
  @ApiResponse({ status: 400, description: "Validation error — check required fields" })
  submit(@Body() dto: CreateContactDto) {
    return this.contactService.submit(dto);
  }

  // =========================================================================
  // ADMIN: GET /admin/contact-requests
  // =========================================================================

  /**
   * GET /admin/contact-requests
   * List all contact requests with optional status filter (paginated).
   * Req 16 — requires ADMIN role.
   */
  @Get("admin/contact-requests")
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "List all contact requests (Admin)",
    description:
      "Returns a paginated list of all contact requests ordered by creation date (newest first). " +
      "Supports optional filtering by status. Requires ADMIN role."
  })
  @ApiQuery({
    name: "status",
    required: false,
    enum: ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"],
    description: "Filter by contact request status"
  })
  @ApiResponse({ status: 200, description: "Paginated list of contact requests" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden — ADMIN role required" })
  adminList(
    @Query() query: PaginationQueryDto,
    @Query("status") status?: string
  ) {
    return this.contactService.adminList({ ...query, status });
  }

  // =========================================================================
  // ADMIN: PUT /admin/contact-requests/:id/status
  // =========================================================================

  /**
   * PUT /admin/contact-requests/:id/status
   * Update the status of a contact request.
   * Req 16 — requires ADMIN role.
   */
  @Put("admin/contact-requests/:id/status")
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update contact request status (Admin)",
    description:
      "Updates the status of a contact request. Valid values: NEW, IN_PROGRESS, RESOLVED, CLOSED. Requires ADMIN role."
  })
  @ApiParam({ name: "id", description: "Contact request ID" })
  @ApiResponse({ status: 200, description: "Contact request status updated" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden — ADMIN role required" })
  @ApiResponse({ status: 404, description: "Contact request not found" })
  updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateContactStatusDto
  ) {
    return this.contactService.updateStatus(id, dto);
  }

  // =========================================================================
  // ADMIN: PUT /admin/contact-requests/:id/assign
  // =========================================================================

  /**
   * PUT /admin/contact-requests/:id/assign
   * Assign a contact request to a staff member.
   * Req 16 — requires ADMIN role.
   */
  @Put("admin/contact-requests/:id/assign")
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Assign contact request to staff (Admin)",
    description:
      "Assigns a contact request to a staff member identified by their ID or email. Requires ADMIN role."
  })
  @ApiParam({ name: "id", description: "Contact request ID" })
  @ApiResponse({ status: 200, description: "Contact request assigned" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden — ADMIN role required" })
  @ApiResponse({ status: 404, description: "Contact request not found" })
  assign(
    @Param("id") id: string,
    @Body() dto: UpdateContactStatusDto
  ) {
    return this.contactService.updateStatus(id, dto);
  }

  // =========================================================================
  // ADMIN: PUT /admin/contact-requests/:id/note
  // =========================================================================

  /**
   * PUT /admin/contact-requests/:id/note
   * Add or update the admin note on a contact request.
   * Req 16 — requires ADMIN role.
   */
  @Put("admin/contact-requests/:id/note")
  @Roles("ADMIN")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Add/update admin note on contact request (Admin)",
    description:
      "Adds or updates the internal admin note for a contact request. Requires ADMIN role."
  })
  @ApiParam({ name: "id", description: "Contact request ID" })
  @ApiResponse({ status: 200, description: "Admin note updated" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden — ADMIN role required" })
  @ApiResponse({ status: 404, description: "Contact request not found" })
  addNote(
    @Param("id") id: string,
    @Body() dto: UpdateContactStatusDto
  ) {
    return this.contactService.updateStatus(id, dto);
  }
}
