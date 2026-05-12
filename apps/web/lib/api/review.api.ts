import { api } from "./client";
import type { ApiSuccess, ApiPaginatedResponse, PaginationQuery } from "@vietwander/shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReviewAuthor {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
}

export interface Review {
  id: string;
  userId: string;
  tourId: string;
  author?: ReviewAuthor;
  rating: number;
  title: string | null;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  rating: number;
  title?: string;
  content: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  content?: string;
}

// ---------------------------------------------------------------------------
// Review API
// ---------------------------------------------------------------------------

export const reviewApi = {
  listByTour: (tourId: string, query?: PaginationQuery) =>
    api.get<ApiPaginatedResponse<Review>>(
      `/tours/${tourId}/reviews`,
      query as Record<string, string | number | boolean | undefined>
    ),

  create: (tourId: string, data: CreateReviewRequest) =>
    api.post<ApiSuccess<Review>>(`/tours/${tourId}/reviews`, data),

  update: (id: string, data: UpdateReviewRequest) =>
    api.put<ApiSuccess<Review>>(`/reviews/${id}`, data),

  remove: (id: string) =>
    api.delete<ApiSuccess<void>>(`/reviews/${id}`),
};
