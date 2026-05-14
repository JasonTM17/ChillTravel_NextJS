# ─── Stage 1: base ────────────────────────────────────────────────────────────
FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

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

# Generate Prisma client (api depends on it for types)
RUN pnpm --filter @vietwander/db build

# Build shared package (api depends on it)
RUN pnpm --filter @vietwander/shared build

# Build the API (tsc → dist/)
RUN pnpm --filter @vietwander/api build

# ─── Stage 3b: production deps ───────────────────────────────────────────────
FROM base AS prod-deps
WORKDIR /workspace

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json          ./apps/api/package.json
COPY apps/web/package.json          ./apps/web/package.json
COPY packages/config/package.json   ./packages/config/package.json
COPY packages/db/package.json       ./packages/db/package.json
COPY packages/shared/package.json   ./packages/shared/package.json

RUN pnpm install --frozen-lockfile --prod

# ─── Stage 4: runner ──────────────────────────────────────────────────────────
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S app && adduser -S app -G app

# Copy only what the runtime needs
COPY --from=prod-deps /workspace/node_modules                   ./node_modules
COPY --from=prod-deps /workspace/apps/api/node_modules          ./apps/api/node_modules
COPY --from=build /workspace/apps/api/dist                  ./dist
COPY --from=build /workspace/packages/shared/dist           ./packages/shared/dist
COPY --from=build /workspace/packages/db                    ./packages/db

RUN chown -R app:app /app

USER app

EXPOSE 4000

CMD ["node", "dist/main.js"]
