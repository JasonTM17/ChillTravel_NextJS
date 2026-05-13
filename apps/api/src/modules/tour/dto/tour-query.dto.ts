import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';

/**
 * Query parameters for the public tour list endpoint.
 * Extends PaginationQueryDto with tour-specific filters and sort options.
 * Design §3.3 Tours / Req 8, 9.
 */
export class TourQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Search keyword (matches title and description)' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: 'Filter by tour category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Minimum base price (VND)', minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum base price (VND)', minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Filter by exact duration in days', minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({ description: 'Filter by destination ID' })
  @IsOptional()
  @IsString()
  destinationId?: string;

  @ApiPropertyOptional({
    enum: ['price', 'popular', 'rating', 'newest'],
    description:
      'Sort order: price (basePrice asc), popular (bookings count desc), rating (avg review rating desc), newest (createdAt desc)',
  })
  @IsOptional()
  @IsIn(['price', 'popular', 'rating', 'newest'])
  sortBy?: 'price' | 'popular' | 'rating' | 'newest';
}
