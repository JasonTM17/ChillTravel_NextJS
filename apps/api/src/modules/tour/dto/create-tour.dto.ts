import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

/**
 * DTO for creating a new tour.
 * Design §3.3 Tours / Req 8, 9.
 */
export class CreateTourDto {
  @ApiProperty({ description: 'Tour title', minLength: 3, example: 'Hà Nội City Tour 3 Ngày' })
  @IsString()
  @MinLength(3)
  title!: string;

  @ApiProperty({ description: 'Destination ID this tour belongs to', example: 'clxxx...' })
  @IsString()
  destinationId!: string;

  @ApiProperty({ description: 'Full tour description' })
  @IsString()
  description!: string;

  @ApiPropertyOptional({ description: 'Short description for cards/previews' })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({ description: 'Duration in days', minimum: 1, example: 3 })
  @IsInt()
  @Min(1)
  durationDays!: number;

  @ApiProperty({ description: 'Duration in nights', minimum: 0, example: 2 })
  @IsInt()
  @Min(0)
  durationNights!: number;

  @ApiProperty({ description: 'Base price in VND', minimum: 0, example: 2500000 })
  @IsNumber()
  @Min(0)
  basePrice!: number;

  @ApiPropertyOptional({
    description: 'Sale price in VND (null = no sale)',
    minimum: 0,
    example: 1990000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @ApiProperty({ description: 'Maximum number of guests', minimum: 1, example: 20 })
  @IsInt()
  @Min(1)
  maxGuests!: number;

  @ApiPropertyOptional({
    description: 'Minimum number of guests',
    default: 1,
    minimum: 1,
    example: 2,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  minGuests?: number;

  @ApiProperty({ description: 'Available booking slots', minimum: 0, example: 15 })
  @IsInt()
  @Min(0)
  availableSlots!: number;

  @ApiPropertyOptional({ description: 'Tour start date (ISO 8601)', example: '2025-06-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Tour end date (ISO 8601)', example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Whether this tour is featured on the homepage',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Primary image URL',
    example: 'https://example.com/tour.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Tour category (e.g. Adventure, Cultural, Beach)',
    example: 'Cultural',
  })
  @IsOptional()
  @IsString()
  category?: string;
}
