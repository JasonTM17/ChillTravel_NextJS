import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

/**
 * DTO for creating a new coupon (Req 35 / Design §18.1 Coupon model).
 */
export class CreateCouponDto {
  @ApiProperty({ description: 'Unique coupon code', example: 'SUMMER2025', minLength: 3 })
  @IsString()
  @MinLength(3)
  code!: string;

  @ApiPropertyOptional({
    description: 'Human-readable description of the coupon',
    example: 'Summer sale 20% off',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: ['PERCENT', 'FIXED'],
    description:
      'Discount type: PERCENT applies a percentage discount, FIXED deducts a fixed amount',
    example: 'PERCENT',
  })
  @IsIn(['PERCENT', 'FIXED'])
  discountType!: 'PERCENT' | 'FIXED';

  @ApiProperty({
    description: 'Discount value — percentage (0-100) for PERCENT, VND amount for FIXED',
    example: 20,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  discountValue!: number;

  @ApiPropertyOptional({
    default: 0,
    description: 'Minimum booking amount (VND) required to use this coupon',
    example: 1000000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minBookingAmount?: number;

  @ApiPropertyOptional({
    description: 'Maximum discount amount (VND) — caps PERCENT discounts. Null = no cap.',
    example: 500000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number;

  @ApiPropertyOptional({
    description: 'Maximum number of times this coupon can be used. Null = unlimited.',
    example: 100,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  usageLimit?: number;

  @ApiProperty({
    description: 'Date from which the coupon is valid (ISO 8601)',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsDateString()
  validFrom!: string;

  @ApiProperty({
    description: 'Date until which the coupon is valid (ISO 8601)',
    example: '2025-12-31T23:59:59.000Z',
  })
  @IsDateString()
  validTo!: string;

  @ApiPropertyOptional({
    default: true,
    description: 'Whether the coupon is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
