import { Injectable } from "@nestjs/common";
import { buildDemoItinerary, destinations, localAiAnswer } from "@vietwander/shared";

@Injectable()
export class AiService {
  chat(message: string, contextSlug?: string) {
    const enriched = contextSlug ? message + " " + contextSlug : message;
    return localAiAnswer(enriched);
  }

  itinerary(input: { destination?: string; durationDays?: number; style?: string }) {
    const destination = destinations.find((item) => item.slug === input.destination || item.name.toLowerCase().includes((input.destination ?? "da nang").toLowerCase())) ?? destinations[5];
    return buildDemoItinerary(destination, input.durationDays ?? 4);
  }

  budget(destinationSlug = "da-nang", travelers = 2) {
    const destination = destinations.find((item) => item.slug === destinationSlug) ?? destinations[5];
    return {
      destination: destination.name,
      travelers,
      low: destination.budgetMin * travelers,
      high: destination.budgetMax * travelers,
      currency: "VND",
      note: "Mock/local estimate. No real-time flight, hotel, or visa data."
    };
  }

  compare(slugs: string[]) {
    return slugs.map((slug) => {
      const item = destinations.find((destination) => destination.slug === slug) ?? destinations[0];
      return {
        destination: item.name,
        budget: item.budgetMin + "-" + item.budgetMax + " VND",
        bestTime: item.bestTimeToVisit,
        food: item.foodHighlights.join(", "),
        safety: item.safetyLevel,
        aiScore: Math.round(item.ratingAvg * 18)
      };
    });
  }
}
