# Architecture

CHILLTRAVEL is a local-first travel intelligence monorepo.

- apps/web: Next.js portfolio and product web app.
- apps/api: NestJS REST API with Swagger, RBAC, mock payment, travel data, trips, bookings, admin.
- apps/ai-service: FastAPI local RAG service with Ollama and Qdrant adapters.
- apps/mobile: Flutter clean architecture source with Riverpod, Dio, Drift-ready offline cache, local notification mock.
- packages/shared: shared domain types, seed data, local AI tools.
- packages/db: Prisma schema and seed preview.

Chatbot runtime does not require an OpenAI API key. The default path is Ollama plus Qdrant using local/sample markdown knowledge. If hardware is limited, use qwen3:4b or llama3.2:3b. Fine-tuning is optional and must not be claimed unless actually run.

## Travel Intelligence Layer

The shared package owns deterministic product intelligence used by web and API:

- Bo nhan dien phong cach du lich maps quiz answers or natural language into Food Hunter, Culture Seeker, Beach Lover, Mountain Adventurer, Luxury Escaper, Budget Backpacker, Family Planner, or World Wanderer.
- Smart Budget Simulator adjusts hotel, food, transport, activity, travelers, and duration into a local/sample VND budget breakdown.
- So sanh thong minh scores 2-4 destinations for food, family fit, nightlife, safety, activity fit, and budget tradeoffs.
- Mood Search converts natural language such as `yen binh co bien an ngon` into inferred filters and matching destinations.
