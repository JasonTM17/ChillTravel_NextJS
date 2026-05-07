---
page: release-ready-handoff
---

ChillTravel is now at the release-ready handoff baton after the Stitch Loop post-QA pass.

**Keep These Guardrails**
- Pale sky background, white booking cards, booking blue active state, orange primary CTA, teal trust badges.
- Custom ChillTravel compass/route/Vietnam identity with Hoang Sa and Truong Sa; no Traveloka bird, wordmark, screenshots, or third-party brand assets.
- Vietnamese-first copy across public and admin surfaces.
- Payment surfaces always say: `Thanh toán demo — không phát sinh giao dịch thật`.
- Chatbot runtime remains local-first and must not require an OpenAI API key.

**Next Possible Loop**
1. Install Flutter SDK and run native `flutter pub get`, `flutter analyze`, and `flutter test`.
2. Add viewport-capable Playwright or equivalent browser automation if this repo needs CI-level visual screenshots.
3. Connect Prisma migrations/Qdrant indexing when moving beyond portfolio-local sample data.

**Output goal**
Keep the portfolio-ready handoff clean: no old public brand names, no real-payment wording, no Traveloka trademarks, and no uncommitted QA drift.
