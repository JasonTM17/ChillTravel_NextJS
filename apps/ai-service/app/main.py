from __future__ import annotations

import json
from typing import Any

from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .providers import OllamaChatProvider, provider_health
from .rag import reindex_summary, retrieve
from .travel_tools import build_itinerary, build_structured_chat_answer, compare_destinations, estimate_budget, mood_search, suggest_destination, travel_personality


app = FastAPI(title="CHILLTRAVEL Local Service", version="0.1.0")


class ChatRequest(BaseModel):
    message: str
    context_slug: str | None = None


class ItineraryRequest(BaseModel):
    destination: str = "da-nang"
    duration_days: int = 3
    travelers: int = 2
    style: str = "Culture Seeker"


class PersonalityRequest(BaseModel):
    text: str


class CompareRequest(BaseModel):
    slugs: list[str]


class MoodSearchRequest(BaseModel):
    query: str


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "success": True,
        "data": {"status": "ok", **provider_health()},
        "message": "AI service healthy",
    }


@app.post("/chat")
def chat(request: ChatRequest) -> dict[str, Any]:
    query = f"{request.message} {request.context_slug or ''}".strip()
    docs = retrieve(query)
    provider_result = OllamaChatProvider().generate(query) if _use_ollama_chat() else None
    provider = {
        "chat_provider": "ollama" if provider_result and provider_result.available else "sample",
        "model": provider_result.model if provider_result else "local-tools",
        "available": bool(provider_result and provider_result.available),
        "fallback": not bool(provider_result and provider_result.available),
    }
    answer = build_structured_chat_answer(query, docs, provider)
    if provider_result and provider_result.text:
        answer["provider_answer"] = provider_result.text
    return {"success": True, "data": answer, "message": "Local RAG answer"}


@app.post("/chat/stream")
def chat_stream(request: ChatRequest) -> StreamingResponse:
    payload = chat(request)["data"]

    def event_stream():
        for key in ["summary", "answer", "citations", "quick_actions", "provider"]:
            yield "data: " + json.dumps({"type": key, "value": payload.get(key)}, ensure_ascii=False) + "\n\n"
        yield "data: " + json.dumps({"type": "done", "value": payload}, ensure_ascii=False) + "\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.post("/itinerary/generate")
def itinerary(request: ItineraryRequest) -> dict[str, Any]:
    destination = suggest_destination(request.destination)
    return {"success": True, "data": build_itinerary(destination, request.duration_days, request.style), "message": "Itinerary generated"}


@app.post("/budget/estimate")
def budget(request: ItineraryRequest) -> dict[str, Any]:
    destination = suggest_destination(request.destination)
    return {"success": True, "data": estimate_budget(destination, request.duration_days, request.travelers), "message": "Budget estimated"}


@app.post("/personality/detect")
def personality(request: PersonalityRequest) -> dict[str, Any]:
    return {"success": True, "data": travel_personality(request.text), "message": "Travel personality detected"}


@app.post("/compare")
def compare(request: CompareRequest) -> dict[str, Any]:
    return {"success": True, "data": compare_destinations(request.slugs), "message": "Destinations compared"}


@app.post("/mood-search")
def mood(request: MoodSearchRequest) -> dict[str, Any]:
    return {"success": True, "data": mood_search(request.query), "message": "Mood converted to local filters"}


@app.post("/rag/reindex")
def reindex() -> dict[str, Any]:
    return {"success": True, "data": reindex_summary(), "message": "Reindex summary created"}


@app.post("/dataset/import")
def dataset_import() -> dict[str, Any]:
    return {"success": True, "data": {"status": "accepted", "mode": "local/sample"}, "message": "Dataset import accepted"}


def _use_ollama_chat() -> bool:
    import os

    return os.getenv("CHILLTRAVEL_USE_OLLAMA_CHAT", "").lower() in {"1", "true", "yes"}
