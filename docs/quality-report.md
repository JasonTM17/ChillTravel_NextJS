# Quality Report

Verified locally on 2026-05-07:

- pnpm lint: passed
- pnpm test: passed after excluding built test output and fixing diacritic-insensitive search
- pnpm build: passed with Next.js 16.2.4, NestJS 11.1.19, and Prisma 7.8.0 schema validation
- pnpm exec turbo build --no-daemon: passed for web, API, shared, config, and DB schema packages
- pnpm web:smoke: passed for landing, explore, destination detail, hotels, experiences, planner, chat, booking demo, booking detail, budget, compare, map, personality, wishlist, trips, profile, auth, admin, AI knowledge, and localized 404
- pnpm web:smoke: passed again after adding full Stitch route coverage for `/flights`, `/hotels/da-nang-boutique-stay`, `/support`, and `/loyalty`
- Browser-use E2E: passed for route loading, Explore style-filter navigation, Destination booking CTA, booking QR preview, exact demo-payment warning, and console-error scan on the final booking route
- Stitch final responsive QA pass: completed for shared web primitives, public booking/detail flows, strengthened smoke markers, and Flutter mobile home/detail polish
- python -m unittest discover apps/ai-service/tests: passed
- docker compose -f infra/docker/docker-compose.yml config: passed
- Dart format: passed for changed mobile booking, home, explore, destination detail, shell, flight results, support, loyalty, and widget test files, with package-resolution warnings because Flutter SDK is not installed locally
- dart analyze apps/mobile: blocked locally because Flutter packages (`package:flutter/material.dart`, `flutter_lints`, and plugin deps) cannot resolve without a Flutter SDK/pub get environment

Flutter SDK is not installed on this machine, so mobile analyze/test is prepared in CI and documented but not executed locally.
