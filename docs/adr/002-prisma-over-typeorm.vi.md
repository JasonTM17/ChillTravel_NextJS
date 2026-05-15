# ADR-002: Prisma thay vì TypeORM

**Trạng thái:** Chấp nhận  
**Ngày:** 2025-01-01  
**Người quyết định:** Đội ngũ WanderViet Platform

---

## Bối Cảnh

Nền tảng WanderViet cần một ORM hoạt động tốt với PostgreSQL, NestJS, và TypeScript. Hai ứng viên chính được đánh giá: **Prisma 7** và **TypeORM**.

TypeORM là ORM được ghép cặp phổ biến nhất với NestJS và có cộng đồng lớn. Tuy nhiên, nó có các điểm yếu được ghi nhận rõ:

- **Lỗ hổng type safety:** `find()` và `createQueryBuilder()` của TypeORM trả về `any` hoặc kết quả typed lỏng lẻo trong nhiều tình huống; relations được typed là `Promise<T>` nhưng có thể trả về `undefined` lặng lẽ tại runtime
- **Xử lý relation phức tạp:** Không nhất quán eager/lazy loading, vấn đề N+1 query khó phát hiện, và decorators `@OneToMany` / `@ManyToMany` cần cấu hình cẩn thận để tránh circular dependency
- **Độ tin cậy migration:** `synchronize: true` của TypeORM nguy hiểm trong production; migration generator có vấn đề đã biết với schema changes phức tạp (vd: đổi tên columns, thay đổi relation types)
- **Lo ngại bảo trì:** Nhịp phát hành TypeORM chậm đáng kể giữa 2021–2023

Prisma đã được cấu hình trong monorepo (`packages/db/prisma/schema.prisma`) khi quá trình phát triển WanderViet bắt đầu. Đội đã có kinh nghiệm trực tiếp với ưu điểm DX của nó.

---

## Quyết Định

Sử dụng **Prisma 7** với PostgreSQL làm ORM cho nền tảng WanderViet.

Cấu hình Prisma nằm trong `packages/db/`:

```
packages/db/
├── prisma/
│   ├── schema.prisma       # Nguồn sự thật duy nhất cho data model
│   ├── migrations/         # File migration có phiên bản
│   └── seed.ts             # Seeder dữ liệu demo
└── generated/
    └── client/             # Prisma Client sinh tự động
```

`PrismaService` trong `apps/api/src/common/services/prisma.service.ts` extends `PrismaClient` và được cung cấp dưới dạng singleton qua `PrismaModule`.

---

## Hệ Quả

**Tích cực:**

- **Schema-first approach:** `schema.prisma` là nguồn sự thật duy nhất; client sinh ra luôn đồng bộ với database schema
- **Full type safety:** Mọi kết quả query được typed chính xác — `prisma.tour.findMany({ include: { images: true } })` trả về `(Tour & { images: TourImage[] })[]` không cần casting
- **Client sinh tự động:** `prisma generate` tạo client fully typed; không cần repository classes thủ công
- **DX xuất sắc:** Prisma Studio cho duyệt dữ liệu trực quan, migration diffs rõ ràng, cú pháp schema dễ đọc
- **Migrations đáng tin cậy:** `prisma migrate dev` sinh SQL migration files được version-control và deterministic; `prisma migrate deploy` an toàn cho production
- **Xử lý relation:** `include` và `select` của Prisma rõ ràng và dự đoán được; không có lazy-loading ẩn bất ngờ

**Tiêu cực / Đánh đổi:**

- **Linh hoạt query:** API query của Prisma kém linh hoạt hơn raw SQL cho aggregations phức tạp (vd: window functions, CTEs, GROUP BY phức tạp). Các query revenue dashboard sử dụng `$queryRaw` cho những trường hợp này
- **Không có active record pattern:** Prisma models là plain data objects, không phải active record instances — một số developers thích entity-method pattern của TypeORM
- **Bundle size:** Prisma Client sinh ra thêm ~2–5 MB vào API bundle (chấp nhận được cho ứng dụng server-side)
- **Schema coupling:** Tất cả apps trong monorepo cần DB access phải reference `packages/db/generated/client`; đây là lựa chọn kiến trúc có chủ đích (single schema, single client)

**Giảm thiểu:**

- Các query aggregation phức tạp sử dụng `prisma.$queryRaw` với tagged template literals (an toàn SQL injection qua parameterization)
- Package `packages/db` export Prisma Client để tất cả consumers chia sẻ cùng generated types

---

## Các Lựa Chọn Đã Xem Xét

| Lựa chọn                 | Lý do từ chối                                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| TypeORM                  | Lỗ hổng type safety đã biết; vấn đề relation phức tạp; độ tin cậy migration thấp hơn           |
| Drizzle ORM              | Type safety xuất sắc nhưng hệ sinh thái ít trưởng thành; không có Prisma Studio; đội chưa quen |
| MikroORM                 | Lựa chọn tốt nhưng đội đã cấu hình Prisma; chi phí migration không hợp lý                      |
| Raw SQL (pg/postgres.js) | Linh hoạt tối đa nhưng cần type definitions thủ công cho mọi query; quá nhiều boilerplate      |
| Sequelize                | API cũ; hỗ trợ TypeScript được gắn thêm; DX kém hơn Prisma                                     |
