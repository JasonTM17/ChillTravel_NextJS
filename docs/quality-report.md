# Quality Report

Verified locally on 2026-05-06:

- pnpm lint: passed
- pnpm test: passed after excluding built test output and fixing diacritic-insensitive search
- pnpm build: passed with Next.js 16.2.4, NestJS 11.1.19, and Prisma 7.8.0 schema validation
- python -m unittest discover apps/ai-service/tests: passed
- docker compose -f infra/docker/docker-compose.yml config: passed
- Browser smoke pass for `/personality`, `/budget`, `/compare`, and `/explore?q=Da+Nang`: passed with 0 console errors.

Flutter SDK is not installed on this machine, so mobile analyze/test is prepared in CI and documented but not executed locally.
