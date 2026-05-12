import { IsIn, IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

/**
 * DTO for admin triage actions on a contact request.
 * Used by status, assign, and note endpoints.
 * Req 16 — admin PUT /admin/contact-requests/:id/status|assign|note.
 */
export class UpdateContactStatusDto {
  @ApiPropertyOptional({
    enum: ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"],
    description: "New status for the contact request",
    example: "IN_PROGRESS"
  })
  @IsOptional()
  @IsString()
  @IsIn(["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"])
  status?: string;

  @ApiPropertyOptional({
    description: "Staff member ID or name to assign this request to",
    example: "staff@wanderviet.com"
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({
    description: "Internal admin note for this contact request",
    example: "Đã gọi điện tư vấn, khách hàng quan tâm tour Hội An."
  })
  @IsOptional()
  @IsString()
  adminNote?: string;
}
