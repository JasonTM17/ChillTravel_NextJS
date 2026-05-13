/**
 * BookingController unit tests — Task 48, Req 24, Design §11.2
 *
 * Tests the HTTP layer (controller methods) with a fully mocked BookingService.
 * No real DB, no real JWT verification needed.
 */
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AuthenticatedUser } from '../common/strategies/jwt.strategy';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

// ---------------------------------------------------------------------------
// Mock factory
// ---------------------------------------------------------------------------

function makeBookingService(): BookingService {
  return {
    createBooking: vi.fn(),
    listMyBookings: vi.fn(),
    getByCode: vi.fn(),
    cancelBooking: vi.fn(),
    create: vi.fn(),
    find: vi.fn(),
    cancel: vi.fn(),
  } as unknown as BookingService;
}

// ---------------------------------------------------------------------------
// Shared test data
// ---------------------------------------------------------------------------

const MOCK_AUTHENTICATED_USER: AuthenticatedUser = {
  id: 'user-id-1',
  email: 'user@wanderviet.com',
  role: 'USER',
};

const MOCK_BOOKING = {
  id: 'booking-id-1',
  bookingCode: 'WV-20260511-AAAAAA',
  userId: 'user-id-1',
  tourId: 'tour-id-1',
  contactName: 'Test User',
  contactEmail: 'user@wanderviet.com',
  contactPhone: '0901234567',
  numberOfGuests: 2,
  totalAmount: 20_000_000,
  discountAmount: 0,
  status: 'pending',
  paymentStatus: 'pending',
  paymentMethod: 'MOCK_CARD',
  isDemo: true,
  bookingDate: new Date('2026-05-11T00:00:00.000Z'),
  createdAt: new Date('2026-05-11T00:00:00.000Z'),
  updatedAt: new Date('2026-05-11T00:00:00.000Z'),
  tour: {
    id: 'tour-id-1',
    title: 'Northern Vietnam Adventure',
    slug: 'northern-vietnam-adventure',
    imageUrl: null,
    durationDays: 6,
    durationNights: 5,
  },
  guests: [] as {
    id: string;
    bookingId: string;
    fullName: string;
    dateOfBirth: Date | null;
    gender: string | null;
    note: string | null;
  }[],
  payment: {
    id: 'payment-id-1',
    status: 'pending',
    amount: 20_000_000,
    paidAt: null,
  },
};

const MOCK_PAGINATED_BOOKINGS = {
  items: [MOCK_BOOKING],
  page: 0,
  size: 10,
  totalElements: 1,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
};

const BASE_CREATE_DTO = {
  tourId: 'tour-id-1',
  contactName: 'Test User',
  contactEmail: 'user@wanderviet.com',
  contactPhone: '0901234567',
  numberOfGuests: 2,
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('BookingController', () => {
  let controller: BookingController;
  let service: BookingService;

  beforeEach(() => {
    service = makeBookingService();
    controller = new BookingController(service);
  });

  // -------------------------------------------------------------------------
  // createBooking
  // -------------------------------------------------------------------------

  describe('createBooking', () => {
    it('calls bookingService.createBooking with userId and dto, returns booking', async () => {
      vi.mocked(service.createBooking).mockResolvedValue(MOCK_BOOKING as any);

      const result = await controller.createBooking(
        MOCK_AUTHENTICATED_USER,
        BASE_CREATE_DTO as any,
      );

      expect(service.createBooking).toHaveBeenCalledWith('user-id-1', BASE_CREATE_DTO);
      expect(result).toEqual(MOCK_BOOKING);
    });

    it('propagates BadRequestException when tour is not available', async () => {
      vi.mocked(service.createBooking).mockRejectedValue(
        new BadRequestException('Tour không khả dụng'),
      );

      await expect(
        controller.createBooking(MOCK_AUTHENTICATED_USER, BASE_CREATE_DTO as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('propagates BadRequestException when not enough slots', async () => {
      vi.mocked(service.createBooking).mockRejectedValue(new BadRequestException('Không đủ chỗ'));

      await expect(
        controller.createBooking(MOCK_AUTHENTICATED_USER, {
          ...BASE_CREATE_DTO,
          numberOfGuests: 100,
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('returns booking with isDemo:true (mock payment label)', async () => {
      vi.mocked(service.createBooking).mockResolvedValue(MOCK_BOOKING as any);

      const result = (await controller.createBooking(
        MOCK_AUTHENTICATED_USER,
        BASE_CREATE_DTO as any,
      )) as any;

      expect(result.isDemo).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // listMyBookings
  // -------------------------------------------------------------------------

  describe('listMyBookings', () => {
    it('calls bookingService.listMyBookings with userId and query, returns paginated list', async () => {
      const query = { page: 0, size: 10 };
      vi.mocked(service.listMyBookings).mockResolvedValue(MOCK_PAGINATED_BOOKINGS as any);

      const result = await controller.listMyBookings(MOCK_AUTHENTICATED_USER, query as any);

      expect(service.listMyBookings).toHaveBeenCalledWith('user-id-1', query);
      expect(result).toEqual(MOCK_PAGINATED_BOOKINGS);
    });

    it('returns paginated result with items array', async () => {
      vi.mocked(service.listMyBookings).mockResolvedValue(MOCK_PAGINATED_BOOKINGS as any);

      const result = await controller.listMyBookings(MOCK_AUTHENTICATED_USER, {
        page: 0,
        size: 10,
      } as any);

      expect(result.items).toHaveLength(1);
      expect(result.totalElements).toBe(1);
    });

    it('returns empty list when user has no bookings', async () => {
      const emptyResult = {
        items: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
      };
      vi.mocked(service.listMyBookings).mockResolvedValue(emptyResult as any);

      const result = await controller.listMyBookings(MOCK_AUTHENTICATED_USER, {} as any);

      expect(result.items).toHaveLength(0);
    });
  });

  // -------------------------------------------------------------------------
  // getByCode
  // -------------------------------------------------------------------------

  describe('getByCode', () => {
    it('calls bookingService.getByCode with userId and bookingCode, returns booking', async () => {
      vi.mocked(service.getByCode).mockResolvedValue(MOCK_BOOKING as any);

      const result = await controller.getByCode(MOCK_AUTHENTICATED_USER, 'WV-20260511-AAAAAA');

      expect(service.getByCode).toHaveBeenCalledWith('user-id-1', 'WV-20260511-AAAAAA');
      expect(result).toEqual(MOCK_BOOKING);
    });

    it('propagates NotFoundException when booking code does not exist', async () => {
      vi.mocked(service.getByCode).mockRejectedValue(
        new NotFoundException('Không tìm thấy booking'),
      );

      await expect(controller.getByCode(MOCK_AUTHENTICATED_USER, 'WV-NONEXISTENT')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('propagates ForbiddenException when user is not the booking owner', async () => {
      vi.mocked(service.getByCode).mockRejectedValue(
        new ForbiddenException('Bạn không có quyền xem booking này'),
      );

      await expect(
        controller.getByCode(MOCK_AUTHENTICATED_USER, 'WV-20260511-AAAAAA'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // -------------------------------------------------------------------------
  // cancelBooking
  // -------------------------------------------------------------------------

  describe('cancelBooking', () => {
    it('calls bookingService.cancelBooking with userId and bookingCode, returns cancelled booking', async () => {
      const cancelledBooking = { ...MOCK_BOOKING, status: 'cancelled' };
      vi.mocked(service.cancelBooking).mockResolvedValue(cancelledBooking as any);

      const result = (await controller.cancelBooking(
        MOCK_AUTHENTICATED_USER,
        'WV-20260511-AAAAAA',
      )) as any;

      expect(service.cancelBooking).toHaveBeenCalledWith('user-id-1', 'WV-20260511-AAAAAA');
      expect(result.status).toBe('cancelled');
    });

    it('propagates BadRequestException when booking cannot be cancelled (COMPLETED)', async () => {
      vi.mocked(service.cancelBooking).mockRejectedValue(
        new BadRequestException('Không thể hủy booking này'),
      );

      await expect(
        controller.cancelBooking(MOCK_AUTHENTICATED_USER, 'WV-20260511-AAAAAA'),
      ).rejects.toThrow(BadRequestException);
    });

    it('propagates ForbiddenException when user is not the booking owner', async () => {
      vi.mocked(service.cancelBooking).mockRejectedValue(
        new ForbiddenException('Bạn không có quyền hủy booking này'),
      );

      await expect(
        controller.cancelBooking(MOCK_AUTHENTICATED_USER, 'WV-20260511-AAAAAA'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('propagates NotFoundException when booking code does not exist', async () => {
      vi.mocked(service.cancelBooking).mockRejectedValue(
        new NotFoundException('Không tìm thấy booking'),
      );

      await expect(
        controller.cancelBooking(MOCK_AUTHENTICATED_USER, 'WV-NONEXISTENT'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
