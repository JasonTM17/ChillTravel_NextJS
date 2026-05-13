/**
 * Property-Based Testing (PBT) Helpers
 *
 * Shared arbitraries for use with fast-check across the API test suite.
 * These generators produce valid domain values for property-based tests.
 */
import * as fc from 'fast-check';

// ─── Date Arbitraries ────────────────────────────────────────────────────────

/** Generates a date in the past (up to 5 years ago) */
export const pastDateArb = fc.date({
  min: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000),
  max: new Date(Date.now() - 1),
});

/** Generates a date in the future (up to 2 years ahead) */
export const futureDateArb = fc.date({
  min: new Date(Date.now() + 1),
  max: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
});

/** Generates any valid date (past or future, within reasonable range) */
export const validDateArb = fc.date({
  min: new Date('2020-01-01'),
  max: new Date('2030-12-31'),
}).filter((d) => !isNaN(d.getTime()));

// ─── Monetary Amount Arbitraries ─────────────────────────────────────────────

/** Generates a non-negative integer amount in a reasonable range (0 to 100,000,000 VND) */
export const monetaryAmountArb = fc.integer({ min: 0, max: 100_000_000 });

/** Generates a positive monetary amount (1 to 100,000,000 VND) */
export const positiveAmountArb = fc.integer({ min: 1, max: 100_000_000 });

// ─── Booking Code Arbitraries ────────────────────────────────────────────────

/** Characters valid in the random suffix of a booking code (A-Z, 0-9) */
const BOOKING_CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/** Generates a valid 6-character booking code suffix */
export const bookingCodeSuffixArb = fc
  .array(
    fc.integer({ min: 0, max: BOOKING_CODE_CHARS.length - 1 }),
    { minLength: 6, maxLength: 6 },
  )
  .map((indices) => indices.map((i) => BOOKING_CODE_CHARS[i]).join(''));

/** Generates a complete valid booking code matching WV-YYYYMMDD-XXXXXX */
export const validBookingCodeArb = fc
  .tuple(validDateArb, bookingCodeSuffixArb)
  .map(([date, suffix]) => {
    const y = date.getFullYear().toString();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `WV-${y}${m}${d}-${suffix}`;
  });

// ─── Coupon Arbitraries ──────────────────────────────────────────────────────

/** Generates a percentage discount value (0 to 100, integer) */
export const couponPercentArb = fc.integer({ min: 0, max: 100 });

/** Generates a fixed discount amount (non-negative integer, reasonable range) */
export const couponFixedAmountArb = fc.integer({ min: 0, max: 100_000_000 });

/** Generates a coupon discount type */
export const couponTypeArb = fc.constantFrom('PERCENT' as const, 'FIXED' as const);

/** Generates a complete coupon input for property testing */
export const couponInputArb = fc.oneof(
  fc.record({
    discountType: fc.constant('PERCENT' as const),
    discountValue: couponPercentArb,
    total: monetaryAmountArb,
  }),
  fc.record({
    discountType: fc.constant('FIXED' as const),
    discountValue: couponFixedAmountArb,
    total: monetaryAmountArb,
  }),
);

// ─── String Arbitraries ──────────────────────────────────────────────────────

/** Generates a valid commit message following Conventional Commits format */
export const commitMessageArb = fc
  .tuple(
    fc.constantFrom(
      'feat', 'fix', 'docs', 'style', 'refactor',
      'perf', 'test', 'chore', 'ci', 'build', 'revert',
    ),
    fc.option(
      fc.string({
        unit: fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')),
        minLength: 1,
        maxLength: 20,
      }),
      { nil: undefined },
    ),
    fc.option(fc.constant('!'), { nil: undefined }),
    fc.string({
      unit: fc.integer({ min: 0x20, max: 0x7e }).map((n) => String.fromCharCode(n)),
      minLength: 1,
      maxLength: 80,
    }),
  )
  .map(([type, scope, breaking, subject]) => {
    const scopePart = scope ? `(${scope})` : '';
    const breakingPart = breaking ?? '';
    return `${type}${scopePart}${breakingPart}: ${subject}`;
  });

/** Generates a valid feature branch name */
export const branchNameArb = fc
  .tuple(
    fc.constantFrom(
      'feat', 'fix', 'docs', 'style', 'refactor',
      'perf', 'test', 'chore', 'ci', 'build',
    ),
    fc.string({
      unit: fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')),
      minLength: 3,
      maxLength: 40,
    }).filter((s) => /^[a-z0-9]/.test(s)),
  )
  .map(([prefix, name]) => `${prefix}/${name}`);

// ─── Configuration ───────────────────────────────────────────────────────────

/** Default number of iterations for property-based tests */
export const PBT_NUM_RUNS = 100;

/** Default fast-check parameters for all property tests */
export const defaultPbtParams: fc.Parameters<unknown> = {
  numRuns: PBT_NUM_RUNS,
  verbose: fc.VerbosityLevel.VeryVerbose,
};
