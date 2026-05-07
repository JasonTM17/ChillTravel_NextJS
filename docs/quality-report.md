# Quality Report

Verified locally on 2026-05-07:

- pnpm lint: passed
- pnpm test: passed after excluding built test output and fixing diacritic-insensitive search
- pnpm build: passed with Next.js 16.2.4, NestJS 11.1.19, and Prisma 7.8.0 schema validation
- pnpm exec turbo build --no-daemon: passed for web, API, shared, config, and DB schema packages
- pnpm web:smoke: passed for landing, explore, destination detail, hotels, experiences, planner, chat, booking demo, booking detail, budget, compare, map, personality, wishlist, trips, profile, auth, admin, AI knowledge, and localized 404
- python -m unittest discover apps/ai-service/tests: passed
- docker compose -f infra/docker/docker-compose.yml config: passed
- Dart format: passed for changed mobile booking, home, and destination detail files, with package-resolution warnings because Flutter SDK is not installed locally
- dart analyze apps/mobile: blocked locally because Flutter packages (`package:flutter/material.dart`, `flutter_lints`, and plugin deps) cannot resolve without a Flutter SDK/pub get environment

Flutter SDK is not installed on this machine, so mobile analyze/test is prepared in CI and documented but not executed locally.
