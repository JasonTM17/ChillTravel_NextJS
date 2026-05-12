# ADR-001: NestJS over Spring Boot

**Status:** Accepted  
**Date:** 2025-01-01  
**Deciders:** WanderViet Platform Team

---

## Context

The WanderViet platform is built as a TypeScript monorepo managed with pnpm workspaces and Turborepo. The frontend (`apps/web`) is Next.js 16, the mobile client is Flutter, and the AI service is FastAPI (Python). The backend API (`apps/api`) needs a framework that fits this ecosystem.

Spring Boot was considered as an alternative because of its maturity, rich enterprise ecosystem, and widespread adoption in Vietnamese enterprise environments. However, adopting Spring Boot would require:

- Introducing Java or Kotlin as a second primary language in the monorepo
- A separate build toolchain (Maven or Gradle) that does not integrate with Turborepo task orchestration
- Duplicating type definitions that are already shared via `packages/shared` (TypeScript)
- A steeper onboarding curve for contributors who are already proficient in TypeScript

The team's existing expertise is TypeScript-first. The monorepo already has `packages/shared` exporting domain types, enums, and API contracts consumed by both the Next.js frontend and the NestJS backend.

---

## Decision

Keep **NestJS 11** as the backend framework for `apps/api`.

NestJS provides:

- A decorator-based, opinionated structure (modules, controllers, services, guards, interceptors) that maps cleanly to the domain model
- First-class TypeScript support with no transpilation friction
- Native integration with `@nestjs/swagger` (already configured at `/api/docs`)
- `@nestjs/jwt`, `@nestjs/passport`, `@nestjs/throttler`, `@nestjs/terminus`, `@nestjs/schedule` — all production-grade, maintained by the NestJS team
- Vitest compatibility for fast unit and integration tests

---

## Consequences

**Positive:**

- Shared types between frontend and backend via `packages/shared` — a single source of truth for DTOs, enums, and API contracts
- Single language (TypeScript) across the entire stack (Next.js, NestJS, shared packages), reducing context switching
- Turborepo can orchestrate `build`, `lint`, `test` tasks across all packages uniformly
- Faster iteration: no JVM warm-up, no separate build step, hot-reload via `ts-node-dev`
- Lower barrier to contribution for TypeScript developers

**Negative / Trade-offs:**

- NestJS is less mature than Spring Boot for large-scale enterprise patterns (e.g., complex transaction management, JPA-level ORM features)
- The Node.js runtime is single-threaded; CPU-bound workloads require worker threads or offloading to the Python AI service
- Spring Boot's ecosystem (Spring Security, Spring Data) has decades of battle-tested patterns; NestJS equivalents are younger

**Mitigation:**

- Prisma handles data access with full type safety, compensating for the lack of JPA
- CPU-bound AI/ML work is delegated to `apps/ai-service` (FastAPI + Python)
- The `IPaymentService`, `IEmailService`, and `IUploadService` interfaces ensure the service layer remains swappable if a Java microservice is introduced later

---

## Alternatives Considered

| Option               | Reason Rejected                                                                       |
| -------------------- | ------------------------------------------------------------------------------------- |
| Spring Boot (Java)   | Requires Java/Kotlin expertise; breaks TypeScript monorepo; separate build toolchain  |
| Spring Boot (Kotlin) | Slightly better DX than Java but still requires JVM; same toolchain problem           |
| Express.js (bare)    | No structure; would require building guards, interceptors, DI from scratch            |
| Fastify              | Good performance but lacks NestJS's opinionated module system and decorator ecosystem |
| Hono                 | Too minimal for a production-grade platform with 60+ endpoints                        |
