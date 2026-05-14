# Contributing to WanderViet

Thank you for your interest in contributing to WanderViet! This guide will help you get started.

## Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/nguyenson1710/wanderviet.git
   cd wanderviet
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your local configuration values.

4. **Start infrastructure services**

   ```bash
   docker compose up -d postgres redis qdrant ollama
   ```

5. **Run database migrations and seed**

   ```bash
   pnpm --filter @vietwander/db prisma migrate dev
   pnpm --filter @vietwander/db seed
   ```

6. **Start development servers**

   ```bash
   pnpm dev
   ```

## Branch Naming

Use the following prefixes for branch names:

| Prefix   | Purpose                         |
| -------- | ------------------------------- |
| `feat/`  | New features                    |
| `fix/`   | Bug fixes                       |
| `docs/`  | Documentation changes           |
| `chore/` | Maintenance, tooling, refactors |

Examples:

- `feat/tour-search-filters`
- `fix/booking-date-validation`
- `docs/update-architecture-diagram`
- `chore/upgrade-nestjs-11`

## Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/) format. Commit messages are enforced by commitlint via Husky hooks.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                        |
| ---------- | ---------------------------------- |
| `feat`     | A new feature                      |
| `fix`      | A bug fix                          |
| `docs`     | Documentation only changes         |
| `style`    | Formatting, missing semicolons     |
| `refactor` | Code change without fix or feature |
| `test`     | Adding or updating tests           |
| `chore`    | Build process or tooling changes   |
| `perf`     | Performance improvements           |
| `ci`       | CI/CD configuration changes        |

### Examples

```
feat(api): add tour search endpoint
fix(web): correct date picker locale
docs: update architecture diagram
refactor(api): extract booking validation logic
test(api): add unit tests for coupon service
chore: upgrade turborepo to v2
```

## Code Style

Code style is enforced automatically:

- **ESLint** — linting for TypeScript/JavaScript
- **Prettier** — code formatting
- **lint-staged** — runs linters on staged files before commit

These tools run automatically via Husky pre-commit hooks. To run manually:

```bash
pnpm lint        # Run ESLint across all packages
pnpm format      # Run Prettier formatting
```

## Testing Requirements

Before submitting a pull request, ensure all checks pass:

```bash
pnpm lint && pnpm test && pnpm build
```

- All existing tests must continue to pass
- New features should include relevant tests
- Bug fixes should include a regression test when possible

## Pull Request Process

1. Create a feature branch from `main` using the branch naming convention above
2. Make your changes with clear, atomic commits following Conventional Commits
3. Ensure all checks pass: `pnpm lint && pnpm test && pnpm build`
4. Push your branch and open a Pull Request using the PR template
5. Fill in the PR template completely (summary, type of change, checklist)
6. Request a review from a maintainer
7. Address any review feedback
8. PRs are merged via **squash merge** to keep a clean history

## Project Structure

```
wanderviet/
├── apps/
│   ├── api/          # NestJS 11 REST API
│   ├── web/          # Next.js 16 frontend
│   ├── mobile/       # Flutter mobile app
│   └── ai-service/   # FastAPI AI service (Ollama + Qdrant)
├── packages/
│   ├── shared/       # Shared TypeScript types and contracts
│   ├── db/           # Prisma schema, migrations, seed data
│   └── config/       # Shared ESLint, TypeScript configs
├── e2e/              # Playwright end-to-end tests
├── scripts/          # Utility and automation scripts
├── docs/             # Architecture docs and ADRs
└── infra/docker/docker-compose.yml
```

Each `apps/*` package is a deployable service. Each `packages/*` package is a shared library consumed by apps. Turborepo orchestrates builds, tests, and linting across the monorepo.
