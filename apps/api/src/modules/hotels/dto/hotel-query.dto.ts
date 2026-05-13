import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';

/**
 * Query parameters for the public hotel listing endpoint.
 * Extends PaginationQueryDto with hotel-specific filters and sort options.
 *
 * Design §8 (Hotel Listing API).
 */
export class HotelQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by destination ID' })
  @IsOptional()
  @IsString()
  destinationId?: string;

  @ApiPropertyOptional({ description: 'Minimum nightly price (VND)', minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum nightly price (VND)', minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: "Comma-separated star ratings to filter by (e.g. '3,4,5')",
    example: '4,5',
  })
  @IsOptional()
  @IsString()
  stars?: string;

  @ApiPropertyOptional({
    description: "Comma-separated amenities to filter by (e.g. 'wifi,pool,parking')",
    example: 'wifi,pool',
  })
  @IsOptional()
  @IsString()
  amenities?: string;

  @ApiPropertyOptional({
    description: 'Filter by property type (hotel, resort, villa, hostel)',
    example: 'hotel',
  })
  @IsOptional()
  @IsString()
  propertyType?: string;

  @ApiPropertyOptional({
    description: 'Maximum distance from center in km',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxDistance?: number;

  @ApiPropertyOptional({
    description: 'Search keyword (matches hotel name)',
    example: 'Marriott',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    enum: ['price-asc', 'price-desc', 'rating', 'popularity', 'distance'],
    description:
      'Sort order: price-asc (cheapest first), price-desc (most expensive first), ' +
      'rating (reviewScore desc), popularity (reviewCount desc), distance (nearest first)',
  })
  @IsOptional()
  @IsIn(['price-asc', 'price-desc', 'rating', 'popularity', 'distance'])
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'popularity' | 'distance';
}
