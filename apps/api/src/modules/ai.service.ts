import { Injectable } from "@nestjs/common";
import {
  buildDemoItinerary,
  buildStructuredLocalAiAnswer,
  compareDestinations,
  destinations,
  moodSearch,
  simulateBudget,
  detectTravelStyle,
  type AiChatStructuredAnswer,
  type BudgetSimulationInput,
  type RagReindexResult,
  type TravelQuizAnswer,
  type TravelStyle,
  type TripPlan
} from "@vietwander/shared";

@Injectable()
export class AiService {
  private readonly aiServiceUrl = process.env.AI_SERVICE_URL ?? "http://localhost:8010";

  async chat(message: string, contextSlug?: string): Promise<AiChatStructuredAnswer> {
    const fallback = buildStructuredLocalAiAnswer(message, contextSlug);
    const response = await this.postLocal<{ data?: unknown }>("/chat", { message, context_slug: contextSlug });
    if (!response?.data || !isRecord(response.data)) {
      return fallback;
    }
    return normalizeStructuredAnswer(response.data, fallback);
  }

  async itinerary(input: { destination?: string; durationDays?: number; style?: string }): Promise<TripPlan> {
    const proxied = await this.postLocal<{ data?: unknown }>("/itinerary/generate", {
      destination: input.destination ?? "da-nang",
      duration_days: input.durationDays ?? 4,
      style: input.style ?? "Culture Seeker"
    });
    if (proxied?.data && isRecord(proxied.data)) {
      return normalizeTripPlan(proxied.data, this.localItinerary(input));
    }
    return this.localItinerary(input);
  }

  localItinerary(input: { destination?: string; durationDays?: number; style?: string }) {
    const destination = destinations.find((item) => item.slug === input.destination || item.name.toLowerCase().includes((input.destination ?? "da nang").toLowerCase())) ?? destinations[5];
    return buildDemoItinerary(destination, input.durationDays ?? 4);
  }

  budget(destinationSlug = "da-nang", travelers = 2) {
    return simulateBudget({
      destinationSlug,
      travelers,
      days: 4,
      hotelLevel: "comfort",
      foodLevel: "balanced",
      transportLevel: "mixed",
      activityLevel: "balanced"
    });
  }

  simulateBudget(input: BudgetSimulationInput) {
    return simulateBudget(input);
  }

  compare(slugs: string[], style?: TravelStyle) {
    return compareDestinations(slugs, style);
  }

  personality(answers: TravelQuizAnswer[] | string) {
    return detectTravelStyle(answers);
  }

  moodSearch(query: string) {
    return moodSearch(query);
  }

  async reindex(force = false): Promise<RagReindexResult> {
    const proxied = await this.postLocal<{ data?: unknown }>("/rag/reindex", { force });
    if (proxied?.data && isRecord(proxied.data)) {
      return normalizeReindex(proxied.data);
    }
    return {
      status: "queued",
      vectorDb: "qdrant",
      retrievalBackend: "sample",
      collection: "vietwander_travel",
      embeddingModel: "nomic-embed-text",
      documents: 0,
      chunks: 0,
      indexedDocuments: 0,
      fallbackDocuments: 0,
      fallbackReason: "ai-service offline",
      requiresOpenAiApiKey: false
    };
  }

  private async postLocal<T>(path: string, body: Record<string, unknown>): Promise<T | undefined> {
    try {
      const response = await fetch(`${this.aiServiceUrl}${path}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(1800)
      });
      if (!response.ok) return undefined;
      return (await response.json()) as T;
    } catch {
      return undefined;
    }
  }
}

function normalizeStructuredAnswer(raw: Record<string, unknown>, fallback: AiChatStructuredAnswer): AiChatStructuredAnswer {
  const provider = isRecord(raw.provider) ? raw.provider : {};
  return {
    ...fallback,
    summary: stringValue(raw.summary, fallback.summary),
    answer: stringValue(raw.answer, fallback.answer),
    destination: stringValue(raw.destination, fallback.destination),
    travelStyle: stringValue(raw.travel_style, fallback.travelStyle) as AiChatStructuredAnswer["travelStyle"],
    clarifyingQuestions: arrayValue(raw.clarifying_questions, fallback.clarifyingQuestions),
    itinerary: isRecord(raw.itinerary) ? normalizeTripPlan(raw.itinerary, fallback.itinerary) : fallback.itinerary,
    budget: isRecord(raw.budget)
      ? {
          ...fallback.budget,
          total: numberValue(raw.budget.low, fallback.budget.total),
          perPerson: Math.round(numberValue(raw.budget.low, fallback.budget.perPerson) / 2),
          adjustmentNotes: [stringValue(raw.budget.note, "Dữ liệu ngân sách là mẫu local.")]
        }
      : fallback.budget,
    foods: arrayValue(raw.foods, fallback.foods),
    hotels: arrayValue(raw.hotels, fallback.hotels),
    experiences: arrayValue(raw.experiences, fallback.experiences),
    packingList: arrayValue(raw.packing_list, fallback.packingList),
    safetyNotes: arrayValue(raw.safety_notes, fallback.safetyNotes),
    culturalNotes: arrayValue(raw.cultural_notes, fallback.culturalNotes),
    citations: normalizeCitations(raw.citations, fallback.citations),
    toolCalls: arrayValue(raw.tool_calls, fallback.toolCalls),
    quickActions: arrayValue(raw.quick_actions, fallback.quickActions),
    provider: {
      runtime: "local",
      chatProvider: stringValue(provider.chat_provider, fallback.provider.chatProvider) as "ollama" | "sample",
      model: stringValue(provider.model, fallback.provider.model),
      embeddingProvider: stringValue(provider.embedding_provider, fallback.provider.embeddingProvider) as "ollama" | "sample",
      vectorDb: stringValue(provider.vector_db, fallback.provider.vectorDb) as "qdrant" | "sample",
      available: booleanValue(provider.available, fallback.provider.available),
      fallback: booleanValue(provider.fallback, fallback.provider.fallback),
      requiresOpenAiApiKey: false,
      note: stringValue(provider.note, fallback.provider.note)
    },
    realtimeWarning: raw.realtime_warning === null ? undefined : stringValue(raw.realtime_warning, fallback.realtimeWarning ?? "")
  };
}

function normalizeTripPlan(raw: Record<string, unknown>, fallback: TripPlan): TripPlan {
  const budgetBreakdown = isRecord(raw.budget_breakdown) ? raw.budget_breakdown : {};
  return {
    ...fallback,
    destination: stringValue(raw.destination, fallback.destination),
    durationDays: numberValue(raw.duration_days, fallback.durationDays),
    style: stringValue(raw.style, fallback.style),
    budgetLevel: stringValue(raw.budget_level, fallback.budgetLevel) as TripPlan["budgetLevel"],
    days: Array.isArray(raw.days)
      ? raw.days.filter(isRecord).map((day, index) => ({
          day: numberValue(day.day, index + 1),
          title: stringValue(day.title, fallback.days[index]?.title ?? `Ngày ${index + 1}`),
          morning: arrayValue(day.morning, fallback.days[index]?.morning ?? []),
          afternoon: arrayValue(day.afternoon, fallback.days[index]?.afternoon ?? []),
          evening: arrayValue(day.evening, fallback.days[index]?.evening ?? []),
          food: arrayValue(day.food, fallback.days[index]?.food ?? []),
          estimatedCost: numberValue(day.estimated_cost, fallback.days[index]?.estimatedCost ?? 0)
        }))
      : fallback.days,
    budgetBreakdown: {
      hotel: numberValue(budgetBreakdown.hotel, fallback.budgetBreakdown.hotel),
      food: numberValue(budgetBreakdown.food, fallback.budgetBreakdown.food),
      transport: numberValue(budgetBreakdown.transport, fallback.budgetBreakdown.transport),
      activities: numberValue(budgetBreakdown.activities, fallback.budgetBreakdown.activities)
    },
    safetyNotes: arrayValue(raw.safety_notes, fallback.safetyNotes),
    packingList: arrayValue(raw.packing_list, fallback.packingList)
  };
}

function normalizeReindex(raw: Record<string, unknown>): RagReindexResult {
  return {
    status: stringValue(raw.status, "fallback") as RagReindexResult["status"],
    vectorDb: "qdrant",
    retrievalBackend: stringValue(raw.retrieval_backend, "sample") as "qdrant" | "sample",
    collection: stringValue(raw.collection, "vietwander_travel"),
    embeddingModel: stringValue(raw.embedding_model, "nomic-embed-text"),
    documents: numberValue(raw.documents, 0),
    chunks: numberValue(raw.chunks, numberValue(raw.documents, 0)),
    indexedDocuments: numberValue(raw.indexed_documents, 0),
    fallbackDocuments: numberValue(raw.fallback_documents, 0),
    fallbackReason: stringValue(raw.fallback_reason, ""),
    requiresOpenAiApiKey: false
  };
}

function normalizeCitations(value: unknown, fallback: AiChatStructuredAnswer["citations"]) {
  if (!Array.isArray(value)) return fallback;
  return value.filter(isRecord).map((item) => ({
    title: stringValue(item.title, stringValue(item.source_id, "Knowledge base")),
    sourceId: stringValue(item.source_id, "unknown"),
    chunkId: stringValue(item.chunk_id, "unknown"),
    language: stringValue(item.language, "vi") as "vi" | "en",
    trustTier: stringValue(item.trust_tier, "sample") as "official" | "curated" | "sample"
  }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function numberValue(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function booleanValue(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function arrayValue<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}
