# Design System: VIETWANDER AI

Project ID: 1439968317747880611

## Visual Theme
Premium editorial travel product with Vietnamese warmth, global destination photography, practical planning density, and local-first intelligence kept in the background. The UI should feel closer to a high-end travel magazine and planning desk than an AI dashboard.

Latest Stitch redesign:
- Stitch loop Travel Commerce Core pass:
  - Baton added in `.stitch/next-prompt.md` and project metadata persisted in `.stitch/metadata.json`.
  - Stitch generated OTA-style variants on 2026-05-06, but two screenshots included Traveloka trademark text/mark despite explicit constraints. Those screenshots were rejected as reference-only and not committed as shipped assets.
  - Implementation uses the useful UX structure only: compact white header, centered blue search widget, service tabs, coupon strip, destination cards, listing rows, price panels, sticky trip planner, Vietnamese labels, and VietWander-only brand assets.
- Follow-up Travel Commerce pass:
  - Prompted Stitch on 2026-05-06 for a Vietnamese OTA-style redesign. The generation timed out after 120s, so the enhanced prompt is preserved in `docs/stitch-prompts.md` and implemented manually from the Design DNA.
  - Direction: Vietnamese Travel Commerce. Search-first booking UX, service tabs, white cards on pale sky surfaces, blue active states, orange conversion CTAs, teal trust badges, compact Vietnamese copy, and no third-party logo or confusingly similar Traveloka brand assets.
  - Logo rule: VietWander mark must be distinct, using compass/route/Vietnam cues. Do not copy Traveloka's bird, curves, color proportions, wordmark, or brand layout.
- Project: `1439968317747880611`
- Screen: `projects/1439968317747880611/screens/8debca2537a8486babd0b255f4325657`
- Design system asset: `assets/c7ffbbb949ed442593f88c43f590c4e4`
- Direction: Editorial Intelligence. The interface should read as a premium travel command center: first viewport split between a high-impact destination image and a precise planning panel; Explore is a three-column workspace with filters, destination cards, and a sticky route dossier.
- Local artifacts: `.stitch/designs/command-center.html`, `.stitch/designs/command-center.png`

Previous Stitch redesign:
- Project: `1439968317747880611`
- Screen: `projects/1439968317747880611/screens/426473646106452a9762dc8088047f54`
- Design system asset: `assets/d13576e313ba4aabb320e622cd550758`
- Direction: VietWander Editorial. The page should feel like a premium Vietnamese travel dossier laid on a warm planning desk: tactile paper surfaces, image-led hero, route board, culture guardrails, budget notes, and restrained AI language.

Earlier Stitch redesign:
- Project: `1439968317747880611`
- Screen: `projects/1439968317747880611/screens/f99fe7819f5f41a994cc11a32bf6156a`
- Design system asset: `assets/4f9aea6b433b46fb95c4507ad14b6319`
- Direction: Editorial Travel. Image-led cards, ivory paper surfaces, low-contrast outlines, restrained shadows, practical filter rail, and reduced AI/glass/neon visual language.

## Color Palette
- Deep Navy #071827: app shell, hero overlays, admin surfaces.
- Emerald Teal #0F8B7B: primary action, AI confidence, active filters.
- Sunset Orange #F97316: CTA, booking emphasis, route highlights.
- Ivory Sand #FDF9F0 / #F8F3EA: calm page background and mobile surfaces.
- Mist Blue #DCEFF3: map cards, secondary panels, quiet tags.
- Warm Border #E6DFD3: editorial card borders and filter panels.

## Typography
Web uses a Vietnamese-friendly grotesk rhythm inspired by Be Vietnam Pro for body/UI and an editorial serif inspired by Noto Serif for major headlines and destination titles. Mobile uses platform system font. Headline letter spacing stays at `0`; dashboards use compact readable labels and tabular numbers.

## Components
Hero search command bar, live route dossier, image-led travel cards, filter rail, editorial list strips, itinerary timeline, budget simulator, comparison table, booking cards, admin data tables, and AI Knowledge Studio panels. AI assistant surfaces should be named as concierge, planner, route desk, or dossier where possible and avoid sci-fi chrome.

## Motion and Accessibility
Subtle reveal, hover lift, shimmer loading, keyboard focus states, strong contrast, and reduced-motion fallback.
