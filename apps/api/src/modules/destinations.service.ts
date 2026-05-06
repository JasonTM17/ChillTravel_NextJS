import { Injectable, NotFoundException } from "@nestjs/common";
import { destinations } from "@vietwander/shared";

@Injectable()
export class DestinationsService {
  list(query?: { q?: string; style?: string; country?: string; sort?: string }) {
    let result = destinations;
    if (query?.q) {
      const q = query.q.toLowerCase();
      result = result.filter((item) => [item.name, item.country, item.city, item.summary].join(" ").toLowerCase().includes(q));
    }
    if (query?.style) {
      result = result.filter((item) => item.travelStyles.join(" ").toLowerCase().includes(query.style!.toLowerCase()));
    }
    if (query?.country) {
      result = result.filter((item) => item.country.toLowerCase().includes(query.country!.toLowerCase()));
    }
    if (query?.sort === "cheapest") {
      result = [...result].sort((a, b) => a.budgetMin - b.budgetMin);
    }
    if (query?.sort === "popular") {
      result = [...result].sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return result;
  }

  get(slug: string) {
    const destination = destinations.find((item) => item.slug === slug);
    if (!destination) {
      throw new NotFoundException("Destination not found");
    }
    return destination;
  }

  search(q: string) {
    return this.list({ q }).slice(0, 8);
  }
}
