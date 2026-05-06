import { describe, expect, it } from "vitest";
import { AiService } from "./ai.service";
import { BookingService } from "./booking.service";
import { DestinationsService } from "./destinations.service";

describe("api services", () => {
  it("searches destinations", () => {
    const service = new DestinationsService();
    expect(service.search("Đà Nẵng")[0]?.slug).toBe("da-nang");
  });

  it("creates mock-only payments", () => {
    const booking = new BookingService().create({ itemName: "Demo tour", amount: 1000000, method: "MOCK_MOMO" });
    expect(booking.isDemo).toBe(true);
    expect(booking.warning).toContain("no real transaction");
  });

  it("returns hallucination guard for realtime queries", () => {
    const answer = new AiService().chat("current weather and flight price to Paris");
    expect(answer.answer).toContain("do not have live");
  });
});
