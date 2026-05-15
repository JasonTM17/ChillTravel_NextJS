# Checklist Phát Hành

Chạy các bước kiểm tra sau trước khi tag release hoặc merge vào `main`.

## Chất Lượng Code

```bash
pnpm lint          # Type-check TypeScript trên tất cả packages
pnpm typecheck     # Chạy tsc --noEmit riêng
pnpm test          # Unit tests (147 tests trên api/web/shared)
pnpm build         # Build production đầy đủ
```

## Hạ Tầng

```bash
pnpm docker:config                    # Kiểm tra cú pháp docker-compose.yml
make docker-build                     # Xác nhận multi-stage Dockerfiles build được
pnpm ai:test                          # Unit tests dịch vụ AI Python
```

## End-to-End

```bash
# Yêu cầu postgres đang chạy (make docker-up trước)
make e2e           # Playwright E2E suite
```

## Kiểm Tra Thủ Công

- [ ] `http://localhost:3001` — trang chủ load, hiển thị điểm đến
- [ ] `http://localhost:3001/tours` — danh sách tour với bộ lọc hoạt động
- [ ] `http://localhost:3001/login` — đăng nhập với `user@wanderviet.com / User@123456`
- [ ] `http://localhost:3001/admin` — bảng admin load với `admin@wanderviet.com / Admin@123456`
- [ ] `http://localhost:4000/api/docs` — Swagger UI truy cập được
- [ ] `http://localhost:4000/health` — health check trả về `{ status: "ok" }`
- [ ] Banner thanh toán hiển thị trên trang booking: **"Thanh toán demo — không phát sinh giao dịch thật"**
- [ ] Không lưu dữ liệu thẻ thật, không xử lý giao dịch thật

## Bảo Mật

```bash
pnpm audit --prod  # Không có lỗ hổng high/critical
```

## Trước Khi Commit

- [ ] Không commit file `.env` (chỉ `.env.example`)
- [ ] Không stage `node_modules`, `dist`, `.next`, hoặc artifacts sinh tự động
- [ ] Không có secrets, API keys, hoặc credentials thật trong code
- [ ] Commit message theo định dạng Conventional Commits
