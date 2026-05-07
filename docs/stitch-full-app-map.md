# Stitch Full App Map

Source project: `1439968317747880611`.

Use these screens as **layout references only**. Some source titles mention third-party brands; do not copy those names, logos, screenshots, or assets. Implement all public copy as ChillTravel Vietnamese travel commerce.

## Core Travel Commerce

- Home: desktop `e4104b17d3324dc6b160d57e2adfd9fb`, mobile `77188acdbcf14ff2a7d68dbf9ce90d34`, plus compact hub variants.
- Hotel/search results: desktop `ce144c71fc2f40e29f60d37be33adef8`, `9be48ec264264384a2605dab4399a25c`, `4f373a32f7ef4f1d859c4b2c5e68cb95`.
- Hotel detail: desktop `849d9ac75da448eebccd9e21ad2564b0`, `797ce437e0f042019982f29c80017493`, `4b77d50e512149a18fbcf4f6e3c77cea`; mobile `c24a8f5d938a48c5bab2bbb23993f8bf`.
- Checkout: desktop `3e6d1020c1d5469cb0f2ea232b176beb`, `cda57d116d7d409983cd43a740e19614`, `2a504543152e41f89ddaa38050e1e291`; mobile `b52e4ad7cfef4308bd185b6b56d7c8b4`.

## Added App Areas

- Flight results: desktop `10f8c0bbd4d3471c931b4343b3e4e429`, `57aade218ea84f8788a3f0ef16e62d42`, `d70e9e9fa27d44cc9fc57afbce5fb4ea`; mobile `d15486f9a4e44a3a94fa7aa89ea61acc`, `2d8a0d1c8af541869acab843a16bfa29`.
- Experiences: desktop `529d1d3e5f454909a18e756c5cd53b71`, `6945b8d19815433389b268534dc0db90`.
- User account/bookings/trips: `4716614ac5e84cd19d2cde46426f8b83`, `d467dc5fada249a398463d87311ce838`, `1cd1756a5138482bb1a1f7a2a24fa217`.
- Support center: `65bdf263c44d4f3a99d03e77a6baebdd`, `4e1148ee8b8943a7948dd09bbb677b20`.
- Loyalty: `83de6d19b9e5409fa72e13185982fb7b`.
- Auth: `3a7070b42356428b9e25cdf5b6485de4`.

## Implementation Targets

- Add `/flights`, `/hotels/[id]`, `/support`, and `/loyalty`.
- Expand shared mock contracts for flights, hotel properties, support, bookings, and loyalty.
- Polish existing home/results/checkout/account routes to stay consistent with the reference screen families.
- Expand mobile Flutter with flight/support/account surfaces while keeping local/offline and demo-payment boundaries.
