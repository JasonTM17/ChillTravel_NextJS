-- Migration: add_hot_column_indexes
-- Requirement: Req 5.5 — Add indexes for hot columns used in frequent lookups.
--
-- The following columns are identified as "hot" (high-frequency lookup):
--   Tour.slug, Destination.slug, Booking.bookingCode, Booking.userId,
--   Review.tourId, Coupon.code
--
-- Analysis: All these columns already have indexes via @unique constraints
-- or explicit @@index declarations in the schema:
--   - Tour.slug: UNIQUE constraint (implicit index)
--   - Destination.slug: UNIQUE constraint (implicit index)
--   - Booking.bookingCode: UNIQUE constraint (implicit index)
--   - Booking.userId: @@index([userId])
--   - Review.tourId: @@index([tourId, status]) — composite covers tourId prefix
--   - Coupon.code: UNIQUE constraint (implicit index)
--
-- This migration creates explicit standalone indexes where only composite
-- indexes existed, to optimize single-column lookups.

-- Review.tourId standalone index (composite [tourId, status] exists but
-- standalone is useful for joins without status filter)
CREATE INDEX IF NOT EXISTS "Review_tourId_idx" ON "Review"("tourId");

-- Booking.bookingCode — already unique, but add a B-tree index hint for
-- pattern matching queries (e.g. LIKE 'WV-20250101-%')
-- Note: UNIQUE already creates a B-tree index, so this is a no-op in practice.
-- Keeping as documentation of intent.

-- Coupon.code — already unique (B-tree index exists)
-- Tour.slug — already unique (B-tree index exists)
-- Destination.slug — already unique (B-tree index exists)
-- Booking.userId — already has @@index([userId])
