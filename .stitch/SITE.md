# VietWander AI Stitch Loop Site Plan

## 1. Vision

VietWander AI is a Vietnamese travel-commerce platform with local-first AI planning. The product should feel like a trustworthy OTA: fast search, clear service tabs, strong listing comparison, transparent price panels, useful admin operations, and explicit demo payment boundaries.

## 2. Stitch Project

- Project ID: `1439968317747880611`
- Primary web app: `apps/web`
- Mobile app: `apps/mobile`
- Stitch output staging: `.stitch/designs`

## 3. Design DNA

Use `.stitch/DESIGN.md` as the source of truth.

Important:

- Use Traveloka-style booking usability only as inspiration; do not copy trademarks, logos, exact layouts, color proportions, screenshots, or third-party assets.
- VietWander logo remains a custom compass/route/Vietnam-map identity with Hoang Sa and Truong Sa.
- All user-facing copy must be Vietnamese-first.
- Every payment surface must clearly say it is demo/local/mock.

## 4. Sitemap

- [x] `/` landing and booking search
- [x] `/explore`
- [x] `/destinations/[slug]`
- [x] `/hotels`
- [x] `/experiences`
- [x] `/booking/demo`
- [x] `/booking/[id]`
- [x] `/ai-planner`
- [x] `/chat`
- [x] `/budget`
- [x] `/compare`
- [x] `/map`
- [x] `/personality`
- [x] `/wishlist`
- [x] `/trips`
- [x] `/profile`
- [x] `/login`
- [x] `/register`
- [x] `/admin`
- [x] `/admin/destinations`
- [x] `/admin/bookings`
- [x] `/admin/analytics`
- [x] `/admin/ai-knowledge`

## 5. Roadmap

- [x] Travel Commerce Core screen: landing + explore search-first OTA UX.
- [x] Booking checkout detail screen with demo payment trust panel.
- [ ] Refactor full web surface to shared travel-commerce primitives.
- [ ] Refactor admin into an operations console instead of repeated destination-card filler.
- [ ] Apply mobile-first OTA home and booking screens to Flutter.
- [ ] Expand Vietnamese route smoke tests and visual QA.

## 6. Creative Freedom

- Add compact deal shelves, coupon cards, trust badges, sticky trip cart, admin tables, and Vietnamese microcopy that feels like a real booking product.
- Preserve local-first AI and mock payment boundaries as visible trust signals.
