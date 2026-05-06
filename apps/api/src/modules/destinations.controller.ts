import { Controller, Get, Param, Query } from "@nestjs/common";
import { envelope } from "@vietwander/shared";
import { DestinationsService } from "./destinations.service";

@Controller()
export class DestinationsController {
  constructor(private readonly destinations: DestinationsService) {}

  @Get("destinations")
  list(@Query("q") q?: string, @Query("style") style?: string, @Query("country") country?: string, @Query("sort") sort?: string) {
    const data = this.destinations.list({ q, style, country, sort });
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
  search(@Query("q") q = "") {
    return envelope(this.destinations.search(q), "Search complete");
  }

  @Get("reviews")
  reviews() {
    return envelope(this.destinations.list().flatMap((destination) => destination.reviews.map((review) => ({ ...review, destination: destination.name }))));
  }
}
