from __future__ import annotations

from pathlib import Path


def knowledge_root() -> Path:
    return Path(__file__).resolve().parents[1] / "knowledge"


def load_markdown_documents() -> list[dict[str, str]]:
    root = knowledge_root()
    docs: list[dict[str, str]] = []
    for file in root.rglob("*.md"):
        docs.append({"source_id": str(file.relative_to(root)).replace("\\", "/"), "content": file.read_text(encoding="utf-8")})
    return docs


def retrieve(query: str, limit: int = 4) -> list[dict[str, str]]:
    terms = [term.lower() for term in query.split() if len(term) > 2]
    scored = []
    for doc in load_markdown_documents():
        content = doc["content"].lower()
        score = sum(1 for term in terms if term in content)
        if score:
            scored.append((score, doc))
    scored.sort(key=lambda item: item[0], reverse=True)
    return [doc for _, doc in scored[:limit]]


def reindex_summary() -> dict[str, object]:
    docs = load_markdown_documents()
    return {
        "status": "ready",
        "vector_db": "qdrant",
        "embedding_model": "nomic-embed-text",
        "documents": len(docs),
        "note": "This local scaffold uses markdown retrieval in tests; Docker runtime can push chunks to Qdrant.",
    }
