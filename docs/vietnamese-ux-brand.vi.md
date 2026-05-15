# WanderViet — Hướng Dẫn UX & Thương Hiệu Việt Nam

## DNA Thiết Kế

WanderViet theo phong cách thiết kế OTA Việt Nam: tìm kiếm nhanh, so sánh rõ ràng, thanh toán demo minh bạch, và trợ lý AI cục bộ. Sản phẩm hoàn toàn độc lập và không sao chép bất kỳ thương hiệu bên thứ ba nào.

### Bảng Màu

| Token        | Hex       | Sử dụng                                      |
| ------------ | --------- | -------------------------------------------- |
| Booking Blue | `#0277D4` | Navigation chính, trạng thái active, tin cậy |
| Blue Dark    | `#005EA8` | Hover, trạng thái tin cậy cao                |
| Sky Surface  | `#EAF7FF` | Nền trang, panel nhẹ                         |
| White Card   | `#FFFFFF` | Bề mặt booking và so sánh                    |
| Orange CTA   | `#FF6D1A` | Hành động chuyển đổi (Tìm kiếm, Đặt chỗ)     |
| Teal Trust   | `#0F8B7B` | Badge an toàn Local/RAG                      |
| Ink          | `#071827` | Text chính                                   |
| Muted Ink    | `#476273` | Text phụ                                     |
| Border       | `#D9ECFB` | Cards, inputs, tables                        |

### Typography

- **Font UI**: Be Vietnam Pro → Inter → system sans-serif
- Letter spacing: `0` (trừ label metadata uppercase nhỏ ở `0.12–0.14em`)
- Headings: `font-black` (weight 900), compact, dễ đọc

## Tiêu Chuẩn Copy Tiếng Việt

### CTA Tiêu Chuẩn

| Tiếng Việt                  | Ngữ cảnh        |
| --------------------------- | --------------- |
| `Tìm kiếm`                  | Submit tìm kiếm |
| `Xem ưu đãi`                | Xem deals       |
| `Lập lịch trình thông minh` | CTA AI planner  |
| `Lưu vào yêu thích`         | Thêm wishlist   |
| `Đặt chỗ demo`              | CTA Booking     |
| `Xem chi tiết`              | Link chi tiết   |
| `Đăng nhập`                 | Login           |
| `Đăng ký`                   | Register        |
| `Thử lại`                   | Retry khi lỗi   |

### Nhãn Route

| Route            | Nhãn tiếng Việt       |
| ---------------- | --------------------- |
| `/`              | Trang chủ             |
| `/tours`         | Danh sách tour        |
| `/explore`       | Khám phá              |
| `/wishlist`      | Yêu thích             |
| `/my-bookings`   | Đặt chỗ của tôi       |
| `/profile`       | Hồ sơ                 |
| `/notifications` | Thông báo             |
| `/admin`         | Bảng điều khiển Admin |

## Ranh Giới Thanh Toán

Mọi bề mặt liên quan thanh toán **phải** hiển thị:

> **Thanh toán demo — không phát sinh giao dịch thật**

Quy tắc:

- Không bao giờ lưu dữ liệu thẻ thật
- Không bao giờ thu tiền thật
- Không bao giờ bỏ qua yêu cầu pháp lý hoặc nhà cung cấp
- Component `<PaymentBanner />` không thể đóng

## Ranh Giới Trợ Lý AI

- Chatbot chạy trên Ollama + Qdrant cục bộ — không cần OpenAI API key
- Khi người dùng hỏi về giá vé máy bay trực tiếp, yêu cầu visa, hoặc thời tiết hiện tại, UI phải nêu rõ đây là dữ liệu mẫu/cục bộ và khuyến nghị nguồn chính thức

## Quy Ước Component

- Cards: `rounded-2xl`, `border border-[#d9ecfb]`, `bg-white`, shadow xanh nhẹ
- Buttons: `rounded-xl`, cam cho CTA chính, xanh cho phụ
- Skeletons: `animate-pulse bg-[#d9ecfb]` qua component `<Skeleton />`
- Empty states: icon `MapPin` + thông báo tiếng Việt + CTA
- Error states: nền red-50 + nút "Thử lại"
- Focus ring: `outline: 3px solid #f97316` (cam)
