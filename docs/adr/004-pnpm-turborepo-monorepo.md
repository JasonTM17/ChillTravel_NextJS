# ADR-004: pnpm + Turborepo for Monorepo Tooling

**Status:** Accepted  
**Date:** 2025-01-01  
**Deciders:** WanderViet Platform Team

---

## Context

The WanderViet platform consists of multiple applications and packages that need to be developed, built, and tested together:

```
apps/
├── api/          # NestJS 11 (TypeScript)
├── web/          # Next.js 16 (TypeScript)
├── ai-service/   # FastAPI (Python)
└── mobile/       # Flutter (Dart)

packages/
├── shared/       # Shared TypeScript types + API contracts
├── db/           # Prisma schema + migrations + generated client
└── config/       # Shared ESLint, TypeScript, and build configs
```

Key requirements for the monorepo tooling:

1. **Shared packages** — `apps/api` and `apps/web` both import from `packages/shared` and `packages/db`; changes to shared packages must trigger rebuilds of dependent apps
2. **Coordinated builds** — CI must build all packages in dependency order without manual orchestration
3. **Efficient installs** — The monorepo has hundreds of dependencies; install time and disk usage matter for CI and local development
4. **Parallel execution** — Independent tasks (lint api, lint web, test api, test web) should run in parallel
5. **Caching** — Unchanged packages should not be rebuilt on every CI run

Alternatives evaluated: npm workspaces + Lerna, Yarn Berry (PnP), Nx, Bazel.

---

## Decision

Use **pnpm workspaces** for package management and **Turborepo** for task orchestration.

### pnpm Workspaces

`pnpm-workspace.yaml` defines the workspace:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Each package has its own `package.json` with a scoped name (`@vietwander/api`, `@vietwander/web`, `@vietwander/shared`, `@vietwander/db`). Cross-package dependencies use workspace protocol:

```json
{ "@vietwander/shared": "workspace:*" }
```

### Turborepo

`turbo.json` at the root defines the task pipeline:

```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
    "test": { "dependsOn": ["^build"] },
    "lint": { "outputs": [] },
    "dev": { "cache": false, "persistent": true }
  }
}
```

The `^build` dependency ensures `packages/shared` and `packages/db` are built before `apps/api` or `apps/web` attempt to build.

---

## Consequences

**Positive:**

- **Efficient disk usage:** pnpm's content-addressable store deduplicates packages across the monorepo; a package installed in 10 workspaces occupies disk space only once. Typical saving: 40–60% vs npm/Yarn classic
- **Strict dependency isolation:** pnpm's non-flat `node_modules` prevents phantom dependencies (accidentally importing a package that isn't declared in your `package.json`)
- **Parallel builds:** Turborepo runs independent tasks in parallel automatically; `pnpm turbo run build` builds `shared` → then `api` and `web` in parallel
- **Remote caching:** Turborepo supports remote cache (Vercel Remote Cache or self-hosted) — CI hits can be served from cache when inputs haven't changed, reducing CI time from ~5 min to ~30 sec for unchanged packages
- **Scoped commands:** `pnpm --filter @vietwander/api test` runs tests only for the API package; `pnpm --filter ...@vietwander/shared test` runs tests for shared and all dependents
- **Single lockfile:** `pnpm-lock.yaml` at the root ensures deterministic installs across all packages

**Negative / Trade-offs:**

- **Learning curve:** Contributors unfamiliar with pnpm workspaces or Turborepo need to learn workspace-scoped commands (`pnpm --filter`, `pnpm -r`) and understand the task pipeline concept
- **pnpm strictness:** The non-flat `node_modules` occasionally causes issues with packages that assume a flat structure (e.g., some Prisma plugins, some Next.js plugins). These require `shamefully-hoist` or explicit `peerDependencies` declarations
- **Turborepo cache invalidation:** Cache keys are based on file hashes; a change to `turbo.json` or a root config file can invalidate all caches
- **Python and Flutter are not managed by pnpm:** `apps/ai-service` (Python) and `apps/mobile` (Flutter) have their own dependency managers (`pip`, `pub`). Turborepo orchestrates their build/test scripts via shell commands but does not manage their packages

**Mitigation:**

- The `Makefile` provides simple targets (`make dev`, `make test`, `make build`) that wrap the pnpm/Turborepo commands for contributors who prefer not to learn the tooling details
- `AGENTS.md` documents the scoped command patterns
- The `.npmrc` at the root sets `shamefully-hoist=false` explicitly to catch phantom dependency issues early in development rather than in production

---

## Alternatives Considered

| Option                 | Reason Rejected                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| npm workspaces + Lerna | Lerna is largely superseded by Turborepo; npm's flat `node_modules` allows phantom dependencies; slower installs |
| Yarn Berry (PnP)       | Plug'n'Play mode has compatibility issues with many NestJS and Next.js plugins; steep migration cost             |
| Nx                     | More powerful than Turborepo but significantly more complex to configure; overkill for this project size         |
| Bazel                  | Extremely powerful but requires deep expertise; not appropriate for a TypeScript/Node.js portfolio project       |
| Single-package repo    | Would require duplicating types between frontend and backend; no shared build pipeline                           |
