import { Body, Controller, Post } from "@nestjs/common";
import { IsArray, IsIn, IsNumber, IsOptional, IsString } from "class-validator";
import { envelope, type BudgetSimulationInput, type TravelQuizAnswer, type TravelStyle } from "@vietwander/shared";
import { AiService } from "./ai.service";

class ChatDto {
  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  contextSlug?: string;
}

class ItineraryDto {
  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsNumber()
  durationDays?: number;

  @IsOptional()
  @IsString()
  style?: string;
}

class CompareDto {
  @IsArray()
  slugs!: string[];

  @IsOptional()
  @IsIn(["Food Hunter", "Culture Seeker", "Beach Lover", "Mountain Adventurer", "Luxury Escaper", "Budget Backpacker", "Family Planner", "World Wanderer"])
  style?: TravelStyle;
}

class BudgetDto implements BudgetSimulationInput {
  @IsString()
  destinationSlug!: string;

  @IsNumber()
  travelers!: number;

  @IsNumber()
  days!: number;

  @IsIn(["hostel", "comfort", "boutique", "luxury"])
  hotelLevel!: BudgetSimulationInput["hotelLevel"];

  @IsIn(["street", "balanced", "premium"])
  foodLevel!: BudgetSimulationInput["foodLevel"];

  @IsIn(["public", "mixed", "private"])
  transportLevel!: BudgetSimulationInput["transportLevel"];

  @IsIn(["slow", "balanced", "packed"])
  activityLevel!: BudgetSimulationInput["activityLevel"];
}

class PersonalityDto {
  @IsArray()
  answers!: TravelQuizAnswer[];
}

class MoodSearchDto {
  @IsString()
  query!: string;
}

@Controller("ai")
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post("chat")
  chat(@Body() body: ChatDto) {
    return envelope(this.ai.chat(body.message, body.contextSlug), "Local AI gateway response");
  }

  @Post("chat/stream")
  stream(@Body() body: ChatDto) {
    return envelope(this.ai.chat(body.message, body.contextSlug), "Streaming is mocked by the API; web can consume ai-service SSE for local runtime.");
  }

  @Post("itinerary")
  itinerary(@Body() body: ItineraryDto) {
    return envelope(this.ai.itinerary(body), "Itinerary generated");
  }

  @Post("budget")
  budget(@Body() body: { destinationSlug?: string; travelers?: number }) {
    return envelope(this.ai.budget(body.destinationSlug, body.travelers), "Budget estimated");
  }

  @Post("budget/simulate")
  simulateBudget(@Body() body: BudgetDto) {
    return envelope(this.ai.simulateBudget(body), "Budget simulation updated");
  }

  @Post("compare")
  compare(@Body() body: CompareDto) {
    return envelope(this.ai.compare(body.slugs, body.style), "Destinations compared");
  }

  @Post("personality")
  personality(@Body() body: PersonalityDto) {
    return envelope(this.ai.personality(body.answers), "Travel personality detected");
  }

  @Post("mood-search")
  moodSearch(@Body() body: MoodSearchDto) {
    return envelope(this.ai.moodSearch(body.query), "Mood search converted into filters");
  }

  @Post("reindex")
  reindex() {
    return envelope({ jobId: "mock-reindex-job", vectorDb: "qdrant", status: "queued" }, "AI reindex queued");
  }
}
