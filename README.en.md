# WanderViet Travel Platform

A full-stack, production-grade travel booking platform for Vietnam and international destinations.

[![CI](https://github.com/your-org/wanderviet/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/wanderviet/actions/workflows/ci.yml)
[![Docker API](https://img.shields.io/docker/v/nguyenson1710/wanderviet-api?label=API&logo=docker)](https://hub.docker.com/r/nguyenson1710/wanderviet-api)
[![Docker Web](https://img.shields.io/docker/v/nguyenson1710/wanderviet-web?label=Web&logo=docker)](https://hub.docker.com/r/nguyenson1710/wanderviet-web)

> 🇻🇳 **[Phiên bản Tiếng Việt](./README.md)**

## Overview

WanderViet is a portfolio-grade full-stack travel platform built with modern technologies:

- **Web**: Next.js 16 + TypeScript + Tailwind CSS — Vietnamese-first, Traveloka-inspired UI
- **API**: NestJS 11 + Prisma 7 + PostgreSQL — Full REST API with Swagger docs
- **AI Service**: FastAPI + Ollama + Qdrant — Local-first chatbot, no OpenAI API key required
- **Mobile**: Flutter (structured with Riverpod + Dio)
- **DevOps**: pnpm workspaces + Turborepo + Docker + GitHub Actions CI/CD

> ⚠️ **Demo Payment** — All payment flows are mock/demo only. No real transactions are processed.

## Key Features

| Module | Description |
|--------|-------------|
| Auth | Register, login, JWT access+refresh, password change, account lockout |
| Destinations | Browse, search, detail pages, admin CRUD |
| Tours | Search/filter/sort, itineraries, departures, admin CRUD |
| Booking | Book tours, manage bookings, code format WV-YYYYMMDD-XXXXXX |
| Payment | Mock checkout + callback (demo only) |
| Reviews | Tour reviews, admin approve/reject/hide |
| Wishlist | Save tours and destinations |
| Blog | CMS with DRAFT/PUBLISHED workflow |
| Contact | Contact form, admin triage |
| Admin | Dashboard with revenue, top tours, full module management |
| Notifications | In-app notifications, mark as read |
| Coupons | Discount codes, PERCENT/FIXED, usage limits |
| AI Concierge | Local chatbot (Ollama + RAG + Qdrant), no cloud API key needed |

## System Requirements

- **Node.js** 22 or 24
- **pnpm** 10.33.0+
- **Docker** + Docker Compose (for PostgreSQL, Redis, Qdrant)
- **Python** 3.12+ (for AI service)
- **Ollama** (optional, for local chatbot)

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/your-org/wanderviet.git
cd wanderviet
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your values
```

Required variables:
```dotenv
DATABASE_URL=postgresql://vietwander:vietwander@localhost:5432/vietwander
JWT_ACCESS_SECRET=<random string, min 32 chars>
JWT_REFRESH_SECRET=<random string, min 32 chars>
FRONTEND_URL=http://localhost:3000
```

### 3. Start Docker services

```bash
docker compose -f infra/docker/docker-compose.yml up -d postgres redis qdrant
```

### 4. Initialize database

```bash
pnpm --filter @vietwander/db exec prisma migrate dev --schema prisma/schema.prisma
pnpm seed
```

### 5. Run development

```bash
pnpm dev                              # All services (web + api)
# Or individually:
pnpm --filter @vietwander/web dev     # http://localhost:3000
pnpm --filter @vietwander/api dev     # http://localhost:4000
```

### 6. AI Service (optional)

```bash
ollama pull qwen3:4b
ollama pull nomic-embed-text

cd apps/ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8010
```

## Docker Hub Images

Pre-built images are available on Docker Hub:

```bash
docker pull nguyenson1710/wanderviet-api:latest
docker pull nguyenson1710/wanderviet-web:latest
```

Run with Docker Compose:
```bash
docker compose -f infra/docker/docker-compose.yml up -d
```

## Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@wanderviet.com | Admin@123456 | ADMIN |
| user@wanderviet.com | User@123456 | USER |
| staff@wanderviet.com | Staff@123456 | STAFF |

## API Documentation

Swagger UI: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

## Project Structure

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
├── docs/             # Architecture, ADRs, guides
└── Makefile          # Shortcut commands
```

## Common Commands

```bash
make dev              # Start all services
make build            # Build all packages
make test             # Run unit tests
make lint             # Lint entire codebase
make typecheck        # TypeScript type check
make migrate          # Run Prisma migrations
make seed             # Seed demo data
make docker-up        # Start Docker services
make docker-down      # Stop Docker services
make docker-build     # Build Docker images
make e2e              # Run Playwright E2E tests
make load-test        # Run k6 load tests
pnpm storybook        # Run Storybook at http://localhost:6006
```

## CI/CD

### Continuous Integration (on every push/PR)

| Job | Description |
|-----|-------------|
| `web-api-ai` | Lint, test, build on Node 22 and 24 (matrix) |
| `typecheck` | TypeScript type checking |
| `security-audit` | `pnpm audit --prod` |
| `e2e` | Playwright E2E tests with PostgreSQL service |
| `docker-build` | Build Docker images (push to main only) |
| `mobile` | Flutter analyze + test |

### Continuous Deployment (on version tags)

When a `v*` tag is pushed, the CD workflow automatically:
1. Builds multi-stage Docker images for API and Web
2. Pushes to Docker Hub with version tag + `latest`
3. Uses GitHub Actions cache for faster builds

Renovate bot automatically creates PRs for dependency updates with auto-merge for minor/patch.

## Architecture

See also:
- [`docs/adr/`](docs/adr/) — Architecture Decision Records
- [`docs/er-diagram.md`](docs/er-diagram.md) — Entity-Relationship diagram
- [`docs/architecture.md`](docs/architecture.md) — System overview

## Important Notes

- **Payment**: All payment flows are mock/demo only. No real card data is ever stored.
- **AI Chatbot**: Runtime does not require an OpenAI API key. Uses local Ollama.
- **Secrets**: Never commit `.env` to git. See `.gitignore`.
- **Data**: Tour and destination data is sample/demo. Does not reflect real-world information.

## License

MIT

---

*WanderViet — Explore Vietnam and the world, your way.*
