# Hardening Notes

- Prisma 7 datasource URL is handled in prisma.config.ts instead of schema.prisma.
- Search normalizes Vietnamese diacritics so queries like Da Nang can find Đà Nẵng.
- Payment remains mock-only across API, web, mobile, and docs.
- AI responses include local knowledge-base limitations for real-time flight, visa, and weather questions.
- Build outputs, tsbuildinfo files, node_modules, and generated binary assets are ignored.
