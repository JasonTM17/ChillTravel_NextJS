import type { ApiSuccess, ApiPaginatedResponse, PaginationQuery } from '@vietwander/shared';
import { api } from './client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BlogAuthor {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  category: string | null;
  status: string;
  authorId: string;
  author?: BlogAuthor;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogQuery extends PaginationQuery {
  keyword?: string;
  category?: string;
}

// ---------------------------------------------------------------------------
// Blog API
// ---------------------------------------------------------------------------

export const blogApi = {
  list: (query?: BlogQuery) =>
    api.get<ApiPaginatedResponse<BlogPost>>(
      '/blogs',
      query as Record<string, string | number | boolean | undefined>,
    ),

  getBySlug: (slug: string) => api.get<ApiSuccess<BlogPost>>(`/blogs/${slug}`),
};
