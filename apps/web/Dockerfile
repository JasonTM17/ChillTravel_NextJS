# ─── Stage 1: base ────────────────────────────────────────────────────────────
FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

# ─── Stage 2: deps ────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /workspace

# Copy workspace manifests first for layer-cache efficiency
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy every package.json in the monorepo (preserving directory structure)
COPY apps/api/package.json          ./apps/api/package.json
COPY apps/web/package.json          ./apps/web/package.json
COPY packages/config/package.json   ./packages/config/package.json
COPY packages/db/package.json       ./packages/db/package.json
COPY packages/shared/package.json   ./packages/shared/package.json

RUN pnpm install --frozen-lockfile

# ─── Stage 3: build ───────────────────────────────────────────────────────────
FROM deps AS build
WORKDIR /workspace

# Copy full source
COPY . .

# Build shared package first (web depends on it)
RUN pnpm --filter @vietwander/shared build

# Build the Next.js app (outputs to .next/standalone via output: 'standalone')
RUN pnpm --filter @vietwander/web build

# ─── Stage 4: runner ──────────────────────────────────────────────────────────
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Next.js standalone output bundles its own node_modules
COPY --from=build /workspace/apps/web/.next/standalone ./
COPY --from=build /workspace/apps/web/.next/static      ./.next/static

# Public assets (images, icons, etc.)
COPY --from=build /workspace/apps/web/public            ./public

EXPOSE 3000

CMD ["node", "server.js"]
