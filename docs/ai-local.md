# Local AI Service

The AI service (`apps/ai-service`) runs entirely locally — no OpenAI API key required.

## Stack

- **Runtime**: FastAPI (Python 3.12)
- **LLM**: Ollama (`qwen3:4b` default, swap to `llama3.2:3b` on low-RAM machines)
- **Embeddings**: `nomic-embed-text` via Ollama
- **Vector DB**: Qdrant (Docker service on `:6333`)
- **Knowledge base**: Markdown files in `apps/ai-service/knowledge/`

## Setup

```bash
# 1. Install Ollama — https://ollama.ai
ollama pull qwen3:4b
ollama pull nomic-embed-text

# 2. Start Qdrant
docker compose -f infra/docker/docker-compose.yml up -d qdrant

# 3. Start the AI service
cd apps/ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8010
```

## Endpoints

| Method | Path                  | Description                         |
| ------ | --------------------- | ----------------------------------- |
| GET    | `/health`             | Health check                        |
| POST   | `/chat`               | Chat with RAG context               |
| POST   | `/personality/detect` | Detect travel style from text       |
| POST   | `/compare`            | Compare destinations                |
| POST   | `/mood-search`        | Mood-based destination search       |
| POST   | `/rag/reindex`        | Re-index knowledge base into Qdrant |

## Guardrails

The service explicitly warns users when they ask for real-time data it cannot provide:

- Live flight prices
- Current visa requirements
- Real-time weather

All responses include a `provider` field indicating whether the answer came from the local LLM or a fallback.
