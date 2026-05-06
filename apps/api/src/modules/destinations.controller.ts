import { Controller, Get, Param, Query } from "@nestjs/common";
import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";
import { envelope } from "@vietwander/shared";
import { DestinationsService } from "./destinations.service";

class DestinationListQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  q?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  style?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  country?: string;

  @IsOptional()
  @IsIn(["cheapest", "popular"])
  sort?: string;
}

class SearchQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  q?: string;
}

@Controller()
export class DestinationsController {
  constructor(private readonly destinations: DestinationsService) {}

  @Get("destinations")
  list(@Query() query: DestinationListQueryDto) {
    const data = this.destinations.list(query);
    return envelope(data, "Destinations loaded", { total: data.length });
  }

  @Get("destinations/:slug")
  detail(@Param("slug") slug: string) {
    return envelope(this.destinations.get(slug), "Destination loaded");
  }

  @Get("experiences")
  experiences() {
    return envelope(this.destinations.list().flatMap((destination) => destination.experiences.map((title) => ({ title, destination: destination.name }))));
  }

  @Get("hotels")
  hotels() {
    return envelope(this.destinations.list().flatMap((destination) => destination.hotelsMock.map((hotel) => ({ ...hotel, destination: destination.name }))));
  }

  @Get("search")
  search(@Query() query: SearchQueryDto) {
    return envelope(this.destinations.search(query.q ?? ""), "Search complete");
  }

  @Get("reviews")
  reviews() {
    return envelope(this.destinations.list().flatMap((destination) => destination.reviews.map((review) => ({ ...review, destination: destination.name }))));
  }
}
