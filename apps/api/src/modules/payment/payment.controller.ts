import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { AuditService } from '../../common/services/audit.service';
import { EmailService } from '../../common/services/email.service';
import type { AuthenticatedUser } from '../../common/strategies/jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service';
import { MockCallbackDto } from './dto/mock-callback.dto';
import { MockCheckoutDto } from './dto/mock-checkout.dto';

const MOCK_WARNING = 'Thanh toán demo — không phát sinh giao dịch thật';

/**
 * PaymentController — mock checkout + callback (Task 15, Req 12, Design §7).
 *
 * POST /payments/mock-checkout  — requires JWT auth
 * POST /payments/mock-callback  — @Public() (called by mock payment gateway)
 *
 * The legacy endpoints POST /payments/mock and POST /payments/mock/confirm
 * remain in booking.controller.ts for backward compat with existing tests.
 */
@ApiTags('Payment')
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * POST /payments/mock-checkout
   *
   * Verifies the booking belongs to the authenticated user, generates a
   * transactionCode (MOCK-TXN-{uuid}), persists it on the Payment record,
   * and returns a mock payment URL.
   */
  @Post('mock-checkout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate mock payment checkout for a booking' })
  @ApiResponse({ status: 200, description: 'Mock checkout initiated' })
  @ApiResponse({ status: 400, description: 'Booking is not in pending status' })
  @ApiResponse({ status: 403, description: 'Booking does not belong to the current user' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async mockCheckout(@CurrentUser() user: AuthenticatedUser, @Body() dto: MockCheckoutDto) {
    // 1. Find booking by ID
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { payment: true },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy booking');
    }

    // 2. Verify ownership
    if (booking.userId !== user.id) {
      throw new ForbiddenException('Bạn không có quyền thanh toán booking này');
    }

    // 3. Verify booking is still pending
    if (booking.status !== 'pending') {
      throw new BadRequestException(
        `Booking không ở trạng thái chờ thanh toán (status: ${booking.status})`,
      );
    }

    // 4. Generate transaction code
    const transactionCode = `MOCK-TXN-${randomUUID()}`;

    // 5. Upsert Payment record with transactionCode
    if (booking.payment) {
      await this.prisma.payment.update({
        where: { bookingId: booking.id },
        data: { transactionCode },
      });
    } else {
      // Payment record should have been created at booking time, but create it
      // defensively if missing.
      await this.prisma.payment.create({
        data: {
          bookingId: booking.id,
          provider: 'MOCK',
          amount: booking.totalAmount,
          currency: booking.currency,
          status: 'pending',
          transactionCode,
        },
      });
    }

    return {
      transactionCode,
      mockPaymentUrl: `/api/v1/payments/mock-callback?txn=${transactionCode}`,
      warning: MOCK_WARNING,
    };
  }

  /**
   * POST /payments/mock-callback
   *
   * Accepts {transactionCode, status} from the mock payment gateway.
   * On SUCCESS: updates Payment + Booking atomically, decrements slot counts,
   *             triggers email notification.
   * On FAILED:  marks payment as failed_mock, booking stays pending.
   */
  @Post('mock-callback')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mock payment gateway callback' })
  @ApiResponse({ status: 200, description: 'Payment callback processed' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async mockCallback(@Body() dto: MockCallbackDto) {
    // 1. Find Payment by transactionCode
    const payment = await this.prisma.payment.findUnique({
      where: { transactionCode: dto.transactionCode },
      include: {
        booking: {
          include: {
            user: { select: { id: true, email: true } },
            tour: { select: { id: true, availableSlots: true } },
            departure: { select: { id: true, availableSlots: true } },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Không tìm thấy giao dịch');
    }

    const booking = payment.booking;

    if (dto.status === 'SUCCESS') {
      // 2a. Atomically update Payment + Booking + decrement slots
      await this.prisma.$transaction(async (tx) => {
        // Update Payment
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'confirmed_mock',
            paidAt: new Date(),
          },
        });

        // Update Booking
        await tx.booking.update({
          where: { id: booking.id },
          data: {
            paymentStatus: 'confirmed_mock',
            status: 'confirmed',
          },
        });

        // Decrement tour.availableSlots
        if (booking.tourId && booking.numberOfGuests) {
          await tx.tour.update({
            where: { id: booking.tourId },
            data: { availableSlots: { decrement: booking.numberOfGuests } },
          });
        }

        // Decrement departure.availableSlots if departureId present
        if (booking.departureId && booking.numberOfGuests) {
          await tx.tourDeparture.update({
            where: { id: booking.departureId },
            data: { availableSlots: { decrement: booking.numberOfGuests } },
          });
        }
      });

      // 3. Trigger email notification (non-blocking)
      if (booking.user?.email && booking.bookingCode) {
        this.emailService.sendBookingStatusUpdate(
          booking.user.email,
          booking.bookingCode,
          'CONFIRMED',
        );
      }

      // 4. Log PAYMENT_MOCK_COMPLETED audit event (Req 4.9)
      void this.auditService.log({
        actorId: booking.user?.id,
        action: 'PAYMENT_MOCK_COMPLETED',
        resourceType: 'Payment',
        resourceId: payment.id,
        metadata: {
          bookingId: booking.id,
          bookingCode: booking.bookingCode,
          transactionCode: dto.transactionCode,
          amount: payment.amount,
        },
      });

      return {
        bookingCode: booking.bookingCode,
        status: 'confirmed',
        paymentStatus: 'confirmed_mock',
        warning: MOCK_WARNING,
      };
    } else {
      // dto.status === "FAILED"
      // 2b. Mark payment as failed, booking stays pending
      await this.prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: 'failed_mock' },
        });

        await tx.booking.update({
          where: { id: booking.id },
          data: { paymentStatus: 'failed_mock' },
        });
      });

      return {
        bookingCode: booking.bookingCode,
        status: booking.status,
        paymentStatus: 'failed_mock',
        warning: MOCK_WARNING,
      };
    }
  }
}
