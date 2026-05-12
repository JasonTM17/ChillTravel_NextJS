.PHONY: install dev build test lint typecheck format seed migrate docker-up docker-down docker-build e2e load-test clean help

# Default target
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	pnpm install

dev: ## Start all services in development mode
	pnpm dev

build: ## Build all packages and apps
	pnpm build

test: ## Run all unit tests
	pnpm test

lint: ## Run linting across all packages
	pnpm lint

typecheck: ## Run TypeScript type checking
	pnpm typecheck

format: ## Format all files with Prettier
	pnpm format:check

seed: ## Seed the database with demo data
	pnpm seed

migrate: ## Run Prisma database migrations
	pnpm --filter @vietwander/db exec prisma migrate dev --schema prisma/schema.prisma

docker-up: ## Start all Docker services
	docker compose -f infra/docker/docker-compose.yml up -d

docker-down: ## Stop all Docker services
	docker compose -f infra/docker/docker-compose.yml down

docker-build: ## Build Docker images
	docker compose -f infra/docker/docker-compose.yml build

e2e: ## Run end-to-end tests
	pnpm e2e

load-test: ## Run k6 load tests
	pnpm load-test

clean: ## Remove build artifacts and node_modules
	find . -name "dist" -type d -not -path "*/node_modules/*" -exec rm -rf {} + 2>/dev/null || true
	find . -name ".next" -type d -not -path "*/node_modules/*" -exec rm -rf {} + 2>/dev/null || true
	find . -name "node_modules" -type d -maxdepth 3 -exec rm -rf {} + 2>/dev/null || true
