import { api } from "./client";
import type { ApiSuccess, ApiPaginatedResponse, PaginationQuery } from "@vietwander/shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BookingGuest {
  id: string;
  fullName: string;
  dateOfBirth: string | null;
  gender: string | null;
  note: string | null;
}

export interface BookingPayment {
  id: string;
  provider: string;
  amount: number;
  currency: string;
  status: string;
  transactionCode: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface BookingTour {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  durationDays: number;
  durationNights: number;
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  tourId: string;
  tour?: BookingTour;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  numberOfGuests: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  specialRequest: string | null;
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
  guests?: BookingGuest[];
  payment?: BookingPayment;
}

export interface CreateBookingGuestRequest {
  fullName: string;
  dateOfBirth?: string;
  gender?: string;
  note?: string;
}

export interface CreateBookingRequest {
  tourId: string;
  departureId?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  numberOfGuests: number;
  specialRequest?: string;
  couponCode?: string;
  guests?: CreateBookingGuestRequest[];
}

// ---------------------------------------------------------------------------
// Booking API
// ---------------------------------------------------------------------------

export const bookingApi = {
  create: (data: CreateBookingRequest) =>
    api.post<ApiSuccess<Booking>>("/bookings", data),

  listMine: (query?: PaginationQuery) =>
    api.get<ApiPaginatedResponse<Booking>>(
      "/bookings/my",
      query as Record<string, string | number | boolean | undefined>
    ),

  getByCode: (code: string) =>
    api.get<ApiSuccess<Booking>>(`/bookings/${code}`),

  cancel: (code: string) =>
    api.put<ApiSuccess<Booking>>(`/bookings/${code}/cancel`),
};
