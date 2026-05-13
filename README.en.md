<p align="center">
  <h1 align="center">WanderViet — Vietnam Travel Platform</h1>
  <p align="center">
    <em>Full-stack travel platform built with modern monorepo architecture</em>
  </p>
</p>

<p align="center">
  <a href="https://github.com/nguyenson1710/wanderviet/actions/workflows/ci.yml">
    <img src="https://github.com/nguyenson1710/wanderviet/actions/workflows/ci.yml/badge.svg" alt="CI" />
  </a>
  <a href="https://hub.docker.com/r/nguyenson1710/wanderviet-api">
    <img src="https://img.shields.io/docker/v/nguyenson1710/wanderviet-api?label=API%20Image&logo=docker" alt="Docker API" />
  </a>
  <a href="https://hub.docker.com/r/nguyenson1710/wanderviet-web">
    <img src="https://img.shields.io/docker/v/nguyenson1710/wanderviet-web?label=Web%20Image&logo=docker" alt="Docker Web" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
  </a>
</p>

<p align="center">
  <a href="./README.md">Tieng Viet</a> |
  <a href="#quick-start">Quick Start</a> |
  <a href="#documentation">Docs</a> |
  <a href="#api-documentation">API Docs</a>
</p>

---

## Introduction

**WanderViet** is a comprehensive travel platform for the Vietnamese market, enabling users to search and book tours, hotels, and flights. The system integrates an AI chatbot for travel consultation powered by a fully local language model (no cloud API dependency).

### Key Features

- Tour, hotel, and flight booking with demo payment system
- AI Travel Assistant — travel consultation chatbot (Ollama + RAG)
- Admin Dashboard with analytics and booking management
- JWT authentication (15-min access token + 7-day refresh token)
- Flutter cross-platform mobile app
- E2E testing (Playwright) + Load testing (k6)
- Docker Compose — spin up the entire system with a single command

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js + TypeScript + Tailwind CSS | 16.x |
| **Backend** | NestJS + TypeScript | 11.x |
| **Database** | PostgreSQL + Prisma ORM | 18 / 7.x |
| **AI Service** | FastAPI + Ollama + Qdrant | Python 3.12+ |
| **Mobile** | Flutter + Dart | Latest |
| **Monorepo** | pnpm Workspaces + Turborepo | 10.x / 2.x |
| **Testing** | Vitest + Playwright + k6 | Latest |
| **CI/CD** | GitHub Actions + Docker | — |
| **Cache** | Redis | 7.x |

---

## Architecture

```
wanderviet/
├── apps/
│   ├── api/            # NestJS 11 — REST API, Swagger at /api/docs
│   ├── web/            # Next.js 16 — Vietnamese-first frontend
│   ├── ai-service/     # FastAPI — Local RAG (Ollama + Qdrant)
│   └── mobile/         # Flutter — Mobile app
├── packages/
│   ├── shared/         # Shared TypeScript types & API contracts
│   ├── db/             # Prisma schema, migrations, seed data
│   └── config/         # Shared ESLint, TypeScript, build configs
├── infra/docker/       # Docker Compose (postgres, redis, qdrant, api, web, ai)
├── e2e/                # Playwright end-to-end tests
├── load-tests/         # k6 load test scripts
└── docs/               # ADRs, ER diagram, architecture notes
```

```mermaid
graph TB
    subgraph Frontend
        Web[Next.js 16<br/>:3000]
        Mobile[Flutter App]
    end
    subgraph Backend
        API[NestJS 11 API<br/>:4000]
        AI[FastAPI AI Service<br/>:8010]
    end
    subgraph Data
        PG[(PostgreSQL 18<br/>:5432)]
        Redis[(Redis<br/>:6379)]
        Qdrant[(Qdrant<br/>:6333)]
    end
    subgraph AI_Runtime
        Ollama[Ollama LLM<br/>:11434]
    end

    Web --> API
    Mobile --> API
    API --> PG
    API --> Redis
    API --> AI
    AI --> Ollama
    AI --> Qdrant
```

---

## Prerequisites

| Software | Minimum Version |
|----------|----------------|
| Node.js | >= 22.x |
| pnpm | >= 10.x |
| Docker & Docker Compose | Latest |
| PostgreSQL | 18 (via Docker) |
| Python | >= 3.12 (for AI service) |

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/nguyenson1710/wanderviet.git
cd wanderviet
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your database credentials and configuration
```

### 4. Start infrastructure (Docker)

```bash
docker compose -f infra/docker/docker-compose.yml up -d
```

### 5. Run database migrations & seed

```bash
pnpm --filter @vietwander/db prisma migrate dev
pnpm seed
```

### 6. Start development servers

```bash
pnpm dev
```

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| API | http://localhost:4000/api/v1 |
| Swagger | http://localhost:4000/api/docs |
| AI Service | http://localhost:8010 |

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@wanderviet.com` | `Admin@123456` |
| User | `user@wanderviet.com` | `User@123456` |

> **Note:** The payment system is mock/demo only — no real transactions are processed.

---

## API Documentation

API documentation is auto-generated using Swagger/OpenAPI:

- **Swagger UI:** http://localhost:4000/api/docs
- **OpenAPI JSON:** http://localhost:4000/api/docs-json

---

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](./docs/architecture.md) | System architecture overview |
| [ADRs](./docs/adr/) | Architecture Decision Records |
| [ER Diagram](./docs/er-diagram.md) | Entity-Relationship diagram |
| [Contributing](./CONTRIBUTING.md) | Contribution guidelines |
| [Changelog](./CHANGELOG.md) | Change history |
| [Release Checklist](./docs/release-checklist.md) | Release process |

---

## License

This project is distributed under the [MIT](./LICENSE) license.

Copyright (c) 2025 [Nguyen Son](https://github.com/nguyenson1710)
