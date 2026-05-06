import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { IsBoolean, IsOptional } from "class-validator";
import { destinations, envelope } from "@vietwander/shared";
import { JwtAuthGuard, Roles, RolesGuard } from "./security";

class AdminReindexDto {
  @IsOptional()
  @IsBoolean()
  force?: boolean;
}

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
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
  reindex(@Body() body: AdminReindexDto = {}) {
    return envelope({ jobId: "admin-reindex-local", status: "queued", forced: body.force === true }, "Knowledge reindex queued");
  }
}
