import type { ApiSuccess, ApiPaginatedResponse } from '@vietwander/shared';
import { api } from './client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Country {
  id: string;
  name: string;
  code?: string;
}

export interface City {
  id: string;
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
  /** API may return a string OR a Country object depending on include depth */
  country: string | Country;
  /** API may return a string OR a City object */
  city: string | City | null;
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

/** Safely extract country name regardless of whether API returned string or object */
export function getCountryName(destination: Destination): string {
  if (!destination.country) return '';
  if (typeof destination.country === 'string') return destination.country;
  return destination.country.name ?? '';
}

/** Safely extract city name regardless of whether API returned string or object */
export function getCityName(destination: Destination): string | null {
  if (!destination.city) return null;
  if (typeof destination.city === 'string') return destination.city;
  return destination.city.name ?? null;
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
      '/destinations',
      query as Record<string, string | number | boolean | undefined>,
    ),

  getBySlug: (slug: string) => api.get<ApiSuccess<Destination>>(`/destinations/${slug}`),
};
