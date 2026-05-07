from __future__ import annotations

import hashlib
import os
from pathlib import Path
from typing import Any

from .providers import (
    DEFAULT_EMBED_MODEL,
    DEFAULT_QDRANT_COLLECTION,
    DEFAULT_QDRANT_URL,
    OllamaEmbeddingProvider,
)


def knowledge_root() -> Path:
    return Path(__file__).resolve().parents[1] / "knowledge"


def load_markdown_documents() -> list[dict[str, str]]:
    root = knowledge_root()
    docs: list[dict[str, str]] = []
    for file in root.rglob("*.md"):
        docs.append({"source_id": str(file.relative_to(root)).replace("\\", "/"), "content": file.read_text(encoding="utf-8")})
    return docs


def chunk_markdown_documents(max_chars: int = 900) -> list[dict[str, str]]:
    chunks: list[dict[str, str]] = []
    for doc in load_markdown_documents():
        paragraphs = [part.strip() for part in doc["content"].split("\n\n") if part.strip()]
        current = ""
        chunk_index = 1
        for paragraph in paragraphs:
            next_text = f"{current}\n\n{paragraph}".strip() if current else paragraph
            if len(next_text) > max_chars and current:
                chunks.append(_chunk_payload(doc["source_id"], current, chunk_index))
                chunk_index += 1
                current = paragraph
            else:
                current = next_text
        if current:
            chunks.append(_chunk_payload(doc["source_id"], current, chunk_index))
    return chunks


class QdrantRagAdapter:
    def __init__(
        self,
        url: str = DEFAULT_QDRANT_URL,
        collection: str = DEFAULT_QDRANT_COLLECTION,
        enabled: bool | None = None,
    ):
        self.url = url
        self.collection = collection
        self.enabled = enabled if enabled is not None else os.getenv("CHILLTRAVEL_USE_QDRANT", "").lower() in {"1", "true", "yes"}
        self.embedder = OllamaEmbeddingProvider()

    def status(self) -> dict[str, Any]:
        return {
            "backend": "qdrant" if self.enabled else "sample",
            "url": self.url,
            "collection": self.collection,
            "embedding_model": DEFAULT_EMBED_MODEL,
            "enabled": self.enabled,
        }

    def reindex(self, docs: list[dict[str, str]]) -> dict[str, Any]:
        if not self.enabled:
            return {**self.status(), "status": "ready", "indexed_documents": 0, "fallback_documents": len(docs), "fallback_reason": "qdrant disabled"}

        try:
            from qdrant_client import QdrantClient
            from qdrant_client.models import Distance, PointStruct, VectorParams

            embeddings = [(doc, self.embedder.embed(doc["content"])) for doc in docs]
            first_vector = next((embedding.vector for _, embedding in embeddings if embedding.vector), None)
            if not first_vector:
                return {**self.status(), "status": "fallback", "indexed_documents": 0, "fallback_documents": len(docs), "fallback_reason": "no embeddings"}

            client = QdrantClient(url=self.url, timeout=2)
            if not client.collection_exists(self.collection):
                client.create_collection(
                    collection_name=self.collection,
                    vectors_config=VectorParams(size=len(first_vector), distance=Distance.COSINE),
                )
            points = [
                PointStruct(
                    id=_stable_point_id(doc.get("chunk_id", doc["source_id"])),
                    vector=embedding.vector,
                    payload={
                        "chunkId": doc.get("chunk_id", doc["source_id"]),
                        "sourceId": doc["source_id"],
                        "destinationSlug": doc.get("destination_slug"),
                        "language": doc.get("language", "vi"),
                        "trustTier": doc.get("trust_tier", "sample"),
                        "content": doc["content"],
                    },
                )
                for doc, embedding in embeddings
            ]
            client.upsert(collection_name=self.collection, points=points)
            provider = "ollama" if all(embedding.available for _, embedding in embeddings) else "sample"
            return {**self.status(), "status": "ready", "indexed_documents": len(points), "fallback_documents": 0, "embedding_provider": provider}
        except Exception as exc:
            return {
                **self.status(),
                "status": "fallback",
                "indexed_documents": 0,
                "fallback_documents": len(docs),
                "fallback_reason": exc.__class__.__name__,
            }

    def search(self, query: str, limit: int = 4) -> list[dict[str, Any]]:
        if not self.enabled:
            return []
        try:
            from qdrant_client import QdrantClient

            embedding = self.embedder.embed(query)
            client = QdrantClient(url=self.url, timeout=2)
            hits = client.query_points(collection_name=self.collection, query=embedding.vector, limit=limit).points
            return [
                {
                    "source_id": str(hit.payload.get("sourceId", hit.payload.get("source_id", "unknown"))),
                    "chunk_id": str(hit.payload.get("chunkId", "unknown")),
                    "destination_slug": str(hit.payload.get("destinationSlug", "")),
                    "language": str(hit.payload.get("language", "vi")),
                    "trust_tier": str(hit.payload.get("trustTier", "sample")),
                    "content": str(hit.payload.get("content", "")),
                    "score": float(hit.score or 0),
                    "backend": "qdrant",
                }
                for hit in hits
                if hit.payload
            ]
        except Exception:
            return []


def retrieve(query: str, limit: int = 4) -> list[dict[str, Any]]:
    vector_docs = QdrantRagAdapter().search(query, limit)
    if vector_docs:
        return vector_docs
    return sample_retrieve(query, limit)


def sample_retrieve(query: str, limit: int = 4) -> list[dict[str, Any]]:
    terms = [term.lower() for term in query.split() if len(term) > 2]
    scored = []
    for doc in chunk_markdown_documents():
        content = doc["content"].lower()
        score = sum(1 for term in terms if term in content)
        if score:
            scored.append((score, doc))
    scored.sort(key=lambda item: item[0], reverse=True)
    return [{**doc, "score": score, "backend": "sample"} for score, doc in scored[:limit]]


def reindex_summary() -> dict[str, object]:
    docs = chunk_markdown_documents()
    index_result = QdrantRagAdapter().reindex(docs)
    return {
        "status": index_result["status"],
        "vector_db": "qdrant",
        "retrieval_backend": index_result["backend"],
        "collection": index_result["collection"],
        "embedding_model": index_result["embedding_model"],
        "documents": len(load_markdown_documents()),
        "chunks": len(docs),
        "indexed_documents": index_result["indexed_documents"],
        "fallback_documents": index_result["fallback_documents"],
        "fallback_reason": index_result.get("fallback_reason"),
        "requires_openai_api_key": False,
        "note": "Qdrant is used when enabled and reachable; otherwise local markdown sample retrieval remains active.",
    }


def _stable_point_id(source_id: str) -> int:
    return int(hashlib.sha256(source_id.encode("utf-8")).hexdigest()[:16], 16)


def _chunk_payload(source_id: str, content: str, index: int) -> dict[str, str]:
    stem = Path(source_id).stem
    parent = Path(source_id).parent.name
    return {
        "chunk_id": f"{stem}-{index:03d}",
        "source_id": source_id,
        "destination_slug": stem,
        "language": "vi" if parent == "vietnam" else "en",
        "trust_tier": "sample",
        "content": content,
    }
