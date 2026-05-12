import { IsNumber, IsOptional, IsString, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

/**
 * DTO for adding an image to a destination (Admin).
 * Task 22 will replace imageUrl with actual file upload.
 * Req 7 / Design §5.2.
 */
export class AddDestinationImageDto {
  @ApiProperty({ example: "https://example.com/image.jpg", description: "Image URL" })
  @IsString()
  imageUrl!: string;

  @ApiPropertyOptional({ description: "Alt text for accessibility" })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ default: 0, description: "Sort order (lower = first)" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sortOrder?: number;
}
