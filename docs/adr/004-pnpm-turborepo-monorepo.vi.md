# ADR-004: pnpm + Turborepo cho Monorepo Tooling

**Trạng thái:** Chấp nhận  
**Ngày:** 2025-01-01  
**Người quyết định:** Đội ngũ WanderViet Platform

---

## Bối Cảnh

Nền tảng WanderViet bao gồm nhiều ứng dụng và packages cần được phát triển, build, và test cùng nhau:

```
apps/
├── api/          # NestJS 11 (TypeScript)
├── web/          # Next.js 16 (TypeScript)
├── ai-service/   # FastAPI (Python)
└── mobile/       # Flutter (Dart)

packages/
├── shared/       # Shared TypeScript types + API contracts
├── db/           # Prisma schema + migrations + generated client
└── config/       # Shared ESLint, TypeScript, và build configs
```

Yêu cầu chính cho monorepo tooling:

1. **Shared packages** — `apps/api` và `apps/web` đều import từ `packages/shared` và `packages/db`; thay đổi shared packages phải trigger rebuild các apps phụ thuộc
2. **Builds phối hợp** — CI phải build tất cả packages theo thứ tự dependency mà không cần điều phối thủ công
3. **Cài đặt hiệu quả** — Monorepo có hàng trăm dependencies; thời gian cài đặt và dung lượng đĩa quan trọng cho CI và phát triển local
4. **Thực thi song song** — Các tasks độc lập (lint api, lint web, test api, test web) nên chạy song song
5. **Caching** — Packages không thay đổi không nên rebuild mỗi lần CI chạy

Các lựa chọn đã đánh giá: npm workspaces + Lerna, Yarn Berry (PnP), Nx, Bazel.

---

## Quyết Định

Sử dụng **pnpm workspaces** cho quản lý package và **Turborepo** cho điều phối tasks.

### pnpm Workspaces

`pnpm-workspace.yaml` định nghĩa workspace:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Mỗi package có `package.json` riêng với tên scoped (`@vietwander/api`, `@vietwander/web`, `@vietwander/shared`, `@vietwander/db`). Dependencies giữa packages sử dụng workspace protocol:

```json
{ "@vietwander/shared": "workspace:*" }
```

### Turborepo

`turbo.json` tại root định nghĩa task pipeline:

```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
    "test": { "dependsOn": ["^build"] },
    "lint": { "outputs": [] },
    "dev": { "cache": false, "persistent": true }
  }
}
```

Dependency `^build` đảm bảo `packages/shared` và `packages/db` được build trước khi `apps/api` hoặc `apps/web` cố gắng build.

---

## Hệ Quả

**Tích cực:**

- **Sử dụng đĩa hiệu quả:** Content-addressable store của pnpm deduplicate packages trên toàn monorepo; package được cài trong 10 workspaces chỉ chiếm dung lượng đĩa một lần. Tiết kiệm điển hình: 40–60% so với npm/Yarn classic
- **Cách ly dependency nghiêm ngặt:** `node_modules` non-flat của pnpm ngăn phantom dependencies (vô tình import package không được khai báo trong `package.json`)
- **Builds song song:** Turborepo chạy tasks độc lập song song tự động; `pnpm turbo run build` build `shared` → sau đó `api` và `web` song song
- **Remote caching:** Turborepo hỗ trợ remote cache (Vercel Remote Cache hoặc self-hosted) — CI hits có thể được phục vụ từ cache khi inputs không thay đổi, giảm thời gian CI từ ~5 phút xuống ~30 giây cho packages không thay đổi
- **Scoped commands:** `pnpm --filter @vietwander/api test` chạy tests chỉ cho API package; `pnpm --filter ...@vietwander/shared test` chạy tests cho shared và tất cả dependents
- **Single lockfile:** `pnpm-lock.yaml` tại root đảm bảo cài đặt deterministic trên tất cả packages

**Tiêu cực / Đánh đổi:**

- **Đường cong học tập:** Contributors chưa quen pnpm workspaces hoặc Turborepo cần học workspace-scoped commands (`pnpm --filter`, `pnpm -r`) và hiểu khái niệm task pipeline
- **Tính nghiêm ngặt pnpm:** `node_modules` non-flat đôi khi gây vấn đề với packages giả định flat structure (vd: một số Prisma plugins, một số Next.js plugins). Những trường hợp này cần `shamefully-hoist` hoặc khai báo `peerDependencies` rõ ràng
- **Cache invalidation Turborepo:** Cache keys dựa trên file hashes; thay đổi `turbo.json` hoặc root config file có thể invalidate tất cả caches
- **Python và Flutter không được quản lý bởi pnpm:** `apps/ai-service` (Python) và `apps/mobile` (Flutter) có dependency managers riêng (`pip`, `pub`). Turborepo điều phối build/test scripts của chúng qua shell commands nhưng không quản lý packages của chúng

**Giảm thiểu:**

- `Makefile` cung cấp targets đơn giản (`make dev`, `make test`, `make build`) wrap các pnpm/Turborepo commands cho contributors không muốn học chi tiết tooling
- `AGENTS.md` ghi nhận các scoped command patterns
- `.npmrc` tại root đặt `shamefully-hoist=false` rõ ràng để bắt phantom dependency issues sớm trong phát triển thay vì production

---

## Các Lựa Chọn Đã Xem Xét

| Lựa chọn               | Lý do từ chối                                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| npm workspaces + Lerna | Lerna phần lớn bị thay thế bởi Turborepo; `node_modules` flat của npm cho phép phantom dependencies; cài đặt chậm hơn |
| Yarn Berry (PnP)       | Chế độ Plug'n'Play có vấn đề tương thích với nhiều NestJS và Next.js plugins; chi phí migration cao                   |
| Nx                     | Mạnh hơn Turborepo nhưng phức tạp hơn đáng kể để cấu hình; quá mức cho quy mô dự án này                               |
| Bazel                  | Cực kỳ mạnh nhưng cần chuyên môn sâu; không phù hợp cho dự án portfolio TypeScript/Node.js                            |
| Single-package repo    | Sẽ cần trùng lặp types giữa frontend và backend; không có shared build pipeline                                       |
