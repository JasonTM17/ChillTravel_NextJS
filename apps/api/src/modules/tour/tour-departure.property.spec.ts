// Feature: wanderviet-pro-upgrade-plan, Property 3: Tour Departure Date Range
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

import { PBT_NUM_RUNS, validDateArb } from '../../test-utils/pbt-helpers';
import {
  validateDeparture,
  validateBookingDate,
  TourDeparture,
  BookingDateCheck,
} from './utils/tour-departure-validator';

/**
 * Arbitrary that generates a valid TourDeparture where departureDate < returnDate.
 * We generate two distinct dates and order them so the earlier one is departureDate.
 */
const validDepartureArb: fc.Arbitrary<TourDeparture> = fc
  .tuple(validDateArb, validDateArb)
  .filter(([a, b]) => a.getTime() !== b.getTime())
  .map(([a, b]) => {
    const [earlier, later] =
      a.getTime() < b.getTime() ? [a, b] : [b, a];
    return { departureDate: earlier, returnDate: later };
  });

/**
 * Arbitrary that generates a valid BookingDateCheck where bookingDate is
 * within [departureDate, returnDate].
 */
const validBookingDateCheckArb: fc.Arbitrary<BookingDateCheck> = validDepartureArb.chain(
  (departure) => {
    const startTime = departure.departureDate.getTime();
    const endTime = departure.returnDate.getTime();
    return fc
      .integer({ min: startTime, max: endTime })
      .map((timestamp) => ({
        bookingDate: new Date(timestamp),
        departure,
      }));
  },
);

/**
 * **Validates: Requirements 3.7**
 *
 * Property 3: Tour Departure Date Range
 *
 * For any valid tour departure:
 * 1. startDate < endDate SHALL hold
 * 2. For any valid booking associated with a departure,
 *    bookingDate SHALL satisfy startDate <= bookingDate <= endDate
 */
describe('Property 3: Tour Departure Date Range', () => {
  it('validateDeparture returns true when departureDate < returnDate', () => {
    fc.assert(
      fc.property(validDepartureArb, (departure) => {
        expect(validateDeparture(departure)).toBe(true);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('validateDeparture returns false when departureDate >= returnDate', () => {
    fc.assert(
      fc.property(validDateArb, (date) => {
        // Same date (equal)
        const sameDateDeparture: TourDeparture = {
          departureDate: date,
          returnDate: new Date(date.getTime()),
        };
        expect(validateDeparture(sameDateDeparture)).toBe(false);

        // Reversed dates (departureDate > returnDate)
        const reversedDeparture: TourDeparture = {
          departureDate: new Date(date.getTime() + 86400000), // +1 day
          returnDate: date,
        };
        expect(validateDeparture(reversedDeparture)).toBe(false);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('validateBookingDate returns true when bookingDate is within departure range', () => {
    fc.assert(
      fc.property(validBookingDateCheckArb, (check) => {
        expect(validateBookingDate(check)).toBe(true);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('validateBookingDate returns false when bookingDate is before departureDate', () => {
    fc.assert(
      fc.property(validDepartureArb, (departure) => {
        const beforeBooking: BookingDateCheck = {
          bookingDate: new Date(departure.departureDate.getTime() - 1),
          departure,
        };
        expect(validateBookingDate(beforeBooking)).toBe(false);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('validateBookingDate returns false when bookingDate is after returnDate', () => {
    fc.assert(
      fc.property(validDepartureArb, (departure) => {
        const afterBooking: BookingDateCheck = {
          bookingDate: new Date(departure.returnDate.getTime() + 1),
          departure,
        };
        expect(validateBookingDate(afterBooking)).toBe(false);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });
});
