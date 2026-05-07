---
page: post-qa-release-check
---

Prepare the final release-readiness pass for **ChillTravel**, a Vietnamese travel-commerce platform.

**Design DNA**
- Pale sky background, white booking cards, booking blue active state, orange primary CTA, teal trust badges.
- Custom ChillTravel compass/route/Vietnam identity with Hoang Sa and Truong Sa; no Traveloka bird, wordmark, screenshots, or third-party brand assets.
- Vietnamese-first copy across public and admin surfaces.
- Payment surfaces always say: `Thanh toán demo — không phát sinh giao dịch thật`.

**Checklist**
1. Verify the public web flow still matches the Stitch references: home, results, detail, checkout.
2. Verify utility/admin surfaces keep the same Travel Commerce DNA and do not regress to generic cards.
3. Verify Flutter mobile home/detail/checkout surfaces remain Vietnamese and OTA-style.
4. Run final gates: web smoke, root lint/test/build, AI tests, Docker config.
5. Update release notes with known limitations: local/sample data, mock-only payments, local-first chatbot, Flutter SDK missing if still unavailable.

**Output goal**
Produce a portfolio-ready handoff with no old brand names, no real-payment wording, no Traveloka trademarks, and no uncommitted QA drift.
