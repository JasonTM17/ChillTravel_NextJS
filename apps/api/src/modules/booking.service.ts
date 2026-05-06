import { Injectable } from "@nestjs/common";
import { demoPaymentMethods } from "@vietwander/shared";

@Injectable()
export class BookingService {
  create(input: { itemName: string; amount: number; method: string }) {
    const method = demoPaymentMethods.includes(input.method as never) ? input.method : "MOCK_CARD";
    return {
      id: "book_" + Date.now(),
      bookingCode: "VW-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      status: "confirmed",
      totalAmount: input.amount,
      currency: "VND",
      paymentStatus: "confirmed_mock",
      paymentMethod: method,
      isDemo: true,
      warning: "Demo payment — no real transaction",
      qrTicket: "VW-QR-MOCK-" + Date.now()
    };
  }

  find(code: string) {
    return {
      bookingCode: code,
      status: "confirmed",
      paymentStatus: "confirmed_mock",
      isDemo: true,
      warning: "Demo payment — no real transaction"
    };
  }

  cancel(id: string) {
    return { id, status: "cancelled", paymentStatus: "refunded_mock", isDemo: true };
  }
}
