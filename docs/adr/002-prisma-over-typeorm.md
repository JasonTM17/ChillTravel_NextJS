# ADR-002: Prisma over TypeORM

**Status:** Accepted  
**Date:** 2025-01-01  
**Deciders:** WanderViet Platform Team

---

## Context

The WanderViet platform requires an ORM that works well with PostgreSQL, NestJS, and TypeScript. Two primary candidates were evaluated: **Prisma 7** and **TypeORM**.

TypeORM is the most commonly paired ORM with NestJS and has a large community. However, it has well-documented pain points:

- **Type safety gaps:** TypeORM's `find()` and `createQueryBuilder()` return `any` or loosely typed results in many scenarios; relations are typed as `Promise<T>` but can silently return `undefined` at runtime
- **Complex relation handling:** Eager/lazy loading inconsistencies, N+1 query problems that are hard to detect, and `@OneToMany` / `@ManyToMany` decorators that require careful configuration to avoid circular dependency issues
- **Migration reliability:** TypeORM's `synchronize: true` is dangerous in production; its migration generator has known issues with complex schema changes (e.g., renaming columns, changing relation types)
- **Active maintenance concerns:** TypeORM's release cadence slowed significantly between 2021–2023

Prisma was already configured in the monorepo (`packages/db/prisma/schema.prisma`) when the WanderViet evolution began. The team had direct experience with its DX advantages.

---

## Decision

Use **Prisma 7** with PostgreSQL as the ORM for the WanderViet platform.

The Prisma setup lives in `packages/db/`:

```
packages/db/
├── prisma/
│   ├── schema.prisma       # Single source of truth for the data model
│   ├── migrations/         # Versioned migration files
│   └── seed.ts             # Demo data seeder
└── generated/
    └── client/             # Auto-generated Prisma Client
```

The `PrismaService` in `apps/api/src/common/services/prisma.service.ts` extends `PrismaClient` and is provided as a singleton via `PrismaModule`.

---

## Consequences

**Positive:**

- **Schema-first approach:** `schema.prisma` is the single source of truth; the generated client is always in sync with the database schema
- **Full type safety:** Every query result is precisely typed — `prisma.tour.findMany({ include: { images: true } })` returns `(Tour & { images: TourImage[] })[]` with no casting required
- **Auto-generated client:** `prisma generate` produces a fully typed client; no manual repository classes needed
- **Excellent DX:** Prisma Studio for visual data browsing, clear migration diffs, readable schema syntax
- **Reliable migrations:** `prisma migrate dev` generates SQL migration files that are version-controlled and deterministic; `prisma migrate deploy` is safe for production
- **Relation handling:** Prisma's `include` and `select` are explicit and predictable; no hidden lazy-loading surprises

**Negative / Trade-offs:**

- **Query flexibility:** Prisma's query API is less flexible than raw SQL for complex aggregations (e.g., window functions, CTEs, complex GROUP BY). The dashboard revenue queries use `$queryRaw` for these cases
- **No active record pattern:** Prisma models are plain data objects, not active record instances — some developers prefer TypeORM's entity-method pattern
- **Bundle size:** The generated Prisma Client adds ~2–5 MB to the API bundle (acceptable for a server-side application)
- **Schema coupling:** All apps in the monorepo that need DB access must reference `packages/db/generated/client`; this is a deliberate architectural choice (single schema, single client)

**Mitigation:**

- Complex aggregation queries use `prisma.$queryRaw` with tagged template literals (SQL injection safe via parameterization)
- The `packages/db` package exports the Prisma Client so all consumers share the same generated types

---

## Alternatives Considered

| Option                   | Reason Rejected                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| TypeORM                  | Known type safety gaps; complex relation issues; slower migration reliability                  |
| Drizzle ORM              | Excellent type safety but less mature ecosystem; no Prisma Studio equivalent; team unfamiliar  |
| MikroORM                 | Good alternative but team already had Prisma configured; migration cost not justified          |
| Raw SQL (pg/postgres.js) | Maximum flexibility but requires manual type definitions for every query; too much boilerplate |
| Sequelize                | Older API; TypeScript support is bolted on; inferior DX compared to Prisma                     |
