/**
 * Shared admin dashboard types used by both `apps/api` and `apps/web`.
 *
 * These interfaces define the canonical shapes for dashboard statistics
 * returned by the admin API and consumed by the web admin panel.
 */

/**
 * Aggregate counts for the admin dashboard summary.
 */
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

/**
 * Monthly revenue data point for the admin dashboard chart.
 */
export interface RevenueData {
  month: string;
  revenue: number;
  bookingCount: number;
}

/**
 * Booking counts grouped by canonical status.
 */
export interface BookingStatusCounts {
  PENDING: number;
  CONFIRMED: number;
  CANCELLED: number;
  COMPLETED: number;
  REFUNDED: number;
}

/**
 * Top tour by booking count for the admin dashboard.
 */
export interface TopTour {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  bookingCount: number;
  revenue: number;
}
