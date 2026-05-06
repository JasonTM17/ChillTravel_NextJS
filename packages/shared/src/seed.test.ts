import { describe, expect, it } from "vitest";
import { destinations } from "./seed";
import { compareDestinations, detectTravelStyle, localAiAnswer, moodSearch, simulateBudget } from "./ai-tools";

describe("seed data and travel intelligence", () => {
  it("contains rich Vietnam and world destinations", () => {
    expect(destinations.length).toBeGreaterThanOrEqual(26);
    expect(destinations.find((item) => item.slug === "da-nang")?.foodHighlights.length).toBeGreaterThan(1);
  });

  it("guards real-time travel questions", () => {
    const answer = localAiAnswer("gia ve bay real-time di Paris va visa hom nay");
    expect(answer.answer).toContain("do not have live");
    expect(answer.safety.confidence).toBe("medium");
  });

  it("detects travel personality and recommends destinations", () => {
    const result = detectTravelStyle("I want street food, markets, cafes and local meals");
    expect(result.style).toBe("Food Hunter");
    expect(result.recommendedDestinationSlugs.length).toBeGreaterThan(0);
  });

  it("simulates budget by travel choices", () => {
    const budget = simulateBudget({
      destinationSlug: "da-nang",
      travelers: 2,
      days: 4,
      hotelLevel: "boutique",
      foodLevel: "balanced",
      transportLevel: "mixed",
      activityLevel: "packed"
    });
    expect(budget.total).toBeGreaterThan(budget.perPerson);
    expect(budget.breakdown.hotel).toBeGreaterThan(0);
  });

  it("compares destinations and converts mood search to filters", () => {
    const comparison = compareDestinations(["da-nang", "bali", "paris"], "Food Hunter");
    expect(comparison).toHaveLength(3);
    expect(comparison[0]?.aiScore).toBeGreaterThan(0);

    const mood = moodSearch("yen binh co bien va an ngon");
    expect(mood.inferredFilters.pace).toBe("chill");
    expect(mood.destinations.length).toBeGreaterThan(0);
  });
});
