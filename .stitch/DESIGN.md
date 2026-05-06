---
name: ChillTravel Travel Commerce
source: Stitch project 1439968317747880611
updated: 2026-05-06
---

# ChillTravel Travel Commerce Design DNA

## Product Mood

ChillTravel should feel like a trustworthy Vietnamese online travel agency: fast to search, easy to compare, transparent about demo payments, and warm enough for trip planning. The product can borrow the usability patterns of mature OTA products, but it must remain legally distinct and unmistakably ChillTravel.

## Brand Guardrails

- Use the custom ChillTravel compass, flight path, Vietnam map, Hoang Sa, and Truong Sa identity.
- Do not use the Traveloka bird, wordmark, icon proportions, screenshots, exact color ratios, or third-party brand assets.
- All user-facing product copy is Vietnamese-first.
- Payment copy must always say demo/local/mock and never imply real charging.
- AI copy must state local/sample boundaries when the user asks for live visa, weather, or flight prices.

## Palette

- Booking blue: `#0277D4` for active tabs, primary navigation, and search affordances.
- Deep blue: `#005EA8` for hover and high-trust states.
- Sky surface: `#EAF7FF` and `#F6FBFF` for page backgrounds and soft panels.
- White card: `#FFFFFF` for every core booking/comparison surface.
- Orange CTA: `#FF6D1A` for conversion actions such as `Tìm kiếm`, `Xem ưu đãi`, `Đặt chỗ demo`.
- Teal trust: `#0F8B7B` for safe/local/AI/RAG badges.
- Ink: `#071827` for primary text.
- Muted ink: `#476273` for secondary text.
- Border: `#D9ECFB` for cards, inputs, and tables.

## Typography

- Web UI font: Be Vietnam Pro, Inter, system sans-serif.
- Mobile UI font: Flutter system font.
- Use compact, high-legibility headings. Avoid oversized hero typography inside panels, cards, admin tables, and mobile screens.
- Letter spacing stays `0` except small uppercase metadata labels.

## Components

- Header: white sticky OTA header, logo at left, service/support/account actions at right.
- Service tabs: icon + Vietnamese label, blue active state, white selected tab, stable tap targets.
- Search panel: destination, dates, guests/rooms, orange search button; never hide the primary search action.
- Listing row: image, rating/reviews, badges, concise summary, food/tags, price panel, two CTAs.
- Deal/coupon card: code chip, short Vietnamese title, demo/sample status.
- Trip cart: sticky on desktop, compact bottom summary on mobile.
- Payment banner: visible orange/cream warning with `Thanh toán demo — không phát sinh giao dịch thật`.
- Admin table blocks: stats cards, filters, rows, status chips, action buttons; avoid destination-card filler.
- Mobile shell: top app bar, service grid, search card, promo cards, saved trip/offline pack, bottom navigation.

## Layout Rules

- Page background is pale sky/white, not dark cinematic.
- Use white cards with 12-16px radius and subtle blue shadow.
- Keep one primary orange CTA per decision area.
- Destination imagery should be direct and recognizable, not abstract AI art.
- Avoid nested cards, heavy glassmorphism, neon, or generic AI dashboard styling.
- Mobile surfaces must have stable heights and readable Vietnamese labels.

## Stitch Reference Screens

- Desktop home: `projects/1439968317747880611/screens/e4104b17d3324dc6b160d57e2adfd9fb`
- Desktop results: `projects/1439968317747880611/screens/ce144c71fc2f40e29f60d37be33adef8`
- Desktop hotel detail: `projects/1439968317747880611/screens/849d9ac75da448eebccd9e21ad2564b0`
- Desktop checkout: `projects/1439968317747880611/screens/3e6d1020c1d5469cb0f2ea232b176beb`
- Mobile home: `projects/1439968317747880611/screens/77188acdbcf14ff2a7d68dbf9ce90d34`
- Mobile hotel detail: `projects/1439968317747880611/screens/c24a8f5d938a48c5bab2bbb23993f8bf`
- Mobile checkout: `projects/1439968317747880611/screens/b52e4ad7cfef4308bd185b6b56d7c8b4`

These screens are reference-only. If any exported artifact contains Traveloka text, logos, or marks, do not commit that artifact.
