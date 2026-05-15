# ADR-003: Chỉ Thanh Toán Mock

**Trạng thái:** Chấp nhận  
**Ngày:** 2025-01-01  
**Người quyết định:** Đội ngũ WanderViet Platform

---

## Bối Cảnh

WanderViet là **nền tảng demo và portfolio** trình bày hệ thống booking du lịch full-stack. Nền tảng bao gồm quy trình booking hoàn chỉnh: chọn tour → chi tiết khách → thanh toán → xác nhận.

Tích hợp cổng thanh toán thật (VNPay, MoMo, Stripe, PayPal) sẽ yêu cầu:

- **Tuân thủ PCI-DSS:** Xử lý dữ liệu thẻ thật cần vượt qua audit PCI-DSS (SAQ-A tối thiểu cho redirect-based flows, SAQ-D cho direct card capture). Điều này bao gồm phân đoạn mạng, mã hóa at rest, quét lỗ hổng hàng quý, và đánh giá hàng năm.
- **Tài khoản merchant:** Pháp nhân đăng ký kinh doanh, tài khoản ngân hàng, và thỏa thuận merchant với nhà cung cấp thanh toán. VNPay và MoMo yêu cầu đăng ký kinh doanh Việt Nam (Giấy phép kinh doanh).
- **Thỏa thuận pháp lý:** Điều khoản dịch vụ, chính sách hoàn tiền, và tuân thủ bảo vệ người tiêu dùng theo luật thương mại điện tử Việt Nam (Nghị định 52/2013/NĐ-CP).
- **Chi phí vận hành liên tục:** Phí giao dịch (1.5–3%), phí gateway hàng tháng, và xử lý chargeback.
- **Rủi ro bảo mật:** Bất kỳ cấu hình sai nào của tích hợp thanh toán thật trong môi trường demo có thể dẫn đến giao dịch tài chính thực hoặc lộ dữ liệu.

Không yêu cầu nào trong số này phù hợp cho dự án portfolio/demo.

---

## Quyết Định

Tất cả quy trình thanh toán trong WanderViet là **chỉ mock/demo**. Không có chuyển động tiền thật xảy ra trong bất kỳ trường hợp nào.

### Triển Khai

Module thanh toán (`apps/api/src/modules/payment/`) triển khai interface `IPaymentService` với `MockPaymentService`:

```typescript
// POST /api/v1/payments/mock-checkout
// Response luôn bao gồm banner demo:
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

Quy trình mock:

1. `POST /payments/mock-checkout` — sinh `transactionCode`, trả về mock payment URL
2. Người dùng "xác nhận" thanh toán trên frontend (click nút, không nhập dữ liệu thẻ)
3. `POST /payments/mock-callback` — cập nhật `Payment.status` thành `confirmed_mock` và `Booking.paymentStatus` thành `confirmed_mock` atomic; giảm `TourDeparture.availableSlots`

Database lưu mock payment records trong model `Payment` với `provider = "MOCK"` và `isDemo = true` trên `Booking`.

### Banner UI

Mọi trang liên quan thanh toán hiển thị banner tiếng Việt nổi bật:

> **Thanh toán demo — không phát sinh giao dịch thật**  
> _(Demo payment — no real transaction is made)_

Banner này được triển khai dưới dạng component `<PaymentBanner />` và không thể đóng.

---

## Hệ Quả

**Tích cực:**

- Không chuyển động tiền thật — an toàn để demo công khai không có rủi ro tài chính hoặc pháp lý
- Không gánh nặng tuân thủ PCI-DSS
- Không cần tài khoản merchant hoặc đăng ký kinh doanh
- UX booking hoàn chỉnh (form → thanh toán → xác nhận → cập nhật trạng thái) có thể demo đầy đủ
- Dễ dàng thay thế nhà cung cấp thật sau: triển khai `IPaymentService` với VNPay/MoMo/Stripe adapter và inject qua NestJS DI — không cần thay đổi code khác

**Tiêu cực / Đánh đổi:**

- Không thể demo tích hợp cổng thanh toán thật (xử lý webhook, 3DS, quy trình hoàn tiền)
- Quy trình mock không test các tình huống network failure, timeout handling, hoặc idempotency keys mà tích hợp thanh toán thật yêu cầu

**Đường dẫn migration tương lai:**
Để thêm nhà cung cấp thanh toán thật, triển khai interface và đăng ký service mới:

```typescript
// modules/payment/vnpay-payment.service.ts
@Injectable()
export class VNPayPaymentService implements IPaymentService {
  async checkout(booking: Booking): Promise<CheckoutResult> { ... }
  async handleCallback(payload: VNPayCallback): Promise<void> { ... }
}

// payment.module.ts — thay đổi provider:
{ provide: IPaymentService, useClass: VNPayPaymentService }
```

---

## Các Lựa Chọn Đã Xem Xét

| Lựa chọn                | Lý do từ chối                                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| VNPay sandbox           | Yêu cầu đăng ký kinh doanh Việt Nam và thỏa thuận merchant ngay cả cho sandbox                              |
| Stripe test mode        | Chấp nhận được về kỹ thuật, nhưng đưa Stripe API keys thật vào codebase; rủi ro kích hoạt live mode vô tình |
| PayPal sandbox          | Cùng lo ngại như Stripe; thêm dependency bên ngoài cho dự án demo                                           |
| Bỏ thanh toán hoàn toàn | Giảm giá trị demo; quy trình booking là tính năng cốt lõi của nền tảng                                      |
