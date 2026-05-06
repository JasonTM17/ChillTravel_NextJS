import { Body, Controller, Post } from "@nestjs/common";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { envelope, type BudgetSimulationInput, type TravelQuizAnswer, type TravelStyle } from "@vietwander/shared";
import { AiService } from "./ai.service";

class ChatDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  message!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  contextSlug?: string;
}

class ItineraryDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  destination?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(30)
  durationDays?: number;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  style?: string;
}

class CompareDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  slugs!: string[];

  @IsOptional()
  @IsIn(["Food Hunter", "Culture Seeker", "Beach Lover", "Mountain Adventurer", "Luxury Escaper", "Budget Backpacker", "Family Planner", "World Wanderer"])
  style?: TravelStyle;
}

class BudgetEstimateDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  destinationSlug?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  travelers?: number;
}

class BudgetDto implements BudgetSimulationInput {
  @IsString()
  @MaxLength(80)
  destinationSlug!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  travelers!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(60)
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
  @ArrayMinSize(1)
  answers!: TravelQuizAnswer[];
}

class MoodSearchDto {
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  query!: string;
}

class ReindexDto {
  @IsOptional()
  @IsBoolean()
  force?: boolean;
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
  budget(@Body() body: BudgetEstimateDto = {}) {
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
  reindex(@Body() body: ReindexDto = {}) {
    return envelope({ jobId: "mock-reindex-job", vectorDb: "qdrant", status: "queued", forced: body.force === true }, "AI reindex queued");
  }
}
