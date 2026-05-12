import { api } from "./client";
import type { ApiSuccess, ApiPaginatedResponse, PaginationQuery } from "@vietwander/shared";
import type { Destination, CreateDestinationRequest } from "./destination.api";
import type { Tour, TourQuery, CreateTourRequest } from "./tour.api";
import type { Booking } from "./booking.api";
import type { Review } from "./review.api";
import type { BlogPost } from "./blog.api";
import type { ContactRequest } from "./contact.api";

// ---------------------------------------------------------------------------
// Admin-specific types
// ---------------------------------------------------------------------------

export interface DashboardSummary {
  totalUsers: number;
  totalTours: number;
  totalDestinations: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  pendingReviews: number;
  newContacts: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  bookingCount: number;
}

export interface BookingStatusCounts {
  PENDING: number;
  CONFIRMED: number;
  CANCELLED: number;
  COMPLETED: number;
  REFUNDED: number;
}

export interface TopTour {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  bookingCount: number;
  revenue: number;
}

export interface RecentActivities {
  recentBookings: Booking[];
  recentContacts: ContactRequest[];
  recentReviews: Review[];
}

export interface AdminBookingQuery extends PaginationQuery {
  status?: string;
  paymentStatus?: string;
  keyword?: string;
}

export interface AdminReviewQuery extends PaginationQuery {
  status?: string;
  tourId?: string;
}

export interface AdminBlogQuery extends PaginationQuery {
  status?: string;
  keyword?: string;
}

export interface AdminContactQuery extends PaginationQuery {
  status?: string;
  keyword?: string;
}

export interface CreateBlogRequest {
  title: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  category?: string;
  status?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usedCount: number;
  validFrom: string;
  validUntil: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponRequest {
  code: string;
  description?: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  validFrom: string;
  validUntil?: string;
  isActive?: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  role: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Admin API
// ---------------------------------------------------------------------------

export const adminApi = {
  dashboard: {
    getSummary: () =>
      api.get<ApiSuccess<DashboardSummary>>("/admin/dashboard/summary"),

    getRevenue: () =>
      api.get<ApiSuccess<RevenueData[]>>("/admin/dashboard/revenue"),

    getBookingsByStatus: () =>
      api.get<ApiSuccess<BookingStatusCounts>>("/admin/dashboard/bookings"),

    getTopTours: () =>
      api.get<ApiSuccess<TopTour[]>>("/admin/dashboard/top-tours"),

    getRecentActivities: () =>
      api.get<ApiSuccess<RecentActivities>>("/admin/dashboard/recent-activities"),
  },

  destinations: {
    list: (query?: PaginationQuery) =>
      api.get<ApiPaginatedResponse<Destination>>(
        "/destinations",
        query as Record<string, string | number | boolean | undefined>
      ),

    create: (data: CreateDestinationRequest) =>
      api.post<ApiSuccess<Destination>>("/admin/destinations", data),

    update: (id: string, data: Partial<CreateDestinationRequest>) =>
      api.put<ApiSuccess<Destination>>(`/admin/destinations/${id}`, data),

    delete: (id: string) =>
      api.delete<ApiSuccess<void>>(`/admin/destinations/${id}`),

    uploadImage: (id: string, formData: FormData) =>
      api.upload<ApiSuccess<{ imageUrl: string }>>(`/admin/destinations/${id}/images`, formData),

    deleteImage: (imageId: string) =>
      api.delete<ApiSuccess<void>>(`/admin/destination-images/${imageId}`),
  },

  tours: {
    list: (query?: TourQuery) =>
      api.get<ApiPaginatedResponse<Tour>>(
        "/tours",
        query as Record<string, string | number | boolean | undefined>
      ),

    create: (data: CreateTourRequest) =>
      api.post<ApiSuccess<Tour>>("/admin/tours", data),

    update: (id: string, data: Partial<CreateTourRequest>) =>
      api.put<ApiSuccess<Tour>>(`/admin/tours/${id}`, data),

    delete: (id: string) =>
      api.delete<ApiSuccess<void>>(`/admin/tours/${id}`),
  },

  bookings: {
    list: (query?: AdminBookingQuery) =>
      api.get<ApiPaginatedResponse<Booking>>(
        "/admin/bookings",
        query as Record<string, string | number | boolean | undefined>
      ),

    getById: (id: string) =>
      api.get<ApiSuccess<Booking>>(`/admin/bookings/${id}`),

    updateStatus: (id: string, status: string) =>
      api.put<ApiSuccess<Booking>>(`/admin/bookings/${id}/status`, { status }),

    updatePaymentStatus: (id: string, paymentStatus: string) =>
      api.put<ApiSuccess<Booking>>(`/admin/bookings/${id}/payment-status`, { paymentStatus }),
  },

  reviews: {
    list: (query?: AdminReviewQuery) =>
      api.get<ApiPaginatedResponse<Review>>(
        "/admin/reviews",
        query as Record<string, string | number | boolean | undefined>
      ),

    approve: (id: string) =>
      api.put<ApiSuccess<Review>>(`/admin/reviews/${id}/approve`),

    reject: (id: string) =>
      api.put<ApiSuccess<Review>>(`/admin/reviews/${id}/reject`),

    hide: (id: string) =>
      api.put<ApiSuccess<Review>>(`/admin/reviews/${id}/hide`),
  },

  blogs: {
    list: (query?: AdminBlogQuery) =>
      api.get<ApiPaginatedResponse<BlogPost>>(
        "/admin/blogs",
        query as Record<string, string | number | boolean | undefined>
      ),

    create: (data: CreateBlogRequest) =>
      api.post<ApiSuccess<BlogPost>>("/admin/blogs", data),

    update: (id: string, data: Partial<CreateBlogRequest>) =>
      api.put<ApiSuccess<BlogPost>>(`/admin/blogs/${id}`, data),

    delete: (id: string) =>
      api.delete<ApiSuccess<void>>(`/admin/blogs/${id}`),
  },

  contacts: {
    list: (query?: AdminContactQuery) =>
      api.get<ApiPaginatedResponse<ContactRequest>>(
        "/admin/contact-requests",
        query as Record<string, string | number | boolean | undefined>
      ),

    updateStatus: (
      id: string,
      data: { status?: string; assignedTo?: string; adminNote?: string }
    ) =>
      api.put<ApiSuccess<ContactRequest>>(
        `/admin/contact-requests/${id}/status`,
        data
      ),
  },

  coupons: {
    list: (query?: PaginationQuery) =>
      api.get<ApiPaginatedResponse<Coupon>>(
        "/admin/coupons",
        query as Record<string, string | number | boolean | undefined>
      ),

    create: (data: CreateCouponRequest) =>
      api.post<ApiSuccess<Coupon>>("/admin/coupons", data),

    update: (id: string, data: Partial<CreateCouponRequest>) =>
      api.put<ApiSuccess<Coupon>>(`/admin/coupons/${id}`, data),

    delete: (id: string) =>
      api.delete<ApiSuccess<void>>(`/admin/coupons/${id}`),
  },

  uploads: {
    uploadImage: (formData: FormData) =>
      api.upload<ApiSuccess<{ url: string; filename: string }>>(
        "/admin/uploads/images",
        formData
      ),
  },

  users: {
    list: (query?: PaginationQuery & { keyword?: string }) =>
      api.get<ApiPaginatedResponse<AdminUser>>(
        "/admin/users",
        query as Record<string, string | number | boolean | undefined>
      ),
  },
};
