import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { BookingService } from '../booking.service';
import { CreateDemoBookingDto } from './dto/create-demo-booking.dto';

/**
 * BookingsController — demo booking endpoint.
 *
 * POST /bookings/demo — creates a mock booking confirmation without auth.
 * Generates a reference code in WV-YYYYMMDD-XXXXXX format.
 *
 * IMPORTANT: This is a demo-only endpoint. No real payment is processed.
 */
@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingService) {}

  /**
   * POST /bookings/demo
   * Creates a demo booking confirmation.
   * Public endpoint — no auth required.
   * Returns a booking reference with service details and total.
   */
  @Post('demo')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a demo booking',
    description:
      'Creates a mock booking confirmation without requiring authentication. ' +
      'Generates a reference code (WV-YYYYMMDD-XXXXXX format) and returns ' +
      'confirmation with service details and total. No real payment is processed.',
  })
  @ApiResponse({ status: 201, description: 'Demo booking created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or invalid coupon' })
  createDemoBooking(@Body() dto: CreateDemoBookingDto) {
    return this.bookingService.createDemoBooking(dto);
  }
}
