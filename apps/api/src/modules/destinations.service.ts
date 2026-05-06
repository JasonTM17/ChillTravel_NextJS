import { Injectable, NotFoundException } from "@nestjs/common";
import { destinations, normalizeTravelText } from "@vietwander/shared";

@Injectable()
export class DestinationsService {
  list(query?: { q?: string; style?: string; country?: string; sort?: string }) {
    let result = destinations;
    if (query?.q) {
      const q = normalizeTravelText(query.q);
      result = result.filter((item) => normalizeTravelText([item.name, item.country, item.city, item.summary].join(" ")).includes(q));
    }
    if (query?.style) {
      result = result.filter((item) => normalizeTravelText(item.travelStyles.join(" ")).includes(normalizeTravelText(query.style!)));
    }
    if (query?.country) {
      result = result.filter((item) => normalizeTravelText(item.country).includes(normalizeTravelText(query.country!)));
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
