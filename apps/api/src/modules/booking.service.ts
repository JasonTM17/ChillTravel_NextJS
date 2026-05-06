import { Injectable } from "@nestjs/common";
import { demoPaymentMethods } from "@vietwander/shared";

@Injectable()
export class BookingService {
  private sequence = 0;

  create(input: { itemName: string; amount: number; method: string }) {
    const method = demoPaymentMethods.includes(input.method as never) ? input.method : "MOCK_CARD";
    this.sequence += 1;
    const suffix = this.sequence.toString().padStart(6, "0");
    return {
      id: "book_" + suffix,
      bookingCode: "VW-" + suffix,
      status: "confirmed",
      totalAmount: input.amount,
      currency: "VND",
      paymentStatus: "confirmed_mock",
      paymentMethod: method,
      isDemo: true,
      warning: "Demo payment only - no real transaction",
      qrTicket: "VW-QR-MOCK-" + suffix
    };
  }

  find(code: string) {
    return {
      bookingCode: code,
      status: "confirmed",
      paymentStatus: "confirmed_mock",
      isDemo: true,
      warning: "Demo payment only - no real transaction"
    };
  }

  cancel(id: string) {
    return { id, status: "cancelled", paymentStatus: "refunded_mock", isDemo: true };
  }
}
