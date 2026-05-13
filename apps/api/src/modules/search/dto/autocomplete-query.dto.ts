import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

/**
 * Query parameters for GET /search/autocomplete.
 * Validates search input: minimum 2 characters, optional type filter, max 8 results.
 * Design §8 / Req 7.4.
 */
export class AutocompleteQueryDto {
  @ApiProperty({
    description: 'Search query string (minimum 2 characters)',
    example: 'Da Nang',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  q!: string;

  @ApiPropertyOptional({
    description: 'Filter by service type',
    enum: ['hotel', 'flight', 'tour', 'all'],
    default: 'all',
  })
  @IsOptional()
  @IsString()
  @IsEnum(['hotel', 'flight', 'tour', 'all'])
  type?: 'hotel' | 'flight' | 'tour' | 'all';

  @ApiPropertyOptional({
    description: 'Maximum number of results (1-8, default 8)',
    default: 8,
    minimum: 1,
    maximum: 8,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(8)
  limit?: number;
}
