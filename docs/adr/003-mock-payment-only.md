# ADR-003: Mock-Only Payment Processing

**Status:** Accepted  
**Date:** 2025-01-01  
**Deciders:** WanderViet Platform Team

---

## Context

WanderViet is a **demo and portfolio platform** showcasing a full-stack travel booking system. The platform includes a complete booking flow: tour selection → guest details → payment → confirmation.

Integrating a real payment gateway (VNPay, MoMo, Stripe, PayPal) would require:

- **PCI-DSS compliance:** Handling real card data requires passing a PCI-DSS audit (SAQ-A at minimum for redirect-based flows, SAQ-D for direct card capture). This involves network segmentation, encryption at rest, quarterly vulnerability scans, and annual assessments.
- **Merchant account:** A registered business entity, bank account, and merchant agreement with the payment provider. VNPay and MoMo require Vietnamese business registration (Giấy phép kinh doanh).
- **Legal agreements:** Terms of service, refund policy, and consumer protection compliance under Vietnamese e-commerce law (Nghị định 52/2013/NĐ-CP).
- **Ongoing operational cost:** Transaction fees (1.5–3%), monthly gateway fees, and chargeback handling.
- **Security risk:** Any misconfiguration of a real payment integration in a demo environment could result in actual financial transactions or data exposure.

None of these requirements are appropriate for a portfolio/demo project.

---

## Decision

All payment flows in WanderViet are **mock/demo only**. No real money movement occurs under any circumstances.

### Implementation

The payment module (`apps/api/src/modules/payment/`) implements the `IPaymentService` interface with a `MockPaymentService`:

```typescript
// POST /api/v1/payments/mock-checkout
// Response always includes the demo banner:
{
  "success": true,
  "message": "Thanh toán demo — không phát sinh giao dịch thật",
  "data": {
    "transactionCode": "MOCK-20250101-A1B2C3",
    "mockPaymentUrl": "/payments/mock-confirm?token=...",
    "warning": "Đây là thanh toán demo. Không có giao dịch thật nào được thực hiện."
  }
}
```

The mock flow:

1. `POST /payments/mock-checkout` — generates a `transactionCode`, returns a mock payment URL
2. User "confirms" payment on the frontend (a button click, no card data entered)
3. `POST /payments/mock-callback` — updates `Payment.status` to `confirmed_mock` and `Booking.paymentStatus` to `confirmed_mock` atomically; decrements `TourDeparture.availableSlots`

The database stores mock payment records in the `Payment` model with `provider = "MOCK"` and `isDemo = true` on the `Booking`.

### UI Banner

Every payment-related page displays a prominent Vietnamese-language banner:

> **Thanh toán demo — không phát sinh giao dịch thật**  
> _(Demo payment — no real transaction is made)_

This banner is implemented as the `<PaymentBanner />` component and cannot be dismissed.

---

## Consequences

**Positive:**

- No real money movement — safe to demo publicly without financial or legal risk
- No PCI-DSS compliance burden
- No merchant account or business registration required
- The complete booking UX (form → payment → confirmation → status updates) is fully demonstrable
- Easy to swap in a real provider later: implement `IPaymentService` with VNPay/MoMo/Stripe adapter and inject it via NestJS DI — no other code changes required

**Negative / Trade-offs:**

- Cannot demonstrate real payment gateway integration (webhook handling, 3DS, refund flows)
- The mock flow does not test network failure scenarios, timeout handling, or idempotency keys that real payment integrations require

**Future migration path:**
To add a real payment provider, implement the interface and register the new service:

```typescript
// modules/payment/vnpay-payment.service.ts
@Injectable()
export class VNPayPaymentService implements IPaymentService {
  async checkout(booking: Booking): Promise<CheckoutResult> { ... }
  async handleCallback(payload: VNPayCallback): Promise<void> { ... }
}

// payment.module.ts — swap the provider:
{ provide: IPaymentService, useClass: VNPayPaymentService }
```

---

## Alternatives Considered

| Option                | Reason Rejected                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| VNPay sandbox         | Requires Vietnamese business registration and merchant agreement even for sandbox                                      |
| Stripe test mode      | Acceptable technically, but introduces real Stripe API keys into the codebase; risk of accidental live mode activation |
| PayPal sandbox        | Same concerns as Stripe; adds external dependency to a demo project                                                    |
| Omit payment entirely | Reduces the demo value; the booking flow is a core feature of the platform                                             |
