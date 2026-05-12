import { api } from "./client";
import type { ApiSuccess, ApiPaginatedResponse } from "@vietwander/shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Country {
  name: string;
  code?: string;
}

export interface City {
  name: string;
}

export interface DestinationImage {
  id: string;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  city: string | null;
  description: string;
  shortDescription: string | null;
  bestTimeToVisit: string | null;
  imageUrl: string | null;
  category: string | null;
  status: string;
  isFeatured?: boolean;
  ratingAvg?: number;
  reviewCount?: number;
  images: DestinationImage[];
  createdAt: string;
  updatedAt: string;
}

export interface DestinationQuery {
  keyword?: string;
  country?: string;
  city?: string;
  category?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface CreateDestinationRequest {
  name: string;
  country: string;
  city?: string;
  description: string;
  shortDescription?: string;
  bestTimeToVisit?: string;
  imageUrl?: string;
  category?: string;
}

// ---------------------------------------------------------------------------
// Destination API
// ---------------------------------------------------------------------------

export const destinationApi = {
  list: (query?: DestinationQuery) =>
    api.get<ApiPaginatedResponse<Destination>>(
      "/destinations",
      query as Record<string, string | number | boolean | undefined>
    ),

  getBySlug: (slug: string) =>
    api.get<ApiSuccess<Destination>>(`/destinations/${slug}`),
};
