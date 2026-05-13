import { randomBytes } from 'node:crypto';

/**
 * Booking code format: `WV-YYYYMMDD-XXXXXX`
 *
 * - `WV`       — WanderViet prefix
 * - `YYYYMMDD` — UTC date of the booking, zero-padded month and day
 * - `XXXXXX`   — 6 random alphanumeric characters (A-Z, 0-9)
 *
 * The 6-char suffix is drawn from a 36-character alphabet (A-Z + 0-9),
 * giving ~2.18 billion unique suffixes per calendar day.
 *
 * @param date - The booking date to encode in the code
 * @returns A booking code matching regex `^WV-\d{8}-[A-Z0-9]{6}$`
 *
 * @example
 * generateBookingCode(new Date('2026-05-11')) // => "WV-20260511-K7R2M9"
 */
export function generateBookingCode(date: Date): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const datePart = `${yyyy}${mm}${dd}`;

  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = randomBytes(6);
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += CHARS[bytes[i]! % CHARS.length];
  }

  return `WV-${datePart}-${suffix}`;
}

/** Regex that validates the booking code format produced by {@link generateBookingCode}. */
export const BOOKING_CODE_REGEX = /^WV-\d{8}-[A-Z0-9]{6}$/;
