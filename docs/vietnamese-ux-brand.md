# ChillTravel Vietnamese UX & Brand Runbook

## Mục tiêu

ChillTravel dùng cảm hứng travel-commerce hiện đại: tìm kiếm nhanh, danh sách dễ so sánh, giá/CTA rõ ràng, thanh toán demo minh bạch và AI local-first. Sản phẩm không clone Traveloka hay bất kỳ thương hiệu nào khác.

## Nguyên tắc thương hiệu

- Logo ChillTravel phải khác biệt hợp pháp: la bàn, đường bay, gợi ý bản đồ Việt Nam, Hoàng Sa, Trường Sa và nhịp chuyển động riêng.
- Không dùng chim, wordmark, tỷ lệ biểu tượng, asset, screenshot, hoặc bố cục có thể gây nhầm lẫn với Traveloka.
- Màu chủ đạo: booking blue đáng tin cậy, teal cho tín hiệu local/AI an toàn, orange cho CTA chuyển đổi, nền trắng/xanh nhạt.
- Ảnh điểm đến là tín hiệu chính; tránh nền AI sci-fi, orb, neon hoặc glass quá nặng.

## Copy tiếng Việt

CTA chuẩn:

- `Tìm kiếm`
- `Xem ưu đãi`
- `Lập lịch trình thông minh`
- `Lưu vào yêu thích`
- `Đặt chỗ demo`
- `Xem chi tiết`

Nhãn route chính:

- `/budget`: `Ngân sách thông minh`
- `/compare`: `So sánh thông minh`
- `/personality`: `Phong cách du lịch`
- `/wishlist`: `Yêu thích`
- `/trips`: `Chuyến đi`
- `/profile`: `Hồ sơ`
- `/admin`: `Bảng vận hành`

Không đưa lại các cụm cũ trong user flow: `Mock payment - no real transaction`, `Open dossier`, `Search results`, `Traveler profile`, `Login`, `Wishlist`, `Admin dashboard`.

## Payment và AI boundary

- Luôn hiển thị: `Thanh toán demo — không phát sinh giao dịch thật`.
- Không lưu thẻ thật, không charge thật, không bypass luật thanh toán.
- Chatbot runtime dùng local AI service/Ollama/RAG khi chạy production local; không yêu cầu OpenAI API key.
- Nếu hỏi vé bay, visa, thời tiết real-time, UI/chatbot phải nói rõ đây là dữ liệu mẫu/local và khuyên kiểm tra nguồn chính thức.

## QA bắt buộc

Trước commit UI:

```powershell
pnpm --filter @vietwander/web lint
pnpm --filter @vietwander/web test
pnpm --filter @vietwander/web build
```

Smoke routes:

- `/`
- `/explore?q=Da+Nang`
- `/destinations/da-nang`
- `/hotels`
- `/experiences`
- `/ai-planner`
- `/chat`
- `/booking/demo`
- `/booking/da-nang`
- `/budget`
- `/compare`
- `/personality`
- `/wishlist`
- `/trips`
- `/profile`
- `/admin`
- `/admin/ai-knowledge`
