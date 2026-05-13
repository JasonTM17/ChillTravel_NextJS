/**
 * WanderViet API client — re-exports all domain clients and the base client.
 * Import from "@/lib/api" in Next.js pages and components.
 */

// Base client utilities
export {
  api,
  apiFetch,
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  TOKEN_KEYS,
} from './client';

// Domain clients
export { authApi } from './auth.api';
export { destinationApi } from './destination.api';
export { tourApi } from './tour.api';
export { bookingApi } from './booking.api';
export { reviewApi } from './review.api';
export { wishlistApi } from './wishlist.api';
export { blogApi } from './blog.api';
export { contactApi } from './contact.api';
export { adminApi } from './admin.api';
export { paymentApi } from './payment.api';
export { notificationApi } from './notification.api';

// Type re-exports — auth
export type { LoginRequest, RegisterRequest, AuthResponse, UserProfile } from './auth.api';

// Type re-exports — destination
export type {
  Destination,
  DestinationImage,
  DestinationQuery,
  CreateDestinationRequest,
} from './destination.api';

// Type re-exports — tour
export type {
  Tour,
  TourImage,
  TourItinerary,
  TourDeparture,
  TourDestination,
  TourQuery,
  CreateTourRequest,
} from './tour.api';

// Type re-exports — booking
export type {
  Booking,
  BookingGuest,
  BookingPayment,
  BookingTour,
  CreateBookingRequest,
  CreateBookingGuestRequest,
} from './booking.api';

// Type re-exports — review
export type { Review, ReviewAuthor, CreateReviewRequest, UpdateReviewRequest } from './review.api';

// Type re-exports — wishlist
export type { WishlistEntry, WishlistItemType, AddToWishlistRequest } from './wishlist.api';

// Type re-exports — blog
export type { BlogPost, BlogAuthor, BlogQuery } from './blog.api';

// Type re-exports — contact
export type { ContactRequest, SubmitContactRequest } from './contact.api';

// Type re-exports — payment
export type {
  MockCheckoutResponse,
  MockCallbackRequest,
  MockCallbackResponse,
} from './payment.api';

// Type re-exports — notification
export type { Notification } from './notification.api';

// Type re-exports — admin
export type {
  DashboardSummary,
  RevenueData,
  BookingStatusCounts,
  TopTour,
  RecentActivities,
  AdminBookingQuery,
  AdminReviewQuery,
  AdminBlogQuery,
  AdminContactQuery,
  CreateBlogRequest,
  Coupon,
  CreateCouponRequest,
  AdminUser,
} from './admin.api';
