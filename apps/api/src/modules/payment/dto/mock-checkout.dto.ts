import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MockCheckoutDto {
  @ApiProperty({ description: 'Booking ID to initiate payment for' })
  @IsString()
  bookingId!: string;
}
