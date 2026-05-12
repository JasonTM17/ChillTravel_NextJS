import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * DTO for submitting a public contact request.
 * Req 16 — POST /contact-requests (public).
 */
export class CreateContactDto {
  @ApiProperty({ description: "Full name of the requester", example: "Nguyễn Văn A", minLength: 2 })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ description: "Email address", example: "nguyen.van.a@example.com" })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ description: "Phone number (optional)", example: "0901234567" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: "Destination the requester is interested in", example: "Hội An" })
  @IsOptional()
  @IsString()
  destinationInterested?: string;

  @ApiProperty({ description: "Message content (min 10 characters)", example: "Tôi muốn tư vấn về tour Hội An 3 ngày 2 đêm.", minLength: 10 })
  @IsString()
  @MinLength(10)
  message!: string;
}
