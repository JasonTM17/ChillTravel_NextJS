import { randomBytes } from 'node:crypto';

/**
 * Booking code format: `WV-YYYYMMDD-XXXXXX`
 *
 * - `YYYYMMDD` — UTC date of generation, zero-padded month and day.
 * - `XXXXXX`   — 6 uppercase hex chars from 24 bits of crypto randomness,
 *               giving ~16.7M unique suffixes per calendar day.
 *
 * @example `WV-20260511-A3F9C2`
 *
 * Natural collisions are vanishingly rare; callers should still retry on a
 * DB unique-constraint violation to be safe (Req 10 booking flow).
 *
 * Design §5.3.
 */
export function generateBookingCode(now: Date = new Date()): string {
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const datePart = `${yyyy}${mm}${dd}`;
  const randomPart = randomBytes(3).toString('hex').toUpperCase();
  return `WV-${datePart}-${randomPart}`;
}

/** Validates the `WV-YYYYMMDD-XXXXXX` shape produced by {@link generateBookingCode}. */
export const BOOKING_CODE_REGEX = /^WV-\d{8}-[0-9A-F]{6}$/;
