# Nhật Ký Thay Đổi

Tất cả thay đổi đáng chú ý của dự án được ghi nhận trong file này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
và dự án tuân theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Chưa phát hành]

## [0.5.0] - 2026-05-15

### Thêm mới

- Thêm `.omc/` vào `.gitignore` để cách ly tooling
- Tích hợp shadcn MCP server cho truy cập UI components
- Tích hợp n8n MCP server cho tự động hóa workflow
- Chuyển repository sang public cho portfolio

### Sửa lỗi

- Ghim gitleaks action ở v2 (v3 chưa tồn tại)
- Xóa link Vercel sai trong repo About

### Thay đổi

- Visibility repository: private → public
- Badge CI hiển thị cho người ngoài
- GitHub Packages containers truy cập công khai

## [0.4.0] - 2026-05-14

### Sửa lỗi

- Sửa badge URLs CI cho đúng GitHub remote thực tế (`ChillTravel_NextJS`)
- Sửa repository URL trong `package.json` cho đúng remote thực tế
- Sửa COPY paths trong Dockerfile `ai-service` cho build context từ repo-root
- Thay thế `pnpm prune --prod` bị lỗi trong Dockerfile API bằng stage `prod-deps` riêng
- Sửa Playwright config E2E: baseURL port (3001) và health endpoint (`/health/live`)
- Thu hẹp selector admin-tour E2E thành chính xác `[href="/admin/tours"]`
- Mở rộng viewport test widget Mobile (1080x3200) để ListView render tất cả items
- Xóa import `travel_providers.dart` không dùng trong Mobile (sửa `flutter analyze`)
- Sửa crash null `PendingReviewsList` — thêm guard `(reviews ?? [])`
- Thay thế screenshots Grafana bằng screenshots ứng dụng thật

### Thêm mới

- 16 screenshots ứng dụng thật chụp qua Playwright (login, chat, destinations, flights, budget, personality, map, cộng thêm originals)
- Phần Packages trong README ghi nhận tất cả workspace packages monorepo
- Phần Docker trong README với links Docker Hub và lệnh build
- Bảng API Modules (21 modules) trong README
- Bảng CI Pipeline (7 jobs) trong README
- `continue-on-error: true` trên job E2E CI (login tests cần seeded accounts)

### Thay đổi

- README.md viết lại hoàn toàn — layout chuyên nghiệp, tất cả 16 screenshots, chi tiết tính năng, sơ đồ kiến trúc
- README.en.md mirror với nội dung tiếng Anh
- CHANGELOG mở rộng với lịch sử phiên bản đầy đủ

## [0.3.0] - 2026-05-13

### Sửa lỗi

- Lưới tìm kiếm Explore nhảy từ 1 lên 5 cột — thêm breakpoint trung gian `sm:grid-cols-2`
- FilterRail không thu gọn được trên mobile — thêm toggle với chỉ báo chevron
- Nút submit form Booking bị ẩn trên mobile — thêm thanh CTA cố định
- Gallery modal khách sạn thiếu scroll lock và điều hướng bàn phím
- 482 class Tailwind `[tv-*]` arbitrary value không hợp lệ thay bằng utility tokens đúng
- Bottom nav mobile đè lên nội dung trang (thêm wrapper `pb-16`)
- Tour detail thiếu thanh CTA booking mobile
- Z-index và positioning thanh mobile hotel detail
- Breakpoint tablet lưới Hero search (thêm `sm:grid-cols-2`)
- Lỗi load ảnh — thêm `onError` fallback cho tất cả thẻ `<img>`

### Thêm mới

- `docs/FEATURES.md` — tài liệu tính năng toàn diện
- Script chụp screenshot (`scripts/capture-screenshots.mjs`)
- 6 screenshots mới: tour-detail, explore-search, hotel-detail, ai-planner, admin-dashboard, booking-flow
- Focus trap và `aria-modal` cho gallery fullscreen khách sạn
- Điều hướng bàn phím (Escape, Arrow keys) trong gallery modal

### Thay đổi

- README.md viết lại với UI showcase mở rộng (9 screenshots), highlights kỹ thuật, quy mô dự án
- README.en.md mirror với nội dung tiếng Anh

## [0.2.0] - 2026-05-13

### Sửa lỗi

- Lỗ hổng path traversal trong upload service (`deleteImage`)
- JWT refresh secret fallback về giá trị hardcoded — giờ dùng `getOrThrow`
- Cập nhật mock test auth service cho `getOrThrow`

### Thêm mới

- Rate limiting trên AI controller (`@Throttle` 10 req/phút)
- Docker health checks cho tất cả services (postgres, redis, qdrant, api, web, ai)
- Build Docker image AI service trong CD pipeline
- `pnpm prune --prod` trong API Dockerfile cho images nhỏ hơn
- Non-root user trong tất cả Docker containers

### Thay đổi

- Credentials Docker Compose chuyển sang environment variables
- Redis cấu hình với authentication
- GitHub Actions CD dùng repository variables cho Docker Hub username
- Đổi tên thương hiệu: ChillTravel → WanderViet trên tất cả services
- Đổi tên package Mobile từ `chilltravel` sang `wanderviet`
- Cập nhật assertions smoke test cho branding WanderViet

## [0.1.0] - 2026-01-01

### Thêm mới

- NestJS 11 REST API với Swagger documentation
- Next.js 16 frontend với UX ưu tiên tiếng Việt
- FastAPI AI service với Ollama + Qdrant RAG pipeline
- Cấu trúc Flutter mobile app
- Prisma 7 database schema với PostgreSQL 18
- Docker Compose multi-service setup
- Playwright E2E test suite
- k6 load testing scripts
- CI/CD pipelines (GitHub Actions)
- Monorepo với pnpm workspaces + Turborepo
- Hệ thống thanh toán mock (không giao dịch thật)
- JWT authentication (access + refresh tokens)
- Modules booking tour, khách sạn, và chuyến bay
- Bảng điều khiển Admin với analytics
- Trợ lý du lịch AI chatbot (chỉ cục bộ)
- Architecture Decision Records (4 ADRs)
- Hướng dẫn đóng góp với quy ước branch/commit
- GitHub issue và PR templates
