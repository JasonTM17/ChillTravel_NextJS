import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

/**
 * Supported service types for demo bookings.
 */
export enum DemoServiceType {
  TOUR = 'tour',
  HOTEL = 'hotel',
  FLIGHT = 'flight',
}

/**
 * DTO for creating a demo booking.
 * Used by POST /bookings/demo — a public endpoint that generates
 * a mock booking confirmation without requiring authentication.
 */
export class CreateDemoBookingDto {
  @ApiProperty({
    enum: DemoServiceType,
    description: 'Type of service being booked',
    example: 'tour',
  })
  @IsNotEmpty()
  @IsEnum(DemoServiceType)
  serviceType!: DemoServiceType;

  @ApiProperty({
    description: 'ID of the service being booked (tour, hotel, or flight ID)',
    example: 'clx1234567890',
  })
  @IsNotEmpty()
  @IsString()
  serviceId!: string;

  @ApiProperty({
    description: 'Departure or check-in date in YYYY-MM-DD format',
    example: '2025-08-15',
  })
  @IsNotEmpty()
  @IsDateString()
  departureDate!: string;

  @ApiProperty({
    description: 'Number of guests',
    example: 2,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  guests!: number;

  @ApiProperty({
    description: 'Total booking amount in VND',
    example: 5000000,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalAmount!: number;

  @ApiPropertyOptional({
    description: 'Optional coupon code to apply',
    example: 'SUMMER2025',
  })
  @IsOptional()
  @IsString()
  couponCode?: string;
}
