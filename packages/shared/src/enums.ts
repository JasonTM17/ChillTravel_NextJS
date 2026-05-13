/**
 * WanderViet shared enum mirrors for Prisma enums declared in
 * `packages/db/prisma/schema.prisma`.
 *
 * Each Prisma enum is re-exported as:
 *   1. A `readonly` const tuple (`as const`) that enumerates every value so
 *      backend validators and frontend <select> components can iterate them
 *      at runtime.
 *   2. A TypeScript string-literal union type derived from that tuple for
 *      compile-time checking.
 *
 * Canonical label mappers (see design §3.x / schema.prisma enum comments)
 * translate the legacy lowercase Prisma values to the WanderViet canonical
 * UPPERCASE labels used in the API response layer.
 *
 * This module is dependency-free. It does **not** import `@prisma/client`
 * (generator output) because `packages/shared` must remain consumable by
 * the Flutter JSON bridge, the AI preview, and the web client without
 * pulling in the Prisma runtime.
 *
 * ⚠️ Naming note: the type alias `RoleName` here matches the schema enum
 * name. The legacy `Role` type in `./types` (`"USER" | "HOST" | "GUIDE" |
 * "ADMIN"`) is kept for existing ChillTravel contracts and is **not**
 * replaced by this.
 */

// ---------------------------------------------------------------------------
// RoleName
// ---------------------------------------------------------------------------

export const ROLE_NAMES = ['USER', 'HOST', 'GUIDE', 'ADMIN', 'STAFF'] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

/** Canonical WanderViet role labels (design §3.x). */
export const CANONICAL_ROLE_NAMES = ['USER', 'ADMIN', 'STAFF'] as const;
export type CanonicalRoleName = (typeof CANONICAL_ROLE_NAMES)[number];

/**
 * Normalize a legacy/extended role value to the canonical WanderViet role.
 * `HOST` and `GUIDE` collapse to `STAFF` per schema.prisma enum comments.
 */
export function toCanonicalRoleName(role: RoleName): CanonicalRoleName {
  switch (role) {
    case 'HOST':
    case 'GUIDE':
    case 'STAFF':
      return 'STAFF';
    case 'ADMIN':
      return 'ADMIN';
    case 'USER':
    default:
      return 'USER';
  }
}

// ---------------------------------------------------------------------------
// BookingStatus (legacy lowercase values retained)
// ---------------------------------------------------------------------------

export const BOOKING_STATUSES = [
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'refunded_mock',
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

/** Canonical WanderViet booking status labels returned in API responses. */
export const BOOKING_STATUS_CANONICAL = {
  pending: 'PENDING',
  confirmed: 'CONFIRMED',
  cancelled: 'CANCELLED',
  completed: 'COMPLETED',
  refunded_mock: 'REFUNDED',
} as const;
export type CanonicalBookingStatus = (typeof BOOKING_STATUS_CANONICAL)[BookingStatus];

// ---------------------------------------------------------------------------
// PaymentStatus (legacy lowercase values retained)
// ---------------------------------------------------------------------------

export const PAYMENT_STATUSES = [
  'pending',
  'confirmed_mock',
  'failed_mock',
  'refunded_mock',
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

/** Canonical WanderViet payment status labels returned in API responses. */
export const PAYMENT_STATUS_CANONICAL = {
  pending: 'UNPAID',
  confirmed_mock: 'PAID',
  failed_mock: 'FAILED',
  refunded_mock: 'REFUNDED',
} as const;
export type CanonicalPaymentStatus = (typeof PAYMENT_STATUS_CANONICAL)[PaymentStatus];

// ---------------------------------------------------------------------------
// UserStatus
// ---------------------------------------------------------------------------

export const USER_STATUSES = ['ACTIVE', 'INACTIVE', 'BANNED'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

// ---------------------------------------------------------------------------
// DestinationStatus
// ---------------------------------------------------------------------------

export const DESTINATION_STATUSES = ['ACTIVE', 'INACTIVE', 'DELETED'] as const;
export type DestinationStatus = (typeof DESTINATION_STATUSES)[number];

// ---------------------------------------------------------------------------
// TourStatus
// ---------------------------------------------------------------------------

export const TOUR_STATUSES = ['ACTIVE', 'INACTIVE', 'DELETED'] as const;
export type TourStatus = (typeof TOUR_STATUSES)[number];

// ---------------------------------------------------------------------------
// ReviewStatus
// ---------------------------------------------------------------------------

export const REVIEW_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'HIDDEN'] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

// ---------------------------------------------------------------------------
// BlogStatus
// ---------------------------------------------------------------------------

export const BLOG_STATUSES = ['DRAFT', 'PUBLISHED', 'DELETED'] as const;
export type BlogStatus = (typeof BLOG_STATUSES)[number];

// ---------------------------------------------------------------------------
// ContactStatus
// ---------------------------------------------------------------------------

export const CONTACT_STATUSES = ['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

// ---------------------------------------------------------------------------
// WishlistItemType
// ---------------------------------------------------------------------------

export const WISHLIST_ITEM_TYPES = ['TOUR', 'DESTINATION'] as const;
export type WishlistItemType = (typeof WISHLIST_ITEM_TYPES)[number];

// ---------------------------------------------------------------------------
// CouponDiscountType
// ---------------------------------------------------------------------------

export const COUPON_DISCOUNT_TYPES = ['PERCENT', 'FIXED'] as const;
export type CouponDiscountType = (typeof COUPON_DISCOUNT_TYPES)[number];

// ---------------------------------------------------------------------------
// NotificationType
// ---------------------------------------------------------------------------

export const NOTIFICATION_TYPES = [
  'BOOKING_CONFIRMED',
  'BOOKING_CANCELLED',
  'BOOKING_COMPLETED',
  'REVIEW_APPROVED',
  'CONTACT_REPLY',
  'SYSTEM',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
