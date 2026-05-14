# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2026-05-14

### Fixed

- Explore search grid jumps from 1 to 5 columns — added `sm:grid-cols-2` intermediate breakpoint
- FilterRail not collapsible on mobile — added toggle with chevron indicator
- Booking form submit button hidden on mobile — added fixed CTA bar
- Hotel gallery modal missing scroll lock and keyboard navigation
- 482 invalid Tailwind `[tv-*]` arbitrary value classes replaced with proper utility tokens
- Mobile bottom nav overlapping page content (added `pb-16` wrapper)
- Tour detail missing mobile booking CTA bar
- Hotel detail mobile bar z-index and positioning
- Hero search grid tablet breakpoint (added `sm:grid-cols-2`)
- Image loading failures — added `onError` fallback to all `<img>` tags

### Added

- `docs/FEATURES.md` — comprehensive feature documentation
- Screenshot capture script (`scripts/capture-screenshots.mjs`)
- 6 new screenshots: tour-detail, explore-search, hotel-detail, ai-planner, admin-dashboard, booking-flow
- Focus trap and `aria-modal` to hotel photo gallery fullscreen
- Keyboard navigation (Escape, Arrow keys) in gallery modal

### Changed

- README.md rewritten with expanded UI showcase (9 screenshots), tech highlights, project scale
- README.en.md mirrored with English content
- Repository URL updated from `ChillTravel_NextJS` to `wanderviet`

## [0.2.0] - 2026-05-13

### Fixed

- Path traversal vulnerability in upload service (`deleteImage`)
- JWT refresh secret falling back to hardcoded value — now uses `getOrThrow`
- Auth service test mock updated for `getOrThrow`

### Added

- Rate limiting on AI controller (`@Throttle` 10 req/min)
- Docker health checks for all services (postgres, redis, qdrant, api, web, ai)
- AI service Docker image build in CD pipeline
- `pnpm prune --prod` in API Dockerfile for smaller images
- Non-root user in all Docker containers

### Changed

- Docker Compose credentials moved to environment variables
- Redis configured with authentication
- GitHub Actions CD uses repository variables for Docker Hub username
- Brand rename: ChillTravel → WanderViet across all services
- Mobile package renamed from `chilltravel` to `wanderviet`
- Smoke test assertions updated for WanderViet branding

## [0.1.0] - 2026-01-01

### Added

- NestJS 11 REST API with Swagger documentation
- Next.js 16 frontend with Vietnamese-first UX
- FastAPI AI service with Ollama + Qdrant RAG pipeline
- Flutter mobile app structure
- Prisma 7 database schema with PostgreSQL 18
- Docker Compose multi-service setup
- Playwright E2E test suite
- k6 load testing scripts
- CI/CD pipelines (GitHub Actions)
- Monorepo with pnpm workspaces + Turborepo
- Mock payment system (no real transactions)
- JWT authentication (access + refresh tokens)
- Tour, hotel, and flight booking modules
- Admin dashboard with analytics
- AI travel assistant chatbot (local-only)
- Architecture Decision Records (4 ADRs)
- Contributing guide with branch/commit conventions
- GitHub issue and PR templates
