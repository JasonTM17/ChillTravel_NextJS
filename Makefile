# ==============================================================================
# WanderViet — Development Makefile
# One-command bootstrap and common dev tasks for the monorepo.
# ==============================================================================

SHELL := /bin/bash
.DEFAULT_GOAL := help

# ─── Configuration ────────────────────────────────────────────────────────────
REQUIRED_NODE_MAJOR := 22
REQUIRED_PNPM_MAJOR := 10
REQUIRED_PNPM_MINOR := 33

DOCKER_COMPOSE := docker compose -f infra/docker/docker-compose.yml
DOCKER_SERVICES := postgres redis qdrant

API_PORT := 4000
WEB_PORT := 3000
AI_PORT := 8010
DB_PORT := 5433

# ─── Colors ───────────────────────────────────────────────────────────────────
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
CYAN   := \033[0;36m
RESET  := \033[0m

# ==============================================================================
# TARGETS
# ==============================================================================

.PHONY: help bootstrap dev test lint build clean check-node check-pnpm check-docker check-ports

## help: Show this help message
help:
	@echo ""
	@echo "$(CYAN)WanderViet Development Commands$(RESET)"
	@echo "================================"
	@echo ""
	@grep -E '^## ' $(MAKEFILE_LIST) | sed 's/## /  /' | sort
	@echo ""

## bootstrap: Full project setup (run once after clone)
bootstrap: check-node check-pnpm check-docker check-ports
	@echo "$(GREEN)▶ Installing dependencies...$(RESET)"
	pnpm install --frozen-lockfile || pnpm install
	@echo ""
	@echo "$(GREEN)▶ Setting up environment...$(RESET)"
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "  Created .env from .env.example"; \
	else \
		echo "  .env already exists — skipping"; \
	fi
	@echo ""
	@echo "$(GREEN)▶ Starting Docker services ($(DOCKER_SERVICES))...$(RESET)"
	$(DOCKER_COMPOSE) up -d $(DOCKER_SERVICES)
	@echo "  Waiting for PostgreSQL to be healthy..."
	@timeout=30; while [ $$timeout -gt 0 ]; do \
		if $(DOCKER_COMPOSE) exec -T postgres pg_isready -U vietwander > /dev/null 2>&1; then \
			break; \
		fi; \
		sleep 1; \
		timeout=$$((timeout - 1)); \
	done; \
	if [ $$timeout -eq 0 ]; then \
		echo "$(RED)✗ ERR_MIGRATION_FAILED: PostgreSQL did not become ready in 30s$(RESET)"; \
		echo "  → Check Docker logs: $(DOCKER_COMPOSE) logs postgres"; \
		exit 1; \
	fi
	@echo ""
	@echo "$(GREEN)▶ Running database migrations...$(RESET)"
	pnpm --filter @vietwander/db exec prisma migrate dev --skip-generate 2>/dev/null || \
	pnpm --filter @vietwander/db exec prisma migrate deploy || \
		(echo "$(RED)✗ ERR_MIGRATION_FAILED: Prisma migrate failed$(RESET)" && \
		 echo "  → Verify DATABASE_URL in .env points to running PostgreSQL" && \
		 echo "  → Check: $(DOCKER_COMPOSE) logs postgres" && \
		 exit 1)
	@echo ""
	@echo "$(GREEN)▶ Seeding database...$(RESET)"
	pnpm seed || echo "$(YELLOW)⚠ Seed skipped or failed (non-blocking)$(RESET)"
	@echo ""
	@echo "$(GREEN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(RESET)"
	@echo "$(GREEN)✓ Bootstrap complete!$(RESET)"
	@echo ""
	@echo "  $(CYAN)Dev URLs:$(RESET)"
	@echo "    Web:      http://localhost:$(WEB_PORT)"
	@echo "    API:      http://localhost:$(API_PORT)"
	@echo "    AI:       http://localhost:$(AI_PORT)"
	@echo "    Postgres: localhost:$(DB_PORT)"
	@echo "    Redis:    localhost:6379"
	@echo "    Qdrant:   http://localhost:6333"
	@echo ""
	@echo "  $(CYAN)Next steps:$(RESET)"
	@echo "    make dev    — Start all services in dev mode"
	@echo "    make test   — Run test suite"
	@echo "    make lint   — Lint and typecheck"
	@echo "$(GREEN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(RESET)"

## dev: Start all services in development mode
dev: check-docker
	@echo "$(GREEN)▶ Starting Docker services...$(RESET)"
	$(DOCKER_COMPOSE) up -d $(DOCKER_SERVICES)
	@echo "$(GREEN)▶ Starting dev servers (API + Web + AI)...$(RESET)"
	pnpm dev

## test: Run all tests
test:
	@echo "$(GREEN)▶ Running tests...$(RESET)"
	pnpm test

## lint: Run linting and type checking
lint:
	@echo "$(GREEN)▶ Linting...$(RESET)"
	pnpm lint
	@echo "$(GREEN)▶ Type checking...$(RESET)"
	pnpm typecheck

## build: Build all workspaces
build:
	@echo "$(GREEN)▶ Building all workspaces...$(RESET)"
	pnpm build

## clean: Remove build artifacts, node_modules, and Docker volumes
clean:
	@echo "$(YELLOW)▶ Cleaning build artifacts...$(RESET)"
	rm -rf apps/api/dist apps/web/.next packages/*/dist
	rm -rf node_modules apps/*/node_modules packages/*/node_modules
	rm -rf .turbo apps/*/.turbo packages/*/.turbo
	rm -rf coverage apps/*/coverage
	@echo "$(YELLOW)▶ Stopping Docker services...$(RESET)"
	$(DOCKER_COMPOSE) down -v 2>/dev/null || true
	@echo "$(GREEN)✓ Clean complete$(RESET)"

# ─── Prerequisite Checks ─────────────────────────────────────────────────────

check-node:
	@NODE_VERSION=$$(node --version 2>/dev/null | sed 's/v//'); \
	if [ -z "$$NODE_VERSION" ]; then \
		echo "$(RED)✗ ERR_NODE_VERSION: Node.js is not installed$(RESET)"; \
		echo "  → Install Node.js >= $(REQUIRED_NODE_MAJOR) via nvm:"; \
		echo "    nvm install $(REQUIRED_NODE_MAJOR)"; \
		exit 1; \
	fi; \
	NODE_MAJOR=$$(echo "$$NODE_VERSION" | cut -d. -f1); \
	if [ "$$NODE_MAJOR" -lt "$(REQUIRED_NODE_MAJOR)" ]; then \
		echo "$(RED)✗ ERR_NODE_VERSION: Node.js $$NODE_VERSION found, need >= $(REQUIRED_NODE_MAJOR)$(RESET)"; \
		echo "  → Upgrade Node.js:"; \
		echo "    nvm install $(REQUIRED_NODE_MAJOR) && nvm use $(REQUIRED_NODE_MAJOR)"; \
		exit 1; \
	fi; \
	echo "  ✓ Node.js $$NODE_VERSION"

check-pnpm:
	@PNPM_VERSION=$$(pnpm --version 2>/dev/null); \
	if [ -z "$$PNPM_VERSION" ]; then \
		echo "$(RED)✗ ERR_PNPM_VERSION: pnpm is not installed$(RESET)"; \
		echo "  → Install pnpm:"; \
		echo "    corepack enable && corepack prepare pnpm@$(REQUIRED_PNPM_MAJOR).$(REQUIRED_PNPM_MINOR).0 --activate"; \
		exit 1; \
	fi; \
	PNPM_MAJOR=$$(echo "$$PNPM_VERSION" | cut -d. -f1); \
	PNPM_MINOR=$$(echo "$$PNPM_VERSION" | cut -d. -f2); \
	if [ "$$PNPM_MAJOR" -lt "$(REQUIRED_PNPM_MAJOR)" ] || \
	   ([ "$$PNPM_MAJOR" -eq "$(REQUIRED_PNPM_MAJOR)" ] && [ "$$PNPM_MINOR" -lt "$(REQUIRED_PNPM_MINOR)" ]); then \
		echo "$(RED)✗ ERR_PNPM_VERSION: pnpm $$PNPM_VERSION found, need >= $(REQUIRED_PNPM_MAJOR).$(REQUIRED_PNPM_MINOR).0$(RESET)"; \
		echo "  → Upgrade pnpm:"; \
		echo "    corepack prepare pnpm@$(REQUIRED_PNPM_MAJOR).$(REQUIRED_PNPM_MINOR).0 --activate"; \
		exit 1; \
	fi; \
	echo "  ✓ pnpm $$PNPM_VERSION"

check-docker:
	@if ! docker info > /dev/null 2>&1; then \
		echo "$(RED)✗ ERR_DOCKER_NOT_RUNNING: Docker daemon is not running$(RESET)"; \
		echo "  → Start Docker Desktop or the Docker daemon:"; \
		echo "    (macOS/Windows) Open Docker Desktop"; \
		echo "    (Linux) sudo systemctl start docker"; \
		exit 1; \
	fi; \
	echo "  ✓ Docker is running"

check-ports:
	@PORTS_IN_USE=""; \
	for port in $(DB_PORT) $(API_PORT) $(WEB_PORT); do \
		if command -v lsof > /dev/null 2>&1; then \
			if lsof -i :$$port > /dev/null 2>&1; then \
				PORTS_IN_USE="$$PORTS_IN_USE $$port"; \
			fi; \
		elif command -v ss > /dev/null 2>&1; then \
			if ss -tlnp | grep -q ":$$port "; then \
				PORTS_IN_USE="$$PORTS_IN_USE $$port"; \
			fi; \
		fi; \
	done; \
	if [ -n "$$PORTS_IN_USE" ]; then \
		echo "$(YELLOW)⚠ ERR_PORT_IN_USE: Ports in use:$$PORTS_IN_USE$(RESET)"; \
		echo "  → Free the ports or stop conflicting services:"; \
		echo "    lsof -ti :PORT | xargs kill -9"; \
		echo "  → Or change ports in .env and docker-compose.yml"; \
		echo "  (Continuing anyway — Docker may handle port conflicts)"; \
	else \
		echo "  ✓ Required ports are available"; \
	fi
