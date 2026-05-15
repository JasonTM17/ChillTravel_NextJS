# WanderViet — Tính Năng

## Hệ Thống Đặt Chỗ

### Đặt Tour

- Duyệt và tìm kiếm tour với bộ lọc (điểm đến, giá, thời gian, danh mục)
- Trang chi tiết tour với gallery ảnh, lịch trình từng ngày, lịch khởi hành
- Chọn ngày khởi hành, số khách, áp dụng mã giảm giá
- Quy trình đặt chỗ nhiều bước: form → thanh toán → xác nhận
- Lịch sử đặt chỗ với theo dõi trạng thái (CHỜ XỬ LÝ, ĐÃ XÁC NHẬN, ĐÃ HỦY)

### Đặt Khách Sạn

- Tìm kiếm khách sạn theo vị trí, ngày nhận/trả phòng, số khách
- Chi tiết khách sạn với gallery ảnh (toàn màn hình với điều hướng bàn phím), lưới tiện nghi, ưu đãi phòng
- So sánh giá giữa các loại phòng
- Tóm tắt giá cố định trên desktop, CTA cố định trên mobile

### Tìm Chuyến Bay

- Tìm kiếm một chiều và khứ hồi
- Lọc theo hãng bay, số điểm dừng, giờ khởi hành
- Kết quả sắp xếp theo giá, thời gian bay, hoặc giờ khởi hành

---

## Tính Năng AI

Tất cả tính năng AI chạy cục bộ qua Ollama LLM + Qdrant vector database. Không cần API key cloud.

### Lập Lịch Trình AI (`/ai-planner`)

- Lập kế hoạch du lịch bằng ngôn ngữ tự nhiên: "Lên kế hoạch 5 ngày ở Đà Nẵng cho gia đình"
- Tạo lịch trình có cấu trúc với hoạt động hàng ngày, bữa ăn, chỗ ở
- Gợi ý thông minh dựa trên cơ sở kiến thức điểm đến

### Trợ Lý Chat AI (`/chat`)

- Tư vấn du lịch dạng hội thoại
- Hỗ trợ RAG: truy xuất thông tin điểm đến liên quan từ vector DB
- Phản hồi streaming cho tương tác thời gian thực
- Hỗ trợ đa ngôn ngữ (Tiếng Việt + Tiếng Anh)

### Ước Tính Ngân Sách (`/budget`)

- Ước tính chi phí chuyến đi dựa trên điểm đến, thời gian, phong cách du lịch
- Phân tích theo danh mục: chỗ ở, ăn uống, di chuyển, hoạt động

### Trắc Nghiệm Tính Cách Du Lịch (`/personality`)

- Trắc nghiệm tương tác để xác định phong cách du lịch
- Gợi ý điểm đến cá nhân hóa dựa trên kết quả

### So Sánh Điểm Đến (`/compare`)

- So sánh song song nhiều điểm đến
- AI tạo ưu/nhược điểm và đề xuất

### Tìm Kiếm Theo Tâm Trạng

- Chuyển đổi tâm trạng ngôn ngữ tự nhiên ("Tôi muốn nơi thư giãn bên bãi biển") thành bộ lọc tìm kiếm
- Trả về điểm đến phù hợp từ cơ sở dữ liệu

---

## Quản Lý Người Dùng

### Xác Thực

- Xác thực JWT với token rotation (access 15 phút + refresh 7 ngày)
- Đăng ký email/mật khẩu với xác minh email
- Quy trình đặt lại mật khẩu qua link email
- Route được bảo vệ với AuthGuard component

### Hồ Sơ Người Dùng (`/profile`)

- Chỉnh sửa thông tin cá nhân (tên, điện thoại, avatar)
- Xem lịch sử đặt chỗ
- Quản lý tùy chọn thông báo

### Danh Sách Yêu Thích (`/wishlist`)

- Lưu tour và điểm đến
- Cập nhật UI lạc quan với rollback khi thất bại

### Thông Báo (`/notifications`)

- Trung tâm thông báo trong ứng dụng
- Cập nhật trạng thái đặt chỗ, khuyến mãi, cảnh báo hệ thống

### Chương Trình Khách Hàng Thân Thiết (`/loyalty`)

- Tích lũy điểm từ đặt chỗ
- Hệ thống hạng với quyền lợi

---

## Bảng Điều Khiển Admin

### Phân Tích (`/admin/analytics`)

- Biểu đồ doanh thu đặt chỗ
- Chỉ số tăng trưởng người dùng
- Điểm đến và tour phổ biến

### Quản Lý Nội Dung

- **Tour** (`/admin/tours`) — CRUD với trình tạo lịch trình, quản lý khởi hành
- **Khách sạn** (`/admin/hotels`) — Loại phòng, giá, tiện nghi
- **Điểm đến** (`/admin/destinations`) — Địa lý, danh mục, hình ảnh
- **Blog** (`/admin/blogs`) — Trình soạn thảo rich text, trạng thái xuất bản/nháp
- **Mã giảm giá** (`/admin/coupons`) — Mã giảm giá với giới hạn sử dụng và hạn dùng

### Quản Lý Người Dùng & Đặt Chỗ

- **Người dùng** (`/admin/users`) — Phân quyền, trạng thái tài khoản
- **Đặt chỗ** (`/admin/bookings`) — Cập nhật trạng thái, chi tiết khách, theo dõi thanh toán
- **Đánh giá** (`/admin/reviews`) — Kiểm duyệt (duyệt/từ chối)
- **Liên hệ** (`/admin/contacts`) — Quản lý yêu cầu khách hàng

### Cơ Sở Kiến Thức AI (`/admin/ai-knowledge`)

- Quản lý tài liệu RAG cho chatbot AI
- Import datasets, kích hoạt reindexing

---

## Khám Phá & Tìm Kiếm

### Tìm Kiếm Điểm Đến (`/explore`)

- Tìm kiếm full-text với bộ lọc danh mục (Biển, Văn hóa, Ẩm thực, Núi, Resort, Phố cổ)
- Sắp xếp theo đánh giá, tên, mới nhất
- Thanh lọc thu gọn trên mobile
- Lưới tìm kiếm responsive với breakpoints trung gian

### Bản Đồ Tương Tác (`/map`)

- Khám phá điểm đến trên bản đồ
- Cluster markers cho khu vực dày đặc

### Trải Nghiệm (`/experiences`)

- Trải nghiệm và hoạt động du lịch được tuyển chọn
- Duyệt theo danh mục

### Lập Kế Hoạch Chuyến Đi (`/trips`)

- Lưu và tổ chức lịch trình chuyến đi
- Hỗ trợ AI trong xây dựng chuyến đi

---

## Tính Năng Kỹ Thuật

### Frontend (Next.js 16)

- React 19 với Server Components khi phù hợp
- Hệ thống thiết kế tùy chỉnh với Tailwind CSS tokens (`tv-blue`, `tv-orange`, `tv-ink`, v.v.)
- Thiết kế responsive mobile-first với breakpoints phù hợp
- Fallback hình ảnh với xử lý lỗi
- Skeleton loading states cho tất cả trang fetch dữ liệu
- Error boundaries theo route segment
- Hỗ trợ quốc tế hóa (Tiếng Việt chính, Tiếng Anh phụ)

### Backend (NestJS 11)

- RESTful API với Swagger/OpenAPI tự động tạo tài liệu
- Prisma ORM với PostgreSQL 18
- Redis caching cho sessions và dữ liệu truy cập thường xuyên
- Rate limiting trên endpoints nhạy cảm (auth, AI)
- Upload file với bảo vệ path traversal
- Global exception filters và validation pipes
- Health check endpoints cho Docker orchestration

### Dịch Vụ AI (FastAPI)

- Tích hợp Ollama cho LLM inference cục bộ
- Qdrant vector database cho RAG document retrieval
- Streaming responses qua Server-Sent Events
- Quản lý cơ sở kiến thức với reindexing API
- 10 endpoints chuyên biệt cho các tác vụ AI khác nhau

### Mobile (Flutter)

- Đa nền tảng (iOS + Android) từ một codebase
- 12 màn hình bao gồm tính năng đặt chỗ và AI cốt lõi
- Shared API contracts với web frontend

### Hạ Tầng

- Docker Compose với 6 services (postgres, redis, qdrant, api, web, ai)
- Multi-stage Docker builds cho kích thước image tối thiểu
- Non-root containers cho bảo mật
- Health checks trên tất cả services
- GitHub Actions CI/CD: lint → test → build → push images

### Testing

- **Unit tests** — Vitest cho API services và utilities
- **E2E tests** — Playwright cho critical user flows
- **Load tests** — k6 scripts cho API performance validation
- **Type checking** — TypeScript strict mode trên tất cả packages

---

## Bảo Mật

- JWT với access tokens ngắn hạn và secure refresh rotation
- Rate limiting (Throttle decorator) trên auth và AI endpoints
- Bảo vệ path traversal trong file upload service
- Input validation qua class-validator trên tất cả DTOs
- Cấu hình CORS cho allowed origins
- Non-root Docker containers
- Không xử lý thanh toán thật (chỉ demo theo thiết kế, ghi nhận trong ADR-003)
