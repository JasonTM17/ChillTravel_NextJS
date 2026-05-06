import { describe, expect, it } from "vitest";
import { destinations } from "./seed";
import { localAiAnswer } from "./ai-tools";

describe("seed data", () => {
  it("contains rich Vietnam and world destinations", () => {
    expect(destinations.length).toBeGreaterThanOrEqual(26);
    expect(destinations.find((item) => item.slug === "da-nang")?.foodHighlights.length).toBeGreaterThan(1);
  });

  it("guards real-time travel questions", () => {
    const answer = localAiAnswer("giá vé bay real-time đi Paris và visa hôm nay");
    expect(answer.answer).toContain("do not have live");
    expect(answer.safety.confidence).toBe("medium");
  });
});
