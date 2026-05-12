# WanderViet — Development Rules

## Code Standards

- Use the Design DNA in `.stitch/DESIGN.md` for all UI work.
- Prefer shared types from `packages/shared` when types cross package boundaries.
- Run scoped lint, test, and build before commits: `pnpm lint && pnpm test && pnpm build`.
- Follow Conventional Commits format for all commit messages.

## Security Boundaries

- **Never** implement real payment processing. All payment code must be mock/demo only.
- **Never** commit secrets, `.env` files, `node_modules`, or generated build output.
- **Never** store real card data or process real financial transactions.
- The chatbot runtime must **not** require an OpenAI API key. Use the local AI service (Ollama + Qdrant).

## Architecture

- Backend: NestJS 11 + Prisma 7 + PostgreSQL (see `docs/adr/` for decisions)
- Frontend: Next.js 16 + TypeScript + Tailwind CSS
- AI: FastAPI + Ollama + Qdrant (local-first, no cloud dependency)
- Monorepo: pnpm workspaces + Turborepo
- Docker images: `nguyenson1710/wanderviet-api` and `nguyenson1710/wanderviet-web`
