import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

/**
 * DTO for updating a booking's status (Admin).
 * Req 11, Design §3.3 Admin Booking.
 */
export class UpdateBookingStatusDto {
  @ApiProperty({
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded_mock'],
    example: 'confirmed',
  })
  @IsString()
  @IsIn(['pending', 'confirmed', 'cancelled', 'completed', 'refunded_mock'])
  status!: string;
}

/**
 * DTO for updating a booking's payment status (Admin).
 * Req 11, Design §3.3 Admin Booking.
 */
export class UpdatePaymentStatusDto {
  @ApiProperty({
    enum: ['pending', 'confirmed_mock', 'failed_mock', 'refunded_mock'],
    example: 'confirmed_mock',
  })
  @IsString()
  @IsIn(['pending', 'confirmed_mock', 'failed_mock', 'refunded_mock'])
  paymentStatus!: string;
}
