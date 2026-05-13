import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';

/**
 * Query parameters for the public flight listing endpoint.
 * Extends PaginationQueryDto with flight-specific filters.
 *
 * Default sort: lowest price first.
 * Max page size enforced at 20.
 */
export class FlightQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Origin airport code (e.g. SGN, HAN)',
    example: 'SGN',
  })
  @IsOptional()
  @IsString()
  origin?: string;

  @ApiPropertyOptional({
    description: 'Destination airport code (e.g. HAN, DAD)',
    example: 'HAN',
  })
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiPropertyOptional({
    description: 'Departure date in YYYY-MM-DD format',
    example: '2025-07-15',
  })
  @IsOptional()
  @IsString()
  departureDate?: string;

  @ApiPropertyOptional({
    description: 'Comma-separated departure time blocks: "00-06,06-12,12-18,18-24"',
    example: '06-12,12-18',
  })
  @IsOptional()
  @IsString()
  departureTimeBlock?: string;

  @ApiPropertyOptional({
    description: 'Comma-separated number of stops: "0,1,2"',
    example: '0,1',
  })
  @IsOptional()
  @IsString()
  stops?: string;

  @ApiPropertyOptional({
    description: 'Comma-separated airline codes (e.g. "VN,VJ,QH")',
    example: 'VN,VJ',
  })
  @IsOptional()
  @IsString()
  airlines?: string;

  @ApiPropertyOptional({
    description: 'Minimum total price (VND)',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum total price (VND)',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    enum: ['price-asc', 'price-desc', 'duration', 'departure'],
    description:
      'Sort order: price-asc (cheapest first, default), price-desc, duration (shortest), departure (earliest)',
  })
  @IsOptional()
  @IsIn(['price-asc', 'price-desc', 'duration', 'departure'])
  sortBy?: 'price-asc' | 'price-desc' | 'duration' | 'departure';
}
