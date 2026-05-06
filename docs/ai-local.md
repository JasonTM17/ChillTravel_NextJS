# Local AI Runtime

1. Install Ollama.
2. Pull models:
   - ollama pull qwen3:4b
   - ollama pull nomic-embed-text
3. Start Docker services:
   - docker compose -f infra/docker/docker-compose.yml up qdrant ai-service
4. Test:
   - GET http://localhost:8010/health
   - POST http://localhost:8010/chat with message: Đà Nẵng đi 3 ngày ăn gì?

The service includes RAG endpoints and local tools. It warns when users ask for real-time flight prices, visa policy, or current weather.

Additional local intelligence endpoints:

- POST `/personality/detect`
- POST `/compare`
- POST `/mood-search`

These mirror the deterministic shared intelligence layer so local AI demos can run without a cloud LLM.
