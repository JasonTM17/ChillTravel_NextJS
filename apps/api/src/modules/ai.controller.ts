import { Body, Controller, Post } from "@nestjs/common";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";
import { envelope } from "@vietwander/shared";
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

  @Post("compare")
  compare(@Body() body: CompareDto) {
    return envelope(this.ai.compare(body.slugs), "Destinations compared");
  }

  @Post("reindex")
  reindex() {
    return envelope({ jobId: "mock-reindex-job", vectorDb: "qdrant", status: "queued" }, "AI reindex queued");
  }
}
