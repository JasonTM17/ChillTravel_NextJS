# Prisma Migrations — WanderViet

This folder tracks schema history for the WanderViet / ChillTravel Postgres
database.

## Baseline: `20260511000000_init_wanderviet`

Initial WanderViet schema (evolved from the legacy ChillTravel baseline).
The `migration.sql` file was generated offline with:

```bash
pnpm --filter @vietwander/db exec prisma migrate diff \
  --from-empty \
  --to-schema prisma/schema.prisma \
  --script \
  --output prisma/migrations/20260511000000_init_wanderviet/migration.sql
```

This lets us check the DDL into source control **without needing a live
PostgreSQL** in the dev environment. When a real DB is available, apply it with:

```bash
pnpm --filter @vietwander/db exec prisma migrate deploy
```

For iterative local development use the usual command (creates + applies a new
migration against the DB in `DATABASE_URL`):

```bash
pnpm --filter @vietwander/db exec prisma migrate dev --name <change>
```

## Running the seed

After the schema has been applied to a reachable PostgreSQL instance, populate
it with demo data using the idempotent TypeScript seed script
(`prisma/seed.ts`):

```bash
# From the repo root — uses the `seed` script wired in the root package.json
pnpm seed

# Equivalent direct invocation
pnpm --filter @vietwander/db seed

# Or via Prisma's own CLI (picks up the `"prisma": { "seed": ... }` block in
# packages/db/package.json — useful in CI / container entrypoints).
pnpm --filter @vietwander/db exec prisma db seed
```

The seed is **idempotent**: every write is an `upsert` keyed on a natural
unique field (email, slug, code, bookingCode, …), so re-running it does not
create duplicates and is safe to re-invoke during local development.

It seeds:

- 3 demo users — `admin@wanderviet.com` / `user@wanderviet.com` /
  `staff@wanderviet.com` (passwords are hashed with bcrypt — plaintext values
  printed in the run summary for dev convenience only).
- 5 countries + 12 cities.
- 12 destinations (8 Vietnam + Bali / Tokyo / Paris / Bangkok).
- 8 tours with itinerary + 2 images each; 5 tours ship future departures.
- 3 coupons: `WVWELCOME10` (PERCENT 10%), `WV500K` (FIXED 500k, unlimited),
  `WVEXPIRED` (PERCENT 20%, already past `validTo`).
- 7 bookings for `user@wanderviet.com` (2 PENDING, 3 CONFIRMED, 2 COMPLETED)
  with matching `Payment` rows for CONFIRMED/COMPLETED — all marked
  `isDemo=true` and `provider="MOCK_*"` in line with AGENTS.md (no real
  payments).
- 5 reviews linked to tours of the COMPLETED bookings (3 APPROVED, 2 PENDING).
- 8 blog posts (6 PUBLISHED + 2 DRAFT) authored by the admin.
- 5 contact requests (NEW / IN_PROGRESS / RESOLVED / CLOSED).

### Environment

Set `DATABASE_URL` before running. The seed refuses to run without it:

```bash
export DATABASE_URL="postgresql://vietwander:vietwander@localhost:5432/vietwander"
pnpm seed
```
