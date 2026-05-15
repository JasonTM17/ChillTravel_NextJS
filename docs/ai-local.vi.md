# Dịch Vụ AI Cục Bộ

Dịch vụ AI (`apps/ai-service`) chạy hoàn toàn cục bộ — không cần OpenAI API key.

## Công Nghệ

- **Runtime**: FastAPI (Python 3.12)
- **LLM**: Ollama (`qwen3:4b` mặc định, chuyển sang `llama3.2:3b` trên máy ít RAM)
- **Embeddings**: `nomic-embed-text` qua Ollama
- **Vector DB**: Qdrant (Docker service trên `:6333`)
- **Cơ sở kiến thức**: File Markdown trong `apps/ai-service/knowledge/`

## Cài Đặt

```bash
# 1. Cài Ollama — https://ollama.ai
ollama pull qwen3:4b
ollama pull nomic-embed-text

# 2. Khởi động Qdrant
docker compose -f infra/docker/docker-compose.yml up -d qdrant

# 3. Khởi động dịch vụ AI
cd apps/ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8010
```

## Endpoints

| Method | Path                  | Mô tả                                |
| ------ | --------------------- | ------------------------------------ |
| GET    | `/health`             | Health check                         |
| POST   | `/chat`               | Chat với RAG context                 |
| POST   | `/plan`               | Lập lịch trình du lịch AI            |
| POST   | `/budget`             | Ước tính ngân sách chuyến đi         |
| POST   | `/personality/detect` | Phát hiện phong cách du lịch từ text |
| POST   | `/compare`            | So sánh điểm đến                     |
| POST   | `/mood-search`        | Tìm kiếm điểm đến theo tâm trạng     |
| POST   | `/rag/reindex`        | Re-index cơ sở kiến thức vào Qdrant  |

## Giới Hạn

Dịch vụ cảnh báo rõ ràng khi người dùng hỏi về dữ liệu thời gian thực mà nó không thể cung cấp:

- Giá vé máy bay trực tiếp
- Yêu cầu visa hiện tại
- Thời tiết thời gian thực

Tất cả phản hồi bao gồm trường `provider` cho biết câu trả lời đến từ LLM cục bộ hay fallback.
