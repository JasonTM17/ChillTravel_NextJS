from __future__ import annotations

import hashlib
import os
from dataclasses import dataclass
from typing import Any


DEFAULT_OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
DEFAULT_CHAT_MODEL = os.getenv("OLLAMA_CHAT_MODEL", "qwen3:4b")
DEFAULT_EMBED_MODEL = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")
DEFAULT_QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
DEFAULT_QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION", "vietwander_travel")


@dataclass(frozen=True)
class ProviderResult:
    text: str | None
    provider: str
    model: str
    available: bool
    error: str | None = None


@dataclass(frozen=True)
class EmbeddingResult:
    vector: list[float]
    provider: str
    model: str
    available: bool
    error: str | None = None


class OllamaChatProvider:
    def __init__(self, base_url: str = DEFAULT_OLLAMA_BASE_URL, model: str = DEFAULT_CHAT_MODEL, timeout: float = 1.5):
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.timeout = timeout

    def generate(self, prompt: str, system: str | None = None) -> ProviderResult:
        payload: dict[str, Any] = {"model": self.model, "prompt": prompt, "stream": False}
        if system:
            payload["system"] = system
        try:
            import httpx

            response = httpx.post(f"{self.base_url}/api/generate", json=payload, timeout=self.timeout)
            response.raise_for_status()
            data = response.json()
            text = data.get("response")
            return ProviderResult(text=text if isinstance(text, str) else None, provider="ollama", model=self.model, available=True)
        except Exception as exc:
            return ProviderResult(text=None, provider="ollama", model=self.model, available=False, error=exc.__class__.__name__)


class OllamaEmbeddingProvider:
    def __init__(self, base_url: str = DEFAULT_OLLAMA_BASE_URL, model: str = DEFAULT_EMBED_MODEL, timeout: float = 1.5):
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.timeout = timeout

    def embed(self, text: str) -> EmbeddingResult:
        try:
            import httpx

            response = httpx.post(f"{self.base_url}/api/embeddings", json={"model": self.model, "prompt": text}, timeout=self.timeout)
            response.raise_for_status()
            data = response.json()
            embedding = data.get("embedding")
            if isinstance(embedding, list) and all(isinstance(value, (int, float)) for value in embedding):
                return EmbeddingResult(vector=[float(value) for value in embedding], provider="ollama", model=self.model, available=True)
            return EmbeddingResult(vector=fallback_embedding(text), provider="sample", model="hash-embedding", available=False, error="InvalidEmbedding")
        except Exception as exc:
            return EmbeddingResult(vector=fallback_embedding(text), provider="sample", model="hash-embedding", available=False, error=exc.__class__.__name__)


def fallback_embedding(text: str, dimensions: int = 64) -> list[float]:
    digest = hashlib.sha256(text.encode("utf-8")).digest()
    values = list(digest) * ((dimensions // len(digest)) + 1)
    return [round((value / 255.0) * 2 - 1, 6) for value in values[:dimensions]]


def provider_health() -> dict[str, Any]:
    return {
        "runtime": "local",
        "ollama_base_url": DEFAULT_OLLAMA_BASE_URL,
        "chat_model": DEFAULT_CHAT_MODEL,
        "embed_model": DEFAULT_EMBED_MODEL,
        "qdrant_url": DEFAULT_QDRANT_URL,
        "qdrant_collection": DEFAULT_QDRANT_COLLECTION,
        "fallback": "sample markdown retrieval is used when Ollama or Qdrant are unavailable",
        "requires_openai_api_key": False,
    }
