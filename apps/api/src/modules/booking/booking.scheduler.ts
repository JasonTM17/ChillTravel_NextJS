import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Background scheduler for booking lifecycle management (Req 33, §18.4).
 *
 * Jobs:
 *   - Every hour: expire PENDING bookings older than 24 h without payment.
 *   - Daily at 02:00: complete CONFIRMED bookings whose tour departure has ended.
 */
@Injectable()
export class BookingScheduler {
  private readonly logger = new Logger(BookingScheduler.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Every hour — cancel PENDING bookings that have been waiting for payment
   * for more than 24 hours (business rule: PENDING > 24 h without payment → CANCELLED).
   */
  @Cron(CronExpression.EVERY_HOUR)
  async expireStalePendingBookings(): Promise<void> {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await this.prisma.booking.updateMany({
      where: {
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: { lt: cutoff },
      },
      data: { status: 'cancelled' },
    });

    if (result.count > 0) {
      this.logger.log(`[Scheduler] Expired ${result.count} stale pending booking(s)`);
    }
  }

  /**
   * Daily at 02:00 — mark CONFIRMED bookings as COMPLETED when the tour
   * departure's returnDate has passed by more than 1 day
   * (business rule: CONFIRMED where tour departure date has passed > 1 day → COMPLETED).
   */
  @Cron('0 2 * * *')
  async completePastConfirmedBookings(): Promise<void> {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find confirmed bookings where the departure returnDate has passed
    const bookings = await this.prisma.booking.findMany({
      where: {
        status: 'confirmed',
        departure: {
          returnDate: { lt: yesterday },
        },
      },
      select: { id: true },
    });

    if (bookings.length === 0) {
      return;
    }

    const ids = bookings.map((b) => b.id);
    const result = await this.prisma.booking.updateMany({
      where: { id: { in: ids } },
      data: { status: 'completed' },
    });

    this.logger.log(`[Scheduler] Completed ${result.count} past confirmed booking(s)`);
  }
}
