import { destinations } from "./seed";
import type { AiAnswer, Destination, TripPlan } from "./types";

export const aiToolNames = [
  "suggest_destination",
  "build_itinerary",
  "estimate_budget",
  "find_local_food",
  "find_hotels_mock",
  "find_experiences_mock",
  "compare_destinations",
  "generate_packing_list",
  "detect_travel_style",
  "answer_from_knowledge_base"
] as const;

export type AiToolName = (typeof aiToolNames)[number];

export function findDestination(query: string): Destination | undefined {
  const normalized = query.toLowerCase();
  return destinations.find((destination) => {
    return destination.name.toLowerCase().includes(normalized) || normalized.includes(destination.name.toLowerCase()) || normalized.includes(destination.slug);
  });
}

export function buildDemoItinerary(destination: Destination, durationDays = 3): TripPlan {
  const days = Array.from({ length: durationDays }, (_, index) => ({
    day: index + 1,
    title: index === 0 ? destination.name + " arrival and local rhythm" : destination.name + " day " + (index + 1) + " discovery",
    morning: [destination.experiences[index % destination.experiences.length], "Slow breakfast and neighborhood walk"],
    afternoon: ["Signature attraction route", "Cafe or rest stop with budget check"],
    evening: ["Local dinner", "Culture guard reminder and next-day prep"],
    food: destination.foodHighlights.slice(0, 3),
    estimatedCost: Math.round((destination.budgetMin + destination.budgetMax) / 2 / Math.max(durationDays, 1))
  }));

  return {
    destination: destination.name,
    durationDays,
    style: destination.travelStyles.join(", "),
    budgetLevel: destination.budgetMax > 7000000 ? "luxury" : destination.budgetMin < 900000 ? "budget" : "mid-range",
    days,
    budgetBreakdown: {
      hotel: Math.round(destination.budgetMin * 0.45),
      food: Math.round(destination.budgetMin * 0.2),
      transport: Math.round(destination.budgetMin * 0.18),
      activities: Math.round(destination.budgetMin * 0.17)
    },
    safetyNotes: destination.cultureNotes,
    packingList: ["Comfortable walking shoes", "Reusable water bottle", "Light rain layer", "Offline itinerary pack"]
  };
}

export function localAiAnswer(query: string): AiAnswer {
  const destination = findDestination(query) ?? destinations[5];
  const realTimePattern = /(real-time|realtime|current|today|flight price|visa|weather now|giá vé bay|visa|thời tiết hiện tại)/i;
  const limited = realTimePattern.test(query);
  const itinerary = buildDemoItinerary(destination, /5/.test(query) ? 5 : /4/.test(query) ? 4 : 3);
  return {
    summary: limited
      ? "This is a local knowledge-base answer. Real-time prices, visa rules, and current weather must be checked with official sources."
      : "A grounded local RAG-style travel answer using VietWander sample knowledge.",
    answer: limited
      ? "I do not have live flight, visa, or current weather data in the local runtime. I can still build a sample plan and budget, but you should verify real-time details with official providers."
      : "I recommend " + destination.name + " for this travel style. Start with food, culture, and a balanced pace, then adjust hotel and transport choices with the Smart Budget Simulator.",
    citations: [
      { title: "VietWander knowledge: " + destination.name, sourceId: "destinations/" + destination.slug + ".md", chunkId: destination.slug + "-overview" }
    ],
    itineraryDraft: itinerary,
    toolCalls: [
      { name: "answer_from_knowledge_base", status: "ok", summary: "Retrieved curated local sample knowledge." },
      { name: "build_itinerary", status: "ok", summary: "Created structured day-by-day itinerary." },
      { name: "estimate_budget", status: "ok", summary: "Estimated demo cost bands without real payment data." }
    ],
    safety: { grounded: !limited, confidence: limited ? "medium" : "high" }
  };
}
