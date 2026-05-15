# Đóng Góp cho WanderViet

Cảm ơn bạn đã quan tâm đến việc đóng góp cho WanderViet! Hướng dẫn này sẽ giúp bạn bắt đầu.

## Cài Đặt Môi Trường Phát Triển

1. **Clone repository**

   ```bash
   git clone https://github.com/JasonTM17/ChillTravel_NextJS.git
   cd ChillTravel_NextJS
   ```

2. **Cài đặt dependencies**

   ```bash
   pnpm install
   ```

3. **Thiết lập biến môi trường**

   ```bash
   cp .env.example .env
   ```

   Chỉnh sửa `.env` với cấu hình local của bạn.

4. **Khởi động dịch vụ hạ tầng**

   ```bash
   docker compose up -d postgres redis qdrant ollama
   ```

5. **Chạy migration và seed dữ liệu**

   ```bash
   pnpm --filter @vietwander/db prisma migrate dev
   pnpm --filter @vietwander/db seed
   ```

6. **Khởi động server phát triển**

   ```bash
   pnpm dev
   ```

## Quy Tắc Đặt Tên Branch

Sử dụng các tiền tố sau cho tên branch:

| Tiền tố  | Mục đích                       |
| -------- | ------------------------------ |
| `feat/`  | Tính năng mới                  |
| `fix/`   | Sửa lỗi                        |
| `docs/`  | Thay đổi tài liệu              |
| `chore/` | Bảo trì, công cụ, tái cấu trúc |

Ví dụ:

- `feat/tour-search-filters`
- `fix/booking-date-validation`
- `docs/update-architecture-diagram`
- `chore/upgrade-nestjs-11`

## Commit Messages

Dự án sử dụng định dạng [Conventional Commits](https://www.conventionalcommits.org/). Commit messages được kiểm tra bởi commitlint thông qua Husky hooks.

### Định dạng

```
<type>(<scope>): <mô tả>

[nội dung tùy chọn]

[footer tùy chọn]
```

### Các loại type

| Type       | Mô tả                                    |
| ---------- | ---------------------------------------- |
| `feat`     | Tính năng mới                            |
| `fix`      | Sửa lỗi                                  |
| `docs`     | Chỉ thay đổi tài liệu                    |
| `style`    | Định dạng, thiếu dấu chấm phẩy           |
| `refactor` | Thay đổi code không phải fix hay feature |
| `test`     | Thêm hoặc cập nhật tests                 |
| `chore`    | Thay đổi build process hoặc công cụ      |
| `perf`     | Cải thiện hiệu suất                      |
| `ci`       | Thay đổi cấu hình CI/CD                  |

### Ví dụ

```
feat(api): thêm endpoint tìm kiếm tour
fix(web): sửa locale date picker
docs: cập nhật sơ đồ kiến trúc
refactor(api): tách logic validation booking
test(api): thêm unit tests cho coupon service
chore: nâng cấp turborepo lên v2
```

## Code Style

Code style được áp dụng tự động:

- **ESLint** — linting cho TypeScript/JavaScript
- **Prettier** — định dạng code
- **lint-staged** — chạy linters trên staged files trước khi commit

Các công cụ này chạy tự động qua Husky pre-commit hooks. Để chạy thủ công:

```bash
pnpm lint        # Chạy ESLint trên tất cả packages
pnpm format      # Chạy Prettier formatting
```

## Yêu Cầu Testing

Trước khi gửi pull request, đảm bảo tất cả checks pass:

```bash
pnpm lint && pnpm test && pnpm build
```

- Tất cả tests hiện có phải tiếp tục pass
- Tính năng mới nên có tests tương ứng
- Sửa lỗi nên có regression test khi có thể

## Quy Trình Pull Request

1. Tạo feature branch từ `main` theo quy tắc đặt tên ở trên
2. Thực hiện thay đổi với các commit rõ ràng, atomic theo Conventional Commits
3. Đảm bảo tất cả checks pass: `pnpm lint && pnpm test && pnpm build`
4. Push branch và mở Pull Request sử dụng PR template
5. Điền đầy đủ PR template (tóm tắt, loại thay đổi, checklist)
6. Yêu cầu review từ maintainer
7. Xử lý feedback từ review
8. PRs được merge qua **squash merge** để giữ history sạch

## Cấu Trúc Dự Án

```
wanderviet/
├── apps/
│   ├── api/          # NestJS 11 REST API
│   ├── web/          # Next.js 16 frontend
│   ├── mobile/       # Flutter mobile app
│   └── ai-service/   # FastAPI AI service (Ollama + Qdrant)
├── packages/
│   ├── shared/       # Shared TypeScript types và contracts
│   ├── db/           # Prisma schema, migrations, seed data
│   └── config/       # Shared ESLint, TypeScript configs
├── e2e/              # Playwright end-to-end tests
├── scripts/          # Utility và automation scripts
├── docs/             # Architecture docs và ADRs
└── infra/docker/docker-compose.yml
```

Mỗi `apps/*` package là một service có thể deploy. Mỗi `packages/*` package là thư viện dùng chung bởi các apps. Turborepo điều phối builds, tests, và linting trên toàn bộ monorepo.
