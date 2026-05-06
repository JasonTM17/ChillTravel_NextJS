# Stitch Prompts

Stitch project created: 1439968317747880611.

The first screen generation timed out in the tool after 120 seconds, so these prompts are preserved for manual or follow-up generation.

## Vietnamese Travel Commerce redesign
Create a high-fidelity desktop web design for VIETWANDER AI using a Vietnamese OTA / travel-commerce UX inspired by familiar booking platforms, but legally distinct and not copying any third-party logo, icon, layout pixel-for-pixel, typography, or brand assets.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web desktop-first with responsive mobile behavior.
- Palette: booking blue #0277D4 for active navigation and trust, deep navy #071827 for text, pale sky #EAF7FF and white surfaces, action orange #FF6D1A for primary conversion CTAs, teal #0F8B7B for safe/local AI trust badges.
- Typography: Be Vietnam Pro or Inter-style UI font; no negative letter spacing; compact Vietnamese labels.
- Shapes: 12px controls, 16px cards, image-led deal cards, stable listing rows.
- Style: clean, trustworthy, practical travel-commerce product; fewer AI buzzwords, no neon, no sci-fi glass, no decorative orbs.

**PAGE STRUCTURE:**
1. Header: distinct VietWander logo mark using compass + route line + Vietnam map hint, wordmark VietWander AI, utility nav in Vietnamese: Ưu đãi, Hỗ trợ, Đặt chỗ, Đăng nhập, Đăng ký.
2. Service navigation: icon tabs in Vietnamese: Khách sạn, Chuyến bay, Hoạt động, Xe đưa đón, Thuê xe, Lập lịch trình AI.
3. Hero search: large white booking card over pale sky / destination photo. Fields: Bạn muốn đi đâu?, Nhận phòng, Trả phòng, Khách và phòng, Ngân sách. Primary CTA: Tìm kiếm.
4. Promo area: Vietnamese coupon cards and deal banners for Đà Nẵng, Phú Quốc, Hội An, Sapa; clearly marked demo/sample.
5. Explore preview: travel-commerce listing rows with image, rating, amenities, price panel, actions Xem ưu đãi and Lập lịch trình AI.
6. Booking trust: quiet banner: Thanh toán demo — không phát sinh giao dịch thật. Không lưu thẻ thật.
7. AI planner: warm helper module in Vietnamese: gợi ý lịch trình, ngân sách, văn hóa, ẩm thực; state that live flight/visa/weather data is not available.

**OUTPUT GOAL:**
Make this feel like a production Vietnamese travel booking product, not an AI template. Use real destination photography placeholders and precise Vietnamese microcopy throughout.

## Web landing
Create a premium cinematic travel intelligence web app landing page for VIETWANDER AI, a Vietnam and world travel platform. Visual identity: emerald teal #0F8B7B, sunset orange #F97316, deep navy #071827, ivory sand #F8F3EA. Include a full-bleed cinematic hero, hero search bar labeled Ban muon di dau, AI trip planner CTA, Vietnam destinations, world bucket list, local experiences, budget simulator, chatbot assistant, mobile app preview, glassmorphism cards, map-inspired layout, responsive desktop and mobile behavior, modern luxury travel aesthetic. No third-party logos.

## Mobile
Create a Flutter mobile app UI for VIETWANDER AI, a premium AI travel planner. Include onboarding, home, explore, destination detail, AI chat planner, itinerary timeline, booking mock payment, wishlist, profile. Style: cinematic travel, clean cards, emerald teal, sunset orange, deep navy, rounded cards, beautiful imagery, high-end product design.

## Explore redesign generated in Stitch
- Screen: `projects/1439968317747880611/screens/f99fe7819f5f41a994cc11a32bf6156a`
- Design system asset: `assets/4f9aea6b433b46fb95c4507ad14b6319`
- Direction: Premium editorial travel, not an obvious AI dashboard.
- Implementation rules:
  - Use real destination photography and strong editorial hierarchy.
  - Keep AI language secondary; prefer planner, concierge, dossier, route, and mood.
  - Use ivory sand backgrounds, deep navy text, emerald active states, and sunset orange only for primary CTAs.
  - Replace neon gradients and heavy glass cards with low-contrast borders, paper surfaces, and restrained shadows.
  - Explore page should have a top search block, practical filter rail, destination grid, and editorial recommendation strips.

## Editorial landing redesign generated in Stitch
- Screen: `projects/1439968317747880611/screens/426473646106452a9762dc8088047f54`
- Design system asset: `assets/d13576e313ba4aabb320e622cd550758`
- Direction: VietWander Editorial, a premium Vietnamese travel intelligence landing page that feels more like a human-curated planning desk than an AI template.
- Implementation rules:
  - Lead with a generated photographic Vietnam hero and keep the search command in the first viewport.
  - Use route dossier, planning desk, culture guard, budget dial, and offline pack language before generic AI wording.
  - Use Noto Serif-style editorial headings and Be Vietnam Pro-style body/UI rhythm.
  - Keep deep navy panels grounded and sparse; sunset orange is reserved for the main action, while emerald marks confidence and filters.
  - Do not use neon, floating gradient orbs, generic chatbot illustrations, or visible instructions about how to use the page.
  - Preserve explicit product boundaries: local sample data, no live visa/weather/flight claims, and mock-only payments.

## Command center redesign generated in Stitch
- Screen: `projects/1439968317747880611/screens/8debca2537a8486babd0b255f4325657`
- Design system asset: `assets/c7ffbbb949ed442593f88c43f590c4e4`
- Local artifacts: `.stitch/designs/command-center.html`, `.stitch/designs/command-center.png`
- Direction: Editorial Intelligence, a desktop-first travel command center that balances editorial inspiration with immediate planning utility.
- Implementation rules:
  - First viewport is a split screen: destination photograph on the left, precise planner controls on the right.
  - Replace marketing copy with functional controls: search input, segmented style control, duration stepper, budget slider, and one primary CTA.
  - Explore is a three-column workspace: filter rail, destination result grid, sticky route dossier.
  - Cards use 8-14px radius, 1px warm borders, real imagery, and clear actions for open dossier, plan, compare, and mock booking.
  - Tool modules behave like product utilities: Smart Budget Simulator, Mood Search, Local Culture Guard, Offline Travel Pack.
  - Keep explicit trust boundaries visible but quiet: local sample knowledge, local RAG runtime, mock payments only, no live flight/visa/weather claims.
