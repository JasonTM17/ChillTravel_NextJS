import type { ApiSuccess, ApiPaginatedResponse, PaginationQuery } from '@vietwander/shared';
import { api } from './client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Notification API
// ---------------------------------------------------------------------------

export const notificationApi = {
  list: (query?: PaginationQuery) =>
    api.get<ApiPaginatedResponse<Notification>>(
      '/notifications',
      query as Record<string, string | number | boolean | undefined>,
    ),

  markRead: (id: string) => api.put<ApiSuccess<Notification>>(`/notifications/${id}/read`),

  markAllRead: () => api.put<ApiSuccess<{ updated: number }>>('/notifications/read-all'),
};
