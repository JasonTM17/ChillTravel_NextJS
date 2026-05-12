# WanderViet Travel Platform

Nền tảng đặt tour du lịch Việt Nam và quốc tế — full-stack, production-grade, Vietnamese-first.

[![CI](https://github.com/your-org/wanderviet/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/wanderviet/actions/workflows/ci.yml)
[![Docker API](https://img.shields.io/docker/v/nguyenson1710/wanderviet-api?label=API&logo=docker)](https://hub.docker.com/r/nguyenson1710/wanderviet-api)
[![Docker Web](https://img.shields.io/docker/v/nguyenson1710/wanderviet-web?label=Web&logo=docker)](https://hub.docker.com/r/nguyenson1710/wanderviet-web)

> 🌐 **[English version](./README.en.md)**

## Tổng quan

WanderViet là nền tảng du lịch full-stack được xây dựng như một dự án portfolio chất lượng production, bao gồm:

- **Web**: Next.js 16 + TypeScript + Tailwind CSS — giao diện Vietnamese-first, Traveloka-inspired
- **API**: NestJS 11 + Prisma 7 + PostgreSQL — REST API đầy đủ với Swagger docs
- **AI Service**: FastAPI + Ollama + Qdrant — chatbot local-first, không cần OpenAI API key
- **Mobile**: Flutter (cấu trúc sẵn, Riverpod + Dio)
- **DevOps**: pnpm workspaces + Turborepo + Docker Compose + GitHub Actions CI

> ⚠️ **Thanh toán demo** — Tất cả luồng thanh toán là mock/demo. Không phát sinh giao dịch thật.

## Tính năng chính

| Module        | Mô tả                                                                |
| ------------- | -------------------------------------------------------------------- |
| Auth          | Đăng ký, đăng nhập, JWT access+refresh, đổi mật khẩu, khóa tài khoản |
| Destinations  | Danh sách điểm đến, tìm kiếm, chi tiết, admin CRUD                   |
| Tours         | Tìm kiếm/lọc/sắp xếp tour, lịch trình, ngày khởi hành, admin CRUD    |
| Booking       | Đặt tour, quản lý booking, mã WV-YYYYMMDD-XXXXXX                     |
| Payment       | Mock checkout + callback (demo only)                                 |
| Reviews       | Đánh giá tour, admin duyệt/ẩn                                        |
| Wishlist      | Lưu tour và điểm đến yêu thích                                       |
| Blog          | CMS blog, DRAFT/PUBLISHED                                            |
| Contact       | Form liên hệ, admin triage                                           |
| Admin         | Dashboard tổng quan, doanh thu, top tours, quản lý tất cả modules    |
| Notifications | Thông báo in-app, đánh dấu đã đọc                                    |
| Coupons       | Mã giảm giá, PERCENT/FIXED, giới hạn sử dụng                         |
| AI Concierge  | Chatbot local (Ollama + RAG + Qdrant), không cần cloud API key       |

## Yêu cầu hệ thống

- **Node.js** 22 hoặc 24
- **pnpm** 10.33.0+
- **Docker** + Docker Compose (cho PostgreSQL, Redis, Qdrant)
- **Python** 3.12+ (cho AI service)
- **Ollama** (tùy chọn, cho chatbot local)

## Cài đặt nhanh

### 1. Clone và cài dependencies

```bash
git clone https://github.com/your-org/wanderviet.git
cd wanderviet
pnpm install
```

### 2. Cấu hình môi trường

```bash
cp .env.example .env
# Chỉnh sửa .env với các giá trị phù hợp
```

Các biến bắt buộc:

```dotenv
DATABASE_URL=postgresql://vietwander:vietwander@localhost:5432/vietwander
JWT_ACCESS_SECRET=<chuỗi ngẫu nhiên ít nhất 32 ký tự>
JWT_REFRESH_SECRET=<chuỗi ngẫu nhiên ít nhất 32 ký tự>
FRONTEND_URL=http://localhost:3000
```

### 3. Khởi động Docker services

```bash
# Khởi động PostgreSQL, Redis, Qdrant
docker compose -f infra/docker/docker-compose.yml up -d postgres redis qdrant
```

### 4. Khởi tạo database

```bash
# Chạy migrations
pnpm --filter @vietwander/db exec prisma migrate dev --schema prisma/schema.prisma

# Seed dữ liệu mẫu (12 điểm đến, 8 tour, demo users, bookings, reviews...)
pnpm seed
```

### 5. Chạy development

```bash
# Chạy tất cả services song song (web + api)
pnpm dev

# Hoặc chạy riêng lẻ:
pnpm --filter @vietwander/web dev    # http://localhost:3000
pnpm --filter @vietwander/api dev    # http://localhost:4000
```

### 6. Chạy AI Service (tùy chọn)

```bash
# Cài Ollama: https://ollama.ai
ollama pull qwen3:4b
ollama pull nomic-embed-text

# Chạy AI service
cd apps/ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8010
```

## Tài khoản demo

| Email                | Mật khẩu     | Vai trò |
| -------------------- | ------------ | ------- |
| admin@wanderviet.com | Admin@123456 | ADMIN   |
| user@wanderviet.com  | User@123456  | USER    |
| staff@wanderviet.com | Staff@123456 | STAFF   |

## API Documentation

Swagger UI: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

## Cấu trúc dự án

```
wanderviet/
├── apps/
│   ├── api/          # NestJS 11 — REST API
│   ├── web/          # Next.js 16 — Frontend
│   ├── ai-service/   # FastAPI — AI/RAG service
│   └── mobile/       # Flutter — Mobile app
├── packages/
│   ├── shared/       # Shared TypeScript types
│   ├── db/           # Prisma schema + migrations + seed
│   └── config/       # Shared configs
├── infra/docker/     # Docker Compose
├── e2e/              # Playwright E2E tests
├── load-tests/       # k6 load tests
├── docs/
│   ├── adr/          # Architecture Decision Records
│   └── er-diagram.md # Entity-Relationship diagram
├── .github/
│   ├── workflows/ci.yml  # GitHub Actions CI
│   └── renovate.json     # Renovate bot config
└── Makefile          # Shortcut commands
```

## Lệnh thường dùng

```bash
# Development
make dev              # Chạy tất cả services
make build            # Build tất cả packages
make test             # Chạy unit tests
make lint             # Lint toàn bộ codebase
make typecheck        # TypeScript type check

# Database
make migrate          # Chạy Prisma migrations
make seed             # Seed dữ liệu mẫu

# Docker
make docker-up        # Khởi động Docker services
make docker-down      # Dừng Docker services
make docker-build     # Build Docker images

# Testing
make e2e              # Chạy Playwright E2E tests
make load-test        # Chạy k6 load tests

# Storybook
pnpm storybook        # Chạy Storybook tại http://localhost:6006
```

## CI/CD

GitHub Actions CI chạy các jobs sau trên mỗi push/PR:

| Job              | Mô tả                                         |
| ---------------- | --------------------------------------------- |
| `web-api-ai`     | Lint, test, build trên Node 22 và 24 (matrix) |
| `typecheck`      | TypeScript type checking                      |
| `security-audit` | `pnpm audit --prod`                           |
| `e2e`            | Playwright E2E tests với PostgreSQL service   |
| `docker-build`   | Build Docker images (chỉ trên push to main)   |
| `mobile`         | Flutter analyze + test                        |

Renovate bot tự động tạo PR cập nhật dependencies và bật auto-merge cho minor/patch.

## Kiến trúc

Xem thêm:

- [`docs/adr/`](docs/adr/) — Architecture Decision Records
- [`docs/er-diagram.md`](docs/er-diagram.md) — Entity-Relationship diagram
- [`.kiro/specs/wanderviet-travel-platform/design.md`](.kiro/specs/wanderviet-travel-platform/design.md) — Technical design

## Lưu ý quan trọng

- **Thanh toán**: Tất cả luồng thanh toán là mock/demo. Không bao giờ lưu thông tin thẻ thật.
- **AI Chatbot**: Runtime không yêu cầu OpenAI API key. Sử dụng Ollama local.
- **Secrets**: Không commit `.env` vào git. Xem `.gitignore`.
- **Dữ liệu**: Dữ liệu tour và điểm đến là mẫu/demo. Không phản ánh thông tin thực tế.

## License

MIT

---

_WanderViet — Khám phá Việt Nam và thế giới theo cách của bạn._
