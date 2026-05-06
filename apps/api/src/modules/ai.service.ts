import { Injectable } from "@nestjs/common";
import { buildDemoItinerary, compareDestinations, destinations, localAiAnswer, moodSearch, simulateBudget, detectTravelStyle, type BudgetSimulationInput, type TravelQuizAnswer, type TravelStyle } from "@vietwander/shared";

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
}
