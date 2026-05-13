import type { ApiSuccess } from '@vietwander/shared';
import { api } from './client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MockCheckoutResponse {
  transactionCode: string;
  paymentUrl: string;
  message: string;
  bookingCode: string;
  amount: number;
}

export interface MockCallbackRequest {
  transactionCode: string;
  /** "SUCCESS" | "FAILED" */
  status: string;
}

export interface MockCallbackResponse {
  bookingCode: string;
  paymentStatus: string;
  bookingStatus: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Payment API
// ---------------------------------------------------------------------------

export const paymentApi = {
  /**
   * Initiate a mock checkout for a booking.
   * Returns a mock payment URL — no real transaction is created.
   * Message will include: "Thanh toán demo — không phát sinh giao dịch thật"
   */
  mockCheckout: (bookingCode: string) =>
    api.post<ApiSuccess<MockCheckoutResponse>>('/payments/mock-checkout', {
      bookingCode,
    }),

  /**
   * Simulate a payment callback (SUCCESS or FAILED).
   * Updates Payment + Booking status atomically.
   */
  mockCallback: (data: MockCallbackRequest) =>
    api.post<ApiSuccess<MockCallbackResponse>>('/payments/mock-callback', data),
};
