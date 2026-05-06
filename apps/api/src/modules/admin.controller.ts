import { Controller, Get, Post } from "@nestjs/common";
import { destinations, envelope } from "@vietwander/shared";

@Controller("admin")
export class AdminController {
  @Get("analytics")
  analytics() {
    return envelope({
      topSearchedDestinations: destinations.slice(0, 5).map((item) => item.name),
      conversionFunnelMock: { visits: 12840, plannerStarts: 2840, mockBookings: 312 },
      bookingTrend: [12, 18, 22, 31, 46, 52],
      chatbotQuestionCategories: { itinerary: 45, budget: 28, food: 18, safety: 9 },
      popularTravelStyles: ["Food Hunter", "Culture Seeker", "Beach Lover"]
    });
  }

  @Get("destinations")
  adminDestinations() {
    return envelope(destinations, "Admin destinations loaded");
  }

  @Post("ai-knowledge/reindex")
  reindex() {
    return envelope({ jobId: "admin-reindex-local", status: "queued" }, "Knowledge reindex queued");
  }
}
