import type { Destination } from "@vietwander/shared";

interface DestinationCopy {
  name: string;
  country: string;
  city: string;
  summary: string;
}

const copyBySlug: Record<string, DestinationCopy> = {
  "ha-noi": {
    name: "Ha Noi",
    country: "Vietnam",
    city: "Ha Noi",
    summary: "Old Quarter mornings, lakeside coffee, craft streets, and layered northern food culture."
  },
  "ha-long": {
    name: "Ha Long",
    country: "Vietnam",
    city: "Quang Ninh",
    summary: "Limestone bays, quiet deck mornings, seafood dinners, and slow cruise days."
  },
  sapa: {
    name: "Sapa",
    country: "Vietnam",
    city: "Lao Cai",
    summary: "Terraced valleys, mountain air, market walks, and village routes with cultural context."
  },
  "ninh-binh": {
    name: "Ninh Binh",
    country: "Vietnam",
    city: "Ninh Binh",
    summary: "River caves, karst viewpoints, temple paths, and gentle countryside stays."
  },
  hue: {
    name: "Hue",
    country: "Vietnam",
    city: "Thua Thien Hue",
    summary: "Imperial heritage, garden houses, royal cuisine, and slower central Vietnam rhythms."
  },
  "da-nang": {
    name: "Da Nang",
    country: "Vietnam",
    city: "Da Nang",
    summary: "Beach mornings, Son Tra viewpoints, seafood nights, and an easy bridge to Hoi An."
  },
  "hoi-an": {
    name: "Hoi An",
    country: "Vietnam",
    city: "Quang Nam",
    summary: "Lantern streets, tailor shops, riverside evenings, and central Vietnam food trails."
  },
  "nha-trang": {
    name: "Nha Trang",
    country: "Vietnam",
    city: "Khanh Hoa",
    summary: "Island-hopping, coastal resorts, seafood, and relaxed beach-forward itineraries."
  },
  "da-lat": {
    name: "Da Lat",
    country: "Vietnam",
    city: "Lam Dong",
    summary: "Pine hills, cafes, cool weather, waterfalls, and gentle mountain escapes."
  },
  "phu-quoc": {
    name: "Phu Quoc",
    country: "Vietnam",
    city: "Kien Giang",
    summary: "Sunset beaches, island markets, family resorts, and easy tropical downtime."
  },
  "can-tho": {
    name: "Can Tho",
    country: "Vietnam",
    city: "Mekong Delta",
    summary: "Floating markets, river breakfasts, garden homestays, and Mekong food culture."
  },
  "ha-giang": {
    name: "Ha Giang",
    country: "Vietnam",
    city: "Ha Giang",
    summary: "High passes, limestone plateaus, ethnic markets, and dramatic road-trip days."
  },
  tokyo: {
    name: "Tokyo",
    country: "Japan",
    city: "Tokyo",
    summary: "Neighborhood food quests, design shops, temples, trains, and late-night city energy."
  },
  seoul: {
    name: "Seoul",
    country: "South Korea",
    city: "Seoul",
    summary: "Palaces, cafes, markets, hill views, and a polished city itinerary for first-timers."
  },
  bangkok: {
    name: "Bangkok",
    country: "Thailand",
    city: "Bangkok",
    summary: "Street food, river routes, temples, rooftops, and flexible budget-friendly planning."
  },
  singapore: {
    name: "Singapore",
    country: "Singapore",
    city: "Singapore",
    summary: "Garden architecture, hawker centers, clean transit, and family-friendly city days."
  },
  bali: {
    name: "Bali",
    country: "Indonesia",
    city: "Bali",
    summary: "Rice terraces, surf beaches, temples, wellness stays, and slow coastal evenings."
  },
  paris: {
    name: "Paris",
    country: "France",
    city: "Paris",
    summary: "Museum mornings, pastry stops, river walks, and romantic neighborhoods at human pace."
  },
  rome: {
    name: "Rome",
    country: "Italy",
    city: "Rome",
    summary: "Ancient streets, espresso breaks, piazzas, and food routes built around walking."
  },
  barcelona: {
    name: "Barcelona",
    country: "Spain",
    city: "Barcelona",
    summary: "Architecture, markets, beaches, tapas, and lively evenings without rushing the city."
  },
  london: {
    name: "London",
    country: "United Kingdom",
    city: "London",
    summary: "Museums, parks, markets, theatre nights, and compact routes by neighborhood."
  },
  "new-york": {
    name: "New York",
    country: "United States",
    city: "New York",
    summary: "Big museums, skyline walks, food neighborhoods, parks, and high-energy city days."
  },
  "swiss-alps": {
    name: "Swiss Alps",
    country: "Switzerland",
    city: "Valais",
    summary: "Mountain railways, lake towns, hiking paths, and quiet alpine stays."
  },
  santorini: {
    name: "Santorini",
    country: "Greece",
    city: "Cyclades",
    summary: "Caldera walks, whitewashed villages, seafood, sunsets, and shoulder-season calm."
  },
  sydney: {
    name: "Sydney",
    country: "Australia",
    city: "New South Wales",
    summary: "Harbour walks, beaches, brunch, ferries, and easy coastal city planning."
  },
  dubai: {
    name: "Dubai",
    country: "United Arab Emirates",
    city: "Dubai",
    summary: "Desert edges, modern architecture, family attractions, and polished luxury options."
  }
};

export function getDestinationCopy(destination: Destination): DestinationCopy {
  return (
    copyBySlug[destination.slug] ?? {
      name: destination.name,
      country: destination.country,
      city: destination.city,
      summary: destination.summary
    }
  );
}
