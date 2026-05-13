// Feature: wanderviet-pro-upgrade-plan, Property 1: Booking Code Format Invariant
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

import { PBT_NUM_RUNS } from '../../test-utils/pbt-helpers';
import { generateBookingCode, BOOKING_CODE_REGEX } from './utils/booking-code';

/**
 * A date arbitrary that only produces valid (non-NaN) dates.
 * fast-check v4's fc.date() can produce Invalid Date, so we filter those out.
 */
const validDateArb = fc
  .date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
  .filter((d) => !isNaN(d.getTime()));

/**
 * **Validates: Requirements 3.4**
 *
 * Property 1: Booking Code Format Invariant
 *
 * For any valid date, the generated booking code SHALL:
 * 1. Match the regex `^WV-\d{8}-[A-Z0-9]{6}$`
 * 2. Encode the date portion as YYYYMMDD (UTC)
 */
describe('Property 1: Booking Code Format Invariant', () => {
  it('generated code matches format regex for any valid date', () => {
    fc.assert(
      fc.property(validDateArb, (date) => {
        const code = generateBookingCode(date);
        expect(code).toMatch(BOOKING_CODE_REGEX);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('date portion correctly encodes YYYYMMDD from the input date', () => {
    fc.assert(
      fc.property(validDateArb, (date) => {
        const code = generateBookingCode(date);

        // Extract the date portion (characters 3-10, after "WV-")
        const datePortion = code.slice(3, 11);

        const expectedYear = date.getUTCFullYear().toString();
        const expectedMonth = String(date.getUTCMonth() + 1).padStart(2, '0');
        const expectedDay = String(date.getUTCDate()).padStart(2, '0');
        const expectedDate = `${expectedYear}${expectedMonth}${expectedDay}`;

        expect(datePortion).toBe(expectedDate);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('suffix is exactly 6 characters from [A-Z0-9]', () => {
    fc.assert(
      fc.property(validDateArb, (date) => {
        const code = generateBookingCode(date);

        // Extract suffix (after the second dash, position 12 onwards)
        const suffix = code.slice(12);

        expect(suffix).toHaveLength(6);
        expect(suffix).toMatch(/^[A-Z0-9]{6}$/);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });
});
