---
page: full-app-stitch-implementation
---

Continue ChillTravel from the full Stitch app implementation baton.

**Keep These Guardrails**
- Pale sky background, white booking cards, booking blue active state, orange primary CTA, teal trust badges.
- Custom ChillTravel compass/route/Vietnam identity with Hoang Sa and Truong Sa; no Traveloka bird, wordmark, screenshots, or third-party brand assets.
- Vietnamese-first copy across public and admin surfaces.
- Payment surfaces always say: `Thanh toán demo — không phát sinh giao dịch thật`.
- Chatbot runtime remains local-first and must not require an OpenAI API key.

**Current Loop**
1. Implement `/flights`, `/hotels/[id]`, `/support`, and `/loyalty` from the Stitch screen families documented in `docs/stitch-full-app-map.md`.
2. Expand shared commerce mock contracts so web and mobile do not duplicate flight, hotel, support, booking, or loyalty data.
3. Add Flutter mobile flight/support/account surfaces in the existing Riverpod/offline-cache style.
4. Expand route smoke and browser evidence for the new full-app routes.

**Output goal**
Keep implementation clean: no old public brand names, no real-payment wording, no Traveloka trademarks, no uncommitted QA drift, and no claim of live flight prices.
