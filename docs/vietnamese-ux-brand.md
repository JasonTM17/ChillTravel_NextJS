# WanderViet — Vietnamese UX & Brand Guide

## Design DNA

WanderViet follows a Vietnamese OTA-style design: fast search, clear comparison, transparent demo payments, and a local-first AI assistant. The product is legally distinct and does not copy any third-party brand.

### Palette

| Token        | Hex       | Usage                                    |
| ------------ | --------- | ---------------------------------------- |
| Booking Blue | `#0277D4` | Primary navigation, active states, trust |
| Blue Dark    | `#005EA8` | Hover, high-trust states                 |
| Sky Surface  | `#EAF7FF` | Page backgrounds, soft panels            |
| White Card   | `#FFFFFF` | Booking and comparison surfaces          |
| Orange CTA   | `#FF6D1A` | Conversion actions (Tìm kiếm, Đặt chỗ)   |
| Teal Trust   | `#0F8B7B` | Local/RAG safety badges                  |
| Ink          | `#071827` | Primary text                             |
| Muted Ink    | `#476273` | Secondary text                           |
| Border       | `#D9ECFB` | Cards, inputs, tables                    |

### Typography

- **UI font**: Be Vietnam Pro → Inter → system sans-serif
- Letter spacing: `0` (except small uppercase metadata labels at `0.12–0.14em`)
- Headings: `font-black` (900 weight), compact, high-legibility

## Vietnamese Copy Standards

### Standard CTAs

| Vietnamese                  | Context        |
| --------------------------- | -------------- |
| `Tìm kiếm`                  | Search submit  |
| `Xem ưu đãi`                | View deals     |
| `Lập lịch trình thông minh` | AI planner CTA |
| `Lưu vào yêu thích`         | Wishlist add   |
| `Đặt chỗ demo`              | Booking CTA    |
| `Xem chi tiết`              | Detail link    |
| `Đăng nhập`                 | Login          |
| `Đăng ký`                   | Register       |
| `Thử lại`                   | Retry on error |

### Route Labels

| Route            | Vietnamese label |
| ---------------- | ---------------- |
| `/`              | Trang chủ        |
| `/tours`         | Danh sách tour   |
| `/explore`       | Khám phá         |
| `/wishlist`      | Yêu thích        |
| `/my-bookings`   | Đặt chỗ của tôi  |
| `/profile`       | Hồ sơ            |
| `/notifications` | Thông báo        |
| `/admin`         | Bảng vận hành    |

## Payment Boundary

Every payment-facing surface **must** display:

> **Thanh toán demo — không phát sinh giao dịch thật**

Rules:

- Never store real card data
- Never charge real money
- Never bypass legal or provider requirements
- The `<PaymentBanner />` component is non-dismissible

## AI Assistant Boundary

- Chatbot runs on local Ollama + Qdrant — no OpenAI API key required
- When users ask for live flight prices, visa requirements, or current weather, the UI must clearly state this is sample/local data and recommend official sources

## Component Conventions

- Cards: `rounded-2xl`, `border border-[#d9ecfb]`, `bg-white`, subtle blue shadow
- Buttons: `rounded-xl`, orange for primary CTA, blue for secondary
- Skeletons: `animate-pulse bg-[#d9ecfb]` via `<Skeleton />` component
- Empty states: `MapPin` icon + Vietnamese message + CTA
- Error states: red-50 background + "Thử lại" button
- Focus ring: `outline: 3px solid #f97316` (orange)
