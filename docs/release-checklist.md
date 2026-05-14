# Release Checklist

Run these gates before tagging a release or merging to `main`.

## Code Quality

```bash
pnpm lint          # TypeScript type-check across all packages
pnpm typecheck     # Explicit tsc --noEmit pass
pnpm test          # Unit tests (147 tests across api/web/shared)
pnpm build         # Full production build
```

## Infrastructure

```bash
pnpm docker:config                    # Validate docker-compose.yml syntax
make docker-build                     # Verify multi-stage Dockerfiles build
pnpm ai:test                          # Python AI service unit tests
```

## End-to-End

```bash
# Requires running postgres (make docker-up first)
make e2e           # Playwright E2E suite
```

## Manual Checks

- [ ] `http://localhost:3001` — home page loads, destinations visible
- [ ] `http://localhost:3001/tours` — tour listing with filters works
- [ ] `http://localhost:3001/login` — login with `user@wanderviet.com / User@123456`
- [ ] `http://localhost:3001/admin` — admin dashboard loads with `admin@wanderviet.com / Admin@123456`
- [ ] `http://localhost:4000/api/docs` — Swagger UI reachable
- [ ] `http://localhost:4000/health` — health check returns `{ status: "ok" }`
- [ ] Payment banner visible on booking pages: **"Thanh toán demo — không phát sinh giao dịch thật"**
- [ ] No real card data stored, no real transactions processed

## Security

```bash
pnpm audit --prod  # No high/critical vulnerabilities
```

## Before Commit

- [ ] No `.env` file committed (only `.env.example`)
- [ ] No `node_modules`, `dist`, `.next`, or generated artifacts staged
- [ ] No secrets, API keys, or real credentials in code
- [ ] Commit message follows Conventional Commits format
