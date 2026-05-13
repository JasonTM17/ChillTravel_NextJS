/**
 * Tour Departure Validator
 *
 * Validates date range invariants for tour departures and booking dates.
 *
 * Invariants:
 * - A departure must have departureDate < returnDate
 * - A booking date must fall within the departure's date range [departureDate, returnDate]
 */

export interface TourDeparture {
  departureDate: Date; // startDate
  returnDate: Date; // endDate
}

export interface BookingDateCheck {
  bookingDate: Date;
  departure: TourDeparture;
}

/**
 * Validates that a tour departure has a valid date range.
 * startDate (departureDate) must be strictly before endDate (returnDate).
 */
export function validateDeparture(departure: TourDeparture): boolean {
  return departure.departureDate.getTime() < departure.returnDate.getTime();
}

/**
 * Validates that a booking date falls within the departure's date range.
 * bookingDate must be >= departureDate and <= returnDate.
 */
export function validateBookingDate(check: BookingDateCheck): boolean {
  const bookingTime = check.bookingDate.getTime();
  const departureTime = check.departure.departureDate.getTime();
  const returnTime = check.departure.returnDate.getTime();

  return bookingTime >= departureTime && bookingTime <= returnTime;
}
