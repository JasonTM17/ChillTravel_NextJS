import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import type { AuthenticatedUser } from '../common/strategies/jwt.strategy';
import { CreateBookingDto } from './booking/dto/create-booking.dto';
import { BookingService } from './booking.service';

/**
 * BookingController — real implementation (Task 13, Req 10, 35, Design §3.3, §5.2).
 *
 * IMPORTANT: GET /bookings/my is registered BEFORE GET /bookings/:bookingCode
 * to avoid NestJS routing the literal string "my" as a bookingCode param.
 *
 * All endpoints require JWT authentication (JwtAuthGuard is global).
 */
@ApiTags('Bookings')
@ApiBearerAuth()
@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  /**
   * POST /bookings
   * Create a new booking for the authenticated user.
   */
  @Post('bookings')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error / not enough slots / inactive tour' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createBooking(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(user.id, dto);
  }

  /**
   * GET /bookings/my
   * List the authenticated user's bookings (paginated).
   * MUST be registered before GET /bookings/:bookingCode.
   */
  @Get('bookings/my')
  @ApiOperation({ summary: 'List my bookings (paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated list of user bookings' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listMyBookings(@CurrentUser() user: AuthenticatedUser, @Query() query: PaginationQueryDto) {
    return this.bookingService.listMyBookings(user.id, query);
  }

  /**
   * GET /bookings/:bookingCode
   * Get booking detail by booking code (owner only).
   */
  @Get('bookings/:bookingCode')
  @ApiOperation({ summary: 'Get booking detail by booking code (owner only)' })
  @ApiParam({ name: 'bookingCode', example: 'WV-20260511-A3F9C2' })
  @ApiResponse({ status: 200, description: 'Booking detail' })
  @ApiResponse({ status: 403, description: 'Forbidden — not the booking owner' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getByCode(
    @CurrentUser() user: AuthenticatedUser,
    @Param('bookingCode') bookingCode: string,
  ) {
    return this.bookingService.getByCode(user.id, bookingCode);
  }

  /**
   * PUT /bookings/:bookingCode/cancel
   * Cancel a booking (state machine: PENDING→CANCELLED, CONFIRMED→CANCELLED+restore slots).
   */
  @Put('bookings/:bookingCode/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiParam({ name: 'bookingCode', example: 'WV-20260511-A3F9C2' })
  @ApiResponse({ status: 200, description: 'Booking cancelled' })
  @ApiResponse({
    status: 400,
    description: 'Cannot cancel this booking (COMPLETED or already CANCELLED)',
  })
  @ApiResponse({ status: 403, description: 'Forbidden — not the booking owner' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async cancelBooking(
    @CurrentUser() user: AuthenticatedUser,
    @Param('bookingCode') bookingCode: string,
  ) {
    return this.bookingService.cancelBooking(user.id, bookingCode);
  }
}
