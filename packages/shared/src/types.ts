export type Role = "USER" | "HOST" | "GUIDE" | "ADMIN";

export type TravelStyle =
  | "Food Hunter"
  | "Culture Seeker"
  | "Beach Lover"
  | "Mountain Adventurer"
  | "Luxury Escaper"
  | "Budget Backpacker"
  | "Family Planner"
  | "World Wanderer";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  meta?: Record<string, unknown>;
}

export interface Review {
  author: string;
  rating: number;
  text: string;
}

export interface HotelMock {
  name: string;
  nightlyPrice: number;
  rating: number;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  city: string;
  summary: string;
  longDescription: string;
  bestTimeToVisit: string;
  budgetMin: number;
  budgetMax: number;
  currency: "VND";
  travelStyles: string[];
  tags: string[];
  latitude: number;
  longitude: number;
  safetyLevel: "low" | "medium" | "high";
  cultureNotes: string[];
  foodHighlights: string[];
  ratingAvg: number;
  reviewCount: number;
  isFeatured: boolean;
  imagePrompt: string;
  experiences: string[];
  hotelsMock: HotelMock[];
  reviews: Review[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  morning: string[];
  afternoon: string[];
  evening: string[];
  food: string[];
  estimatedCost: number;
}

export interface TripPlan {
  destination: string;
  durationDays: number;
  style: string;
  budgetLevel: "budget" | "mid-range" | "luxury";
  days: ItineraryDay[];
  budgetBreakdown: {
    hotel: number;
    food: number;
    transport: number;
    activities: number;
  };
  safetyNotes: string[];
  packingList: string[];
}

export interface AiCitation {
  title: string;
  sourceId: string;
  chunkId: string;
  url?: string;
  trustTier?: "official" | "curated" | "sample";
  language?: "vi" | "en";
}

export interface AiAnswer {
  summary: string;
  answer: string;
  citations: AiCitation[];
  itineraryDraft?: TripPlan;
  toolCalls: Array<{ name: string; status: "ok" | "error"; summary: string }>;
  safety: { grounded: boolean; confidence: "low" | "medium" | "high" };
}

export interface AiProviderStatus {
  runtime: "local";
  chatProvider: "ollama" | "sample";
  model: string;
  embeddingProvider: "ollama" | "sample";
  vectorDb: "qdrant" | "sample";
  available: boolean;
  fallback: boolean;
  requiresOpenAiApiKey: false;
  note: string;
}

export interface AiClarifyingQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface AiQuickAction {
  id: "save_answer" | "convert_to_itinerary" | "add_destination" | "estimate_budget" | "reindex_knowledge";
  label: string;
  href?: string;
}

export interface AiChatStructuredAnswer {
  summary: string;
  answer: string;
  destination: string;
  travelStyle: TravelStyle;
  clarifyingQuestions: AiClarifyingQuestion[];
  itinerary: TripPlan;
  budget: BudgetSimulationResult;
  foods: string[];
  hotels: HotelMock[];
  experiences: string[];
  packingList: string[];
  safetyNotes: string[];
  culturalNotes: string[];
  citations: AiCitation[];
  toolCalls: Array<{ name: string; status: "ok" | "error"; summary: string }>;
  quickActions: AiQuickAction[];
  provider: AiProviderStatus;
  realtimeWarning?: string;
}

export interface RagKnowledgeChunk {
  chunkId: string;
  sourceId: string;
  destinationSlug?: string;
  language: "vi" | "en";
  trustTier: "official" | "curated" | "sample";
  content: string;
}

export interface RagReindexResult {
  status: "ready" | "fallback" | "queued";
  vectorDb: "qdrant";
  retrievalBackend: "qdrant" | "sample";
  collection: string;
  embeddingModel: string;
  documents: number;
  chunks: number;
  indexedDocuments: number;
  fallbackDocuments: number;
  fallbackReason?: string;
  requiresOpenAiApiKey: false;
}

export interface TravelQuizAnswer {
  id: string;
  value: string;
}

export interface TravelPersonalityResult {
  style: TravelStyle;
  score: number;
  description: string;
  traits: string[];
  recommendedDestinationSlugs: string[];
}

export interface BudgetSimulationInput {
  destinationSlug: string;
  travelers: number;
  days: number;
  hotelLevel: "hostel" | "comfort" | "boutique" | "luxury";
  foodLevel: "street" | "balanced" | "premium";
  transportLevel: "public" | "mixed" | "private";
  activityLevel: "slow" | "balanced" | "packed";
}

export interface BudgetSimulationResult {
  destination: string;
  total: number;
  perPerson: number;
  currency: "VND";
  breakdown: {
    hotel: number;
    food: number;
    transport: number;
    activities: number;
  };
  adjustmentNotes: string[];
  itineraryBias: string;
}

export interface DestinationComparison {
  slug: string;
  destination: string;
  budgetRange: string;
  bestSeason: string;
  activityFit: number;
  foodFit: number;
  familyFit: number;
  nightlifeFit: number;
  safetyFit: number;
  aiScore: number;
  verdict: string;
}

export interface MoodSearchResult {
  query: string;
  inferredFilters: {
    tags: string[];
    styles: string[];
    pace: "chill" | "balanced" | "packed";
    budget: "budget" | "mid-range" | "luxury";
  };
  destinations: Destination[];
}
