# Architecture Overview

> For the full technical design, see [`.kiro/specs/wanderviet-travel-platform/design.md`](../.kiro/specs/wanderviet-travel-platform/design.md).
> For Architecture Decision Records, see [`docs/adr/`](./adr/).
> For the Entity-Relationship diagram, see [`docs/er-diagram.md`](./er-diagram.md).

## System Context

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Next.js 16     │────▶│  NestJS 11 API   │────▶│  PostgreSQL 18   │
│  apps/web       │     │  apps/api        │     │  (Prisma 7 ORM)  │
│  :3000          │     │  :4000 /api/v1   │     │  :5432           │
└─────────────────┘     └──────────────────┘     └──────────────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │  FastAPI AI      │
                        │  apps/ai-service │
                        │  :8010           │
                        └──────────────────┘
```

## Monorepo Layout

```
wanderviet/
├── apps/
│   ├── api/          # NestJS 11 — REST API, Swagger at /api/docs
│   ├── web/          # Next.js 16 — Vietnamese-first frontend
│   ├── ai-service/   # FastAPI — local RAG (Ollama + Qdrant, no cloud key)
│   └── mobile/       # Flutter — mobile app structure
├── packages/
│   ├── shared/       # Shared TypeScript types and API contracts
│   ├── db/           # Prisma schema, migrations, seed data
│   └── config/       # Shared ESLint, TypeScript, build configs
├── infra/docker/     # Docker Compose (postgres, redis, qdrant, api, web, ai)
├── e2e/              # Playwright end-to-end tests
├── load-tests/       # k6 load test scripts
└── docs/             # ADRs, ER diagram, architecture notes
```

## Key Decisions

| Concern           | Choice                          | ADR                                             |
| ----------------- | ------------------------------- | ----------------------------------------------- |
| Backend framework | NestJS 11 (TypeScript)          | [ADR-001](./adr/001-nestjs-over-spring-boot.md) |
| ORM               | Prisma 7                        | [ADR-002](./adr/002-prisma-over-typeorm.md)     |
| Payment           | Mock-only                       | [ADR-003](./adr/003-mock-payment-only.md)       |
| Monorepo tooling  | pnpm + Turborepo                | [ADR-004](./adr/004-pnpm-turborepo-monorepo.md) |
| Auth              | JWT access (15m) + refresh (7d) | design.md §4                                    |
| AI runtime        | Ollama + Qdrant, no OpenAI key  | design.md §17                                   |
