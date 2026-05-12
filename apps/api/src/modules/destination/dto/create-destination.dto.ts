import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * DTO for creating a new destination (Admin).
 * Req 7 / Design §5.2.
 */
export class CreateDestinationDto {
  @ApiProperty({ example: "Hạ Long Bay", description: "Destination name (min 2 chars)" })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: "Việt Nam", description: "Country name (will be found or created)" })
  @IsString()
  country!: string;

  @ApiPropertyOptional({ example: "Quảng Ninh", description: "City name (will be found or created)" })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: "beach", description: "Category (beach, mountain, culture, etc.)" })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: "Short description for cards" })
  @IsString()
  description!: string;

  @ApiPropertyOptional({ description: "One-line teaser shown on cards" })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional({ description: "Full rich-text description" })
  @IsOptional()
  @IsString()
  longDescription?: string;

  @ApiPropertyOptional({ example: "November to April", description: "Best time to visit" })
  @IsOptional()
  @IsString()
  bestTimeToVisit?: string;

  @ApiPropertyOptional({ example: "https://example.com/image.jpg", description: "Primary image URL" })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ default: 0, description: "Minimum daily budget in VND" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budgetMin?: number;

  @ApiPropertyOptional({ default: 0, description: "Maximum daily budget in VND" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budgetMax?: number;

  @ApiPropertyOptional({ default: "VND", description: "Currency code" })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ default: 0, description: "Latitude coordinate" })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ default: 0, description: "Longitude coordinate" })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ default: "medium", description: "Safety level (low, medium, high)" })
  @IsOptional()
  @IsString()
  safetyLevel?: string;

  @ApiPropertyOptional({ type: [String], description: "Travel style tags" })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  travelStyles?: string[];

  @ApiPropertyOptional({ type: [String], description: "Culture notes" })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cultureNotes?: string[];

  @ApiPropertyOptional({ type: [String], description: "Food highlights" })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  foodHighlights?: string[];

  @ApiPropertyOptional({ default: false, description: "Whether this destination is featured" })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
