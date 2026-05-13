import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';

/**
 * Query parameters for the public GET /destinations list endpoint.
 * Extends shared pagination (page, size, sort) with destination-specific filters.
 * Design §3.4 / Req 6.
 */
export class DestinationQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Search keyword (matches name or description)' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: 'Filter by country name' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Filter by city name' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Filter by category (beach, mountain, culture, etc.)' })
  @IsOptional()
  @IsString()
  category?: string;
}
