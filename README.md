# CHILLTRAVEL

Vietnam & World Travel Commerce Platform.

CHILLTRAVEL is a portfolio-grade local-first travel platform combining a cinematic Next.js web app, NestJS API, FastAPI local assistant/RAG service, PostgreSQL/Prisma schema, Qdrant vector architecture, Redis-ready cache, and a Flutter mobile app source tree.

## Highlights

- Vietnamese travel-commerce web app with Traveloka-inspired search-first UX, legally distinct ChillTravel branding, landing, explore, destination detail, smart planner, chat, compare, map, booking mock, wishlist, trips, profile, and admin.
- Local chatbot runtime design: Ollama + RAG + Qdrant. No OpenAI API key required for runtime chatbot.
- Rich sample travel data for Vietnam and world destinations.
- Mock-only booking and payment. Thanh toán demo — không phát sinh giao dịch thật.
- Flutter mobile app structure with Riverpod, Dio, Drift-ready offline cache, secure token storage, local notification mock, vi/en-ready UX.
- Stitch Design DNA and prompts included. See `docs/vietnamese-ux-brand.md` for Vietnamese UX, brand, payment, and QA rules.

## Tech Stack

- Web: Next.js 16.2.4, TypeScript, TailwindCSS, shadcn-style components, Framer Motion-ready.
- API: NestJS 11.1.19, Swagger, validation, RBAC-ready services.
- DB: PostgreSQL, Prisma 7.8.0 schema.
- Local assistant: FastAPI, Ollama provider assumptions, Qdrant, local markdown knowledge.
- Mobile: Flutter source tree, Riverpod, Dio, go_router, Drift-ready.
- DevOps: pnpm, Turborepo, Docker Compose, GitHub Actions.

## Local Setup

Install Node 24 and pnpm 10, then:

    pnpm install
    pnpm build
    pnpm test
    pnpm lint

Run web:

    pnpm --filter @vietwander/web dev

Run Vietnamese web smoke checks:

    pnpm web:smoke

Run API:

    pnpm --filter @vietwander/api dev

Run local assistant service:

    cd apps/ai-service
    pip install -r requirements.txt
    uvicorn app.main:app --reload --port 8010

Run Docker services:

    docker compose -f infra/docker/docker-compose.yml up

## Local Assistant

Install Ollama separately, then pull:

    ollama pull qwen3:4b
    ollama pull nomic-embed-text

The local assistant service includes sample RAG and structured tools. It does not claim real-time flight, visa, or weather access.

## Mobile

Flutter is not installed on this machine yet. After installing Flutter stable:

    cd apps/mobile
    flutter pub get
    flutter analyze
    flutter test
    flutter run

## Demo Accounts

- admin@chilltravel.local / Admin123!
- user@chilltravel.local / User123!
- guide@chilltravel.local / Guide123!
- host@chilltravel.local / Host123!

## Payment Warning

All payment flows are local/mock/sandbox only. The project never stores real card data and never charges money.

## Data Limits

Travel data is sample/local. The chatbot does not provide real-time visa, current weather, or flight price truth. Check official sources for live travel decisions.

## Verification

    pnpm lint
    pnpm test
    pnpm exec turbo build --no-daemon
    pnpm web:smoke
    pnpm ai:test
    pnpm docker:config

## Roadmap

- Connect Prisma Client to PostgreSQL migrations.
- Push RAG chunks to Qdrant and add reranking.
- Install Flutter SDK and complete native build verification.
- Add real map provider behind an adapter.
- Add Cloudinary/S3 storage adapter while keeping local storage default.
- Add optional LoRA/QLoRA scripts when hardware allows.
