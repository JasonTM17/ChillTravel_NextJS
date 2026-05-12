import { Injectable, Logger } from "@nestjs/common";

/**
 * Stub EmailService — logs to console only.
 * Real SMTP implementation comes in Task 25 (Req 19).
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  sendEmailVerification(to: string, token: string): void {
    this.logger.log(`[EMAIL] to=${to} subject="Verify your WanderViet account" token=${token}`);
  }

  sendBookingConfirmation(to: string, bookingCode: string): void {
    this.logger.log(`[EMAIL] to=${to} subject="Booking Confirmed" bookingCode=${bookingCode}`);
  }

  sendBookingStatusUpdate(to: string, bookingCode: string, status: string): void {
    this.logger.log(
      `[EMAIL] to=${to} subject="Booking Status Update" bookingCode=${bookingCode} status=${status}`
    );
  }

  sendReviewApproved(to: string, reviewId: string): void {
    this.logger.log(`[EMAIL] to=${to} subject="Your review was approved" reviewId=${reviewId}`);
  }

  sendPasswordReset(to: string, token: string): void {
    this.logger.log(`[EMAIL] to=${to} subject="Reset your password" token=${token}`);
  }
}
