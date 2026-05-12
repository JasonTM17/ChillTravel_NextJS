import { api } from "./client";
import type { ApiSuccess, ApiPaginatedResponse } from "@vietwander/shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TourImage {
  id: string;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
}

export interface TourItinerary {
  id: string;
  dayNumber: number;
  title: string;
  description: string | null;
  meals: string | null;
  accommodation: string | null;
  activities: string | null;
}

export interface TourDeparture {
  id: string;
  tourId: string;
  departureDate: string;
  returnDate: string | null;
  availableSlots: number;
  priceOverride: number | null;
  status: string;
}

export interface TourDestination {
  id: string;
  name: string;
  slug: string;
  country: string;
  city: string | null;
  imageUrl: string | null;
}

export interface Tour {
  id: string;
  title: string;
  slug: string;
  destinationId: string;
  destination?: TourDestination;
  description: string;
  shortDescription: string | null;
  durationDays: number;
  durationNights: number;
  basePrice: number;
  salePrice: number | null;
  maxGuests: number;
  minGuests: number;
  availableSlots: number;
  startDate: string | null;
  endDate: string | null;
  status: string;
  featured: boolean;
  imageUrl: string | null;
  ratingAvg?: number;
  reviewCount?: number;
  images: TourImage[];
  itinerary?: TourItinerary[];
  departures?: TourDeparture[];
  createdAt: string;
  updatedAt: string;
}

export interface TourQuery {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: number;
  destinationId?: string;
  sortBy?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface CreateTourRequest {
  title: string;
  destinationId: string;
  description: string;
  shortDescription?: string;
  durationDays: number;
  durationNights: number;
  basePrice: number;
  salePrice?: number;
  maxGuests: number;
  minGuests?: number;
  availableSlots: number;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  featured?: boolean;
}

// ---------------------------------------------------------------------------
// Tour API
// ---------------------------------------------------------------------------

export const tourApi = {
  list: (query?: TourQuery) =>
    api.get<ApiPaginatedResponse<Tour>>(
      "/tours",
      query as Record<string, string | number | boolean | undefined>
    ),

  getBySlug: (slug: string) =>
    api.get<ApiSuccess<Tour>>(`/tours/${slug}`),

  getFeatured: () =>
    api.get<ApiSuccess<Tour[]>>("/tours/featured"),
};
