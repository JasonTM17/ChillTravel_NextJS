import { buildStructuredLocalAiAnswer, type AiChatStructuredAnswer } from "@vietwander/shared";

const aiServiceUrl = process.env.AI_SERVICE_URL ?? "http://localhost:8010";

export async function getStructuredChatAnswer(message: string, contextSlug?: string): Promise<AiChatStructuredAnswer> {
  const fallback = buildStructuredLocalAiAnswer(message, contextSlug);
  try {
    const response = await fetch(`${aiServiceUrl}/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message, context_slug: contextSlug }),
      signal: AbortSignal.timeout(1800)
    });
    if (!response.ok) return fallback;
    const payload = (await response.json()) as { data?: unknown };
    if (!payload.data || typeof payload.data !== "object" || Array.isArray(payload.data)) {
      return fallback;
    }
    return normalizeFastApiAnswer(payload.data as Record<string, unknown>, fallback);
  } catch {
    return fallback;
  }
}

export async function getReindexStatus() {
  try {
    const response = await fetch(`${aiServiceUrl}/rag/reindex`, {
      method: "POST",
      signal: AbortSignal.timeout(1800)
    });
    if (!response.ok) throw new Error("ai-service unavailable");
    return (await response.json()) as { data?: unknown };
  } catch {
    return {
      data: {
        status: "fallback",
        vector_db: "qdrant",
        retrieval_backend: "sample",
        collection: "vietwander_travel",
        embedding_model: "nomic-embed-text",
        documents: 0,
        chunks: 0,
        indexed_documents: 0,
        fallback_documents: 0,
        fallback_reason: "ai-service offline",
        requires_openai_api_key: false
      }
    };
  }
}

function normalizeFastApiAnswer(raw: Record<string, unknown>, fallback: AiChatStructuredAnswer): AiChatStructuredAnswer {
  const provider = record(raw.provider);
  return {
    ...fallback,
    summary: text(raw.summary, fallback.summary),
    answer: text(raw.answer, fallback.answer),
    destination: text(raw.destination, fallback.destination),
    travelStyle: text(raw.travel_style, fallback.travelStyle) as AiChatStructuredAnswer["travelStyle"],
    clarifyingQuestions: array(raw.clarifying_questions, fallback.clarifyingQuestions),
    itinerary: normalizeTrip(record(raw.itinerary), fallback.itinerary),
    foods: array(raw.foods, fallback.foods),
    hotels: array(raw.hotels, fallback.hotels),
    experiences: array(raw.experiences, fallback.experiences),
    packingList: array(raw.packing_list, fallback.packingList),
    safetyNotes: array(raw.safety_notes, fallback.safetyNotes),
    culturalNotes: array(raw.cultural_notes, fallback.culturalNotes),
    citations: array(raw.citations, fallback.citations).map((citation) => {
      const item = record(citation);
      return {
        title: text(item.title, text(item.source_id, "Knowledge base")),
        sourceId: text(item.source_id, "unknown"),
        chunkId: text(item.chunk_id, "unknown"),
        language: text(item.language, "vi") as "vi" | "en",
        trustTier: text(item.trust_tier, "sample") as "official" | "curated" | "sample"
      };
    }),
    toolCalls: array(raw.tool_calls, fallback.toolCalls),
    quickActions: array(raw.quick_actions, fallback.quickActions),
    provider: {
      runtime: "local",
      chatProvider: text(provider.chat_provider, fallback.provider.chatProvider) as "ollama" | "sample",
      model: text(provider.model, fallback.provider.model),
      embeddingProvider: text(provider.embedding_provider, fallback.provider.embeddingProvider) as "ollama" | "sample",
      vectorDb: text(provider.vector_db, fallback.provider.vectorDb) as "qdrant" | "sample",
      available: bool(provider.available, fallback.provider.available),
      fallback: bool(provider.fallback, fallback.provider.fallback),
      requiresOpenAiApiKey: false,
      note: text(provider.note, fallback.provider.note)
    },
    realtimeWarning: raw.realtime_warning === null ? undefined : text(raw.realtime_warning, fallback.realtimeWarning ?? "")
  };
}

function normalizeTrip(raw: Record<string, unknown>, fallback: AiChatStructuredAnswer["itinerary"]) {
  return {
    ...fallback,
    destination: text(raw.destination, fallback.destination),
    durationDays: number(raw.duration_days, fallback.durationDays),
    style: text(raw.style, fallback.style),
    days: Array.isArray(raw.days)
      ? raw.days.map((day, index) => {
          const item = record(day);
          return {
            day: number(item.day, index + 1),
            title: text(item.title, fallback.days[index]?.title ?? `Ngày ${index + 1}`),
            morning: array(item.morning, fallback.days[index]?.morning ?? []),
            afternoon: array(item.afternoon, fallback.days[index]?.afternoon ?? []),
            evening: array(item.evening, fallback.days[index]?.evening ?? []),
            food: array(item.food, fallback.days[index]?.food ?? []),
            estimatedCost: number(item.estimated_cost, fallback.days[index]?.estimatedCost ?? 0)
          };
        })
      : fallback.days
  };
}

function record(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function bool(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function number(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function array<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}
