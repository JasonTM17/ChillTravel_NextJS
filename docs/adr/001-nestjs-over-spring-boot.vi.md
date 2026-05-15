# ADR-001: NestJS thay vì Spring Boot

**Trạng thái:** Chấp nhận  
**Ngày:** 2025-01-01  
**Người quyết định:** Đội ngũ WanderViet Platform

---

## Bối Cảnh

Nền tảng WanderViet được xây dựng dưới dạng TypeScript monorepo quản lý bằng pnpm workspaces và Turborepo. Frontend (`apps/web`) là Next.js 16, mobile client là Flutter, và dịch vụ AI là FastAPI (Python). Backend API (`apps/api`) cần một framework phù hợp với hệ sinh thái này.

Spring Boot được xem xét như một lựa chọn thay thế vì sự trưởng thành, hệ sinh thái enterprise phong phú, và được sử dụng rộng rãi trong môi trường doanh nghiệp Việt Nam. Tuy nhiên, việc áp dụng Spring Boot sẽ yêu cầu:

- Giới thiệu Java hoặc Kotlin như ngôn ngữ chính thứ hai trong monorepo
- Toolchain build riêng biệt (Maven hoặc Gradle) không tích hợp với Turborepo task orchestration
- Trùng lặp type definitions đã được chia sẻ qua `packages/shared` (TypeScript)
- Đường cong học tập dốc hơn cho contributors đã thành thạo TypeScript

Chuyên môn hiện tại của đội là TypeScript-first. Monorepo đã có `packages/shared` export domain types, enums, và API contracts được sử dụng bởi cả Next.js frontend và NestJS backend.

---

## Quyết Định

Giữ **NestJS 11** làm backend framework cho `apps/api`.

NestJS cung cấp:

- Cấu trúc decorator-based, có chủ kiến (modules, controllers, services, guards, interceptors) ánh xạ rõ ràng với domain model
- Hỗ trợ TypeScript first-class không có friction transpilation
- Tích hợp native với `@nestjs/swagger` (đã cấu hình tại `/api/docs`)
- `@nestjs/jwt`, `@nestjs/passport`, `@nestjs/throttler`, `@nestjs/terminus`, `@nestjs/schedule` — tất cả production-grade, được maintain bởi đội NestJS
- Tương thích Vitest cho unit và integration tests nhanh

---

## Hệ Quả

**Tích cực:**

- Shared types giữa frontend và backend qua `packages/shared` — nguồn sự thật duy nhất cho DTOs, enums, và API contracts
- Một ngôn ngữ duy nhất (TypeScript) trên toàn bộ stack (Next.js, NestJS, shared packages), giảm context switching
- Turborepo có thể điều phối `build`, `lint`, `test` tasks trên tất cả packages đồng nhất
- Iteration nhanh hơn: không JVM warm-up, không build step riêng, hot-reload qua `ts-node-dev`
- Rào cản đóng góp thấp hơn cho TypeScript developers

**Tiêu cực / Đánh đổi:**

- NestJS ít trưởng thành hơn Spring Boot cho enterprise patterns quy mô lớn (vd: quản lý transaction phức tạp, tính năng ORM cấp JPA)
- Node.js runtime là single-threaded; workloads CPU-bound cần worker threads hoặc offload sang dịch vụ AI Python
- Hệ sinh thái Spring Boot (Spring Security, Spring Data) có hàng thập kỷ patterns đã được kiểm chứng; các tương đương NestJS còn trẻ hơn

**Giảm thiểu:**

- Prisma xử lý data access với full type safety, bù đắp cho việc thiếu JPA
- Công việc AI/ML CPU-bound được ủy thác cho `apps/ai-service` (FastAPI + Python)
- Các interfaces `IPaymentService`, `IEmailService`, và `IUploadService` đảm bảo service layer có thể thay thế nếu microservice Java được giới thiệu sau

---

## Các Lựa Chọn Đã Xem Xét

| Lựa chọn             | Lý do từ chối                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------- |
| Spring Boot (Java)   | Yêu cầu chuyên môn Java/Kotlin; phá vỡ TypeScript monorepo; toolchain build riêng        |
| Spring Boot (Kotlin) | DX tốt hơn Java một chút nhưng vẫn cần JVM; cùng vấn đề toolchain                        |
| Express.js (bare)    | Không có cấu trúc; cần xây guards, interceptors, DI từ đầu                               |
| Fastify              | Hiệu suất tốt nhưng thiếu module system có chủ kiến và hệ sinh thái decorator của NestJS |
| Hono                 | Quá tối giản cho platform production-grade với 60+ endpoints                             |
