# WanderViet — Baseline Audit Report

> Generated at: 2026-05-13T02:31:42.733Z
> Script: `pnpm audit:baseline` (`scripts/audit/run-baseline.ts`)

---

## 1. TypeScript Strict Status

| Workspace       | Current Status                                 | Target                                |
| --------------- | ---------------------------------------------- | ------------------------------------- |
| apps/api        | `strict: true` (no `noUncheckedIndexedAccess`) | `strict` + `noUncheckedIndexedAccess` |
| apps/web        | **not strict**                                 | `strict` + `noUncheckedIndexedAccess` |
| packages/shared | `strict: true` (no `noUncheckedIndexedAccess`) | `strict` + `noUncheckedIndexedAccess` |
| packages/db     | **not strict**                                 | `strict` + `noUncheckedIndexedAccess` |
| packages/config | `strict: true` (no `noUncheckedIndexedAccess`) | `strict` + `noUncheckedIndexedAccess` |

---

## 2. ESLint Warning Count

| Workspace       | Warnings | Target       |
| --------------- | -------- | ------------ |
| apps/api        | 0        | 0 (maintain) |
| apps/web        | 0        | 0 (maintain) |
| packages/shared | 0        | 0 (maintain) |
| packages/db     | 0        | 0 (maintain) |
| packages/config | 0        | 0 (maintain) |
| **Total**       | **0**    | **0**        |

> Note: ESLint currently reports 0 warnings. After adding stricter rules (`import/order`, `import/no-cycle`, `no-console`, `unused-imports/no-unused-imports`), the baseline will likely increase. The target is to reduce the new baseline by ≥ 50%.

---

## 3. Test Coverage

| Workspace       | Current Coverage                             | Target                             |
| --------------- | -------------------------------------------- | ---------------------------------- |
| apps/api        | Not measured (missing `@vitest/coverage-v8`) | ≥ 70% line coverage (core modules) |
| apps/web        | Not measured (missing coverage dep)          | ≥ 50% line coverage (lib + hooks)  |
| packages/shared | Not measured                                 | ≥ 60% line coverage                |
| packages/db     | Not measured                                 | ≥ 50% line coverage                |

**Test Status (without coverage):**

- `apps/api`: ✅ 130 tests passing (10 test files)
- `apps/web`: ⚠️ 69 passed / 2 failed (5 test files) — failures in `lib/vietnamese.test.ts`

### Manual Procedure for Coverage Measurement

```bash
# 1. Install coverage dependency
pnpm --filter @vietwander/api add -D @vitest/coverage-v8
pnpm --filter @vietwander/web add -D @vitest/coverage-v8

# 2. Run tests with coverage
pnpm --filter @vietwander/api test -- --run --coverage
pnpm --filter @vietwander/web test -- --run --coverage

# 3. View coverage summary
cat apps/api/coverage/coverage-summary.json | jq '.total.lines.pct'
cat apps/web/coverage/coverage-summary.json | jq '.total.lines.pct'
```

---

## 4. Dependency Freshness

| Metric                            | Value                                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Outdated packages (monorepo-wide) | **25**                                                                                                 |
| Notable outdated                  | `@types/bcryptjs` (deprecated), `class-validator` (0.14.4 → 0.15.1), `lucide-react` (0.562.0 → 1.14.0) |

**Target:** 0 outdated packages with high/critical security severity.

**Command:** `pnpm outdated --recursive`

---

## 5. Web Bundle Size

| Asset Type                 | Current Size | Target                   |
| -------------------------- | ------------ | ------------------------ |
| JavaScript (all static JS) | **1.87 MB**  | < 300 KB (first load JS) |
| CSS (all static CSS)       | **47.98 KB** | < 100 KB                 |

> Note: The 1.87 MB JS figure includes ALL static chunks (not just first-load). Next.js code-splits aggressively, so first-load JS is likely smaller. The target refers to the first-load JS bundle reported by `next build`.

**Command:** `pnpm --filter @vietwander/web build && du -sh apps/web/.next/static/chunks/`

---

## 6. Security Audit (`pnpm audit --prod`)

| Severity  | Count  | Target |
| --------- | ------ | ------ |
| Critical  | **0**  | 0      |
| High      | **11** | 0      |
| Moderate  | **9**  | ≤ 5    |
| Low       | **3**  | —      |
| **Total** | **23** | —      |

All 11 high-severity vulnerabilities are in the `next` package (apps/web dependency). Patched version: `next >= 16.2.5`.

**Command:** `pnpm audit --prod`

---

## 7. Docker Image Sizes

| Image                          | Current Size | Target      |
| ------------------------------ | ------------ | ----------- |
| `nguyenson1710/wanderviet-api` | **1.7 GB**   | < 500 MB    |
| `nguyenson1710/wanderviet-web` | **313 MB**   | < 500 MB ✅ |

> The API image at 1.7 GB is significantly oversized — likely includes dev dependencies or lacks multi-stage build optimization.

**Command:** `docker images nguyenson1710/wanderviet-api --format "{{.Repository}}:{{.Tag}} {{.Size}}"`

---

## 8. ADR Count

| Metric        | Value | Target                   |
| ------------- | ----- | ------------------------ |
| Existing ADRs | **4** | ≥ 8 (4 existing + 4 new) |

**Existing ADRs:**

1. `001-nestjs-over-spring-boot.md`
2. `002-prisma-over-typeorm.md`
3. `003-mock-payment-only.md`
4. `004-pnpm-turborepo-monorepo.md`

**Planned new ADRs:** Caching Strategy, Observability Stack, i18n Strategy, Design Token Governance.

---

## 🚨 Security Blockers

The following issues **MUST** be resolved before proceeding with dependent requirements (per Req 1.5):

| #   | Type                   | Description                                                                               | Requirement                      |
| --- | ---------------------- | ----------------------------------------------------------------------------------------- | -------------------------------- |
| 1   | SECURITY_VULNERABILITY | 11 high severity vulnerabilities found in production dependencies (all in `next` package) | Req 1.5 — blocker until resolved |

**Resolution:** Upgrade `next` to `>= 16.2.5` in `apps/web/package.json`.

### AGENTS.md Compliance Check

| Rule                                    | Status                                                           |
| --------------------------------------- | ---------------------------------------------------------------- |
| No real payment processing              | ✅ Compliant — `003-mock-payment-only.md` ADR enforces mock-only |
| No committed secrets / .env files       | ✅ Compliant — only `.env.example` in git                        |
| No real card data storage               | ✅ Compliant                                                     |
| Chatbot does not require OpenAI API key | ✅ Compliant — `requiresOpenAiApiKey: false` enforced throughout |

---

## Post-Upgrade Targets

| Metric                              | Current                                  | Target                                     |
| ----------------------------------- | ---------------------------------------- | ------------------------------------------ |
| TypeScript strict (all workspaces)  | 3/5 strict, 0/5 noUncheckedIndexedAccess | All: `strict` + `noUncheckedIndexedAccess` |
| ESLint warnings (after new rules)   | 0 (before new rules)                     | Reduce new baseline by ≥ 50%               |
| Test coverage (API core modules)    | Not measured                             | ≥ 70% line coverage                        |
| Test coverage (Web lib + hooks)     | Not measured                             | ≥ 50% line coverage                        |
| Outdated dependencies               | 25 packages                              | 0 with high/critical severity              |
| Web bundle JS (first load)          | ~1.87 MB total static                    | < 300 KB first load                        |
| Web bundle CSS                      | 47.98 KB                                 | < 100 KB ✅ (already met)                  |
| Security vulnerabilities (critical) | 0                                        | 0 ✅ (already met)                         |
| Security vulnerabilities (high)     | 11                                       | 0                                          |
| Docker API image size               | 1.7 GB                                   | < 500 MB                                   |
| Docker Web image size               | 313 MB                                   | < 500 MB ✅ (already met)                  |
| ADR count                           | 4                                        | ≥ 8                                        |
| E2E test scenarios                  | 0                                        | ≥ 5 (Playwright)                           |
| Property-based tests                | 0                                        | ≥ 3 (fast-check)                           |

---

## Metrics That Cannot Be Fully Automated

### Lighthouse Score

**Reason:** Requires a running web server and headless Chrome. Cannot be measured in a static audit script.

**Manual Procedure:**

```bash
# 1. Start the web app
pnpm --filter @vietwander/web dev

# 2. Run Lighthouse CLI (install globally if needed: npm i -g lighthouse)
lighthouse http://localhost:3000 --output=json --output-path=docs/audit/lighthouse.json --chrome-flags="--headless"

# 3. View scores
cat docs/audit/lighthouse.json | jq '{performance: .categories.performance.score, accessibility: .categories.accessibility.score, bestPractices: .categories["best-practices"].score, seo: .categories.seo.score}'
```

**Target:** Performance ≥ 80, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 90.

### Test Coverage (until `@vitest/coverage-v8` is installed)

**Reason:** Coverage dependency `@vitest/coverage-v8` is not installed in workspaces.

**Manual Procedure:**

```bash
# Install coverage dependency
pnpm --filter @vietwander/api add -D @vitest/coverage-v8
pnpm --filter @vietwander/web add -D @vitest/coverage-v8

# Run with coverage
pnpm --filter @vietwander/api test -- --run --coverage
pnpm --filter @vietwander/web test -- --run --coverage

# Check coverage report
cat apps/api/coverage/coverage-summary.json | jq '.total.lines.pct'
```

---

## Summary

| Category             | Status                                                | Priority |
| -------------------- | ----------------------------------------------------- | -------- |
| TypeScript strict    | ⚠️ Partial (3/5 strict, 0/5 noUncheckedIndexedAccess) | High     |
| ESLint               | ✅ 0 warnings (before new rules)                      | Medium   |
| Test coverage        | ❌ Not measured (missing dep)                         | High     |
| Dependencies         | ⚠️ 25 outdated                                        | Medium   |
| Bundle size          | ⚠️ JS oversized                                       | Medium   |
| Security audit       | 🚨 11 high vulnerabilities (BLOCKER)                  | Critical |
| Docker images        | ⚠️ API image oversized (1.7 GB)                       | Medium   |
| ADRs                 | ⚠️ 4/8 target                                         | Low      |
| AGENTS.md compliance | ✅ No violations                                      | —        |
