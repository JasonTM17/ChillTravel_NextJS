import { describe, it, expect, vi, beforeEach } from "vitest";
import { BadRequestException, ForbiddenException, NotFoundException } from "@nestjs/common";
import { BookingService } from "../booking.service";

// ---------------------------------------------------------------------------
// Mock factories
// ---------------------------------------------------------------------------

/**
 * Build a mock PrismaService. The $transaction mock executes the callback
 * with the SAME mock object so all vi.fn() setups apply inside the tx.
 */
function makePrisma() {
  const mock: Record<string, unknown> = {};

  mock["tour"] = {
    findUnique: vi.fn(),
    update: vi.fn().mockResolvedValue({}),
  };
  mock["tourDeparture"] = {
    findUnique: vi.fn(),
    update: vi.fn().mockResolvedValue({}),
  };
  mock["booking"] = {
    findUnique: vi.fn(),
    findMany: vi.fn().mockResolvedValue([]),
    count: vi.fn().mockResolvedValue(0),
    create: vi.fn(),
    update: vi.fn(),
  };
  mock["bookingGuest"] = {
    createMany: vi.fn().mockResolvedValue({ count: 0 }),
  };
  mock["payment"] = {
    create: vi.fn().mockResolvedValue({}),
    findUnique: vi.fn(),
    update: vi.fn().mockResolvedValue({}),
  };
  mock["coupon"] = {
    findUnique: vi.fn(),
    update: vi.fn().mockResolvedValue({}),
  };
  mock["user"] = {
    findUnique: vi.fn().mockResolvedValue(null),
  };

  // $transaction executes the callback with the same mock so all stubs apply
  mock["$transaction"] = vi.fn().mockImplementation(
    async (cb: (tx: unknown) => Promise<unknown>) => cb(mock)
  );

  return mock as unknown as {
    tour: { findUnique: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };
    tourDeparture: { findUnique: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };
    booking: {
      findUnique: ReturnType<typeof vi.fn>;
      findMany: ReturnType<typeof vi.fn>;
      count: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
    };
    bookingGuest: { createMany: ReturnType<typeof vi.fn> };
    payment: {
      create: ReturnType<typeof vi.fn>;
      findUnique: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
    };
    coupon: { findUnique: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };
    user: { findUnique: ReturnType<typeof vi.fn> };
    $transaction: ReturnType<typeof vi.fn>;
  };
}

function makeEmail() {
  return {
    sendBookingConfirmation: vi.fn(),
    sendBookingStatusUpdate: vi.fn(),
    sendEmailVerification: vi.fn(),
    sendReviewApproved: vi.fn(),
    sendPasswordReset: vi.fn(),
  };
}

// ---------------------------------------------------------------------------
// Shared test data
// ---------------------------------------------------------------------------

const MOCK_TOUR = {
  id: "tour-id-1",
  title: "Northern Vietnam Adventure",
  slug: "northern-vietnam-adventure",
  destinationId: "dest-id-1",
  basePrice: 10_000_000,
  salePrice: null as number | null,
  maxGuests: 16,
  minGuests: 2,
  availableSlots: 12,
  status: "ACTIVE",
  featured: false,
};

const MOCK_BOOKING_ROW = {
  id: "booking-id-1",
  bookingCode: "WV-20260511-AAAAAA",
  userId: "user-id-1",
  tourId: "tour-id-1",
  departureId: null as string | null,
  couponId: null as string | null,
  contactName: "Test User",
  contactEmail: "user@wanderviet.com",
  contactPhone: "0901234567",
  numberOfGuests: 2,
  totalAmount: 20_000_000,
  discountAmount: 0,
  status: "pending",
  paymentStatus: "pending",
  paymentMethod: "MOCK_CARD",
  isDemo: true,
  bookingDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const BASE_CREATE_DTO = {
  tourId: "tour-id-1",
  contactName: "Test User",
  contactEmail: "user@wanderviet.com",
  contactPhone: "0901234567",
  numberOfGuests: 2,
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("BookingService", () => {
  let service: BookingService;
  let prisma: ReturnType<typeof makePrisma>;
  let email: ReturnType<typeof makeEmail>;

  beforeEach(() => {
    prisma = makePrisma();
    email = makeEmail();
    service = new BookingService(prisma as never, email as never);
  });

  // -------------------------------------------------------------------------
  // createBooking
  // -------------------------------------------------------------------------

  describe("createBooking", () => {
    it("creates booking with correct totalAmount using basePrice", async () => {
      prisma.tour.findUnique.mockResolvedValue(MOCK_TOUR);
      // booking.findUnique for code collision check → null (code free)
      prisma.booking.findUnique
        .mockResolvedValueOnce(null)   // collision check
        .mockResolvedValueOnce({ ...MOCK_BOOKING_ROW }); // final fetch with relations
      prisma.booking.create.mockResolvedValue(MOCK_BOOKING_ROW);

      const result = await service.createBooking("user-id-1", BASE_CREATE_DTO);

      expect(prisma.booking.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            totalAmount: 20_000_000, // 10_000_000 * 2
            discountAmount: 0,
            status: "pending",
            paymentStatus: "pending",
            isDemo: true,
          }),
        })
      );
      expect(result).toBeDefined();
    });

    it("uses salePrice instead of basePrice when salePrice is set", async () => {
      const tourWithSale = { ...MOCK_TOUR, salePrice: 8_000_000 };
      prisma.tour.findUnique.mockResolvedValue(tourWithSale);
      prisma.booking.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ ...MOCK_BOOKING_ROW, totalAmount: 16_000_000 });
      prisma.booking.create.mockResolvedValue({ ...MOCK_BOOKING_ROW, totalAmount: 16_000_000 });

      await service.createBooking("user-id-1", BASE_CREATE_DTO);

      expect(prisma.booking.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            totalAmount: 16_000_000, // 8_000_000 * 2
          }),
        })
      );
    });

    it("applies PERCENT coupon discount correctly", async () => {
      prisma.tour.findUnique.mockResolvedValue(MOCK_TOUR);
      prisma.coupon.findUnique.mockResolvedValue({
        id: "coupon-id-1",
        code: "WVWELCOME10",
        discountType: "PERCENT",
        discountValue: 10,
        minBookingAmount: 1_000_000,
        maxDiscountAmount: 2_000_000,
        usageLimit: 100,
        usedCount: 0,
        validFrom: new Date(Date.now() - 86400_000),
        validTo: new Date(Date.now() + 86400_000),
        isActive: true,
      });
      prisma.booking.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ ...MOCK_BOOKING_ROW, totalAmount: 18_000_000, discountAmount: 2_000_000 });
      prisma.booking.create.mockResolvedValue({ ...MOCK_BOOKING_ROW, totalAmount: 18_000_000 });

      await service.createBooking("user-id-1", { ...BASE_CREATE_DTO, couponCode: "WVWELCOME10" });

      // 10% of 20_000_000 = 2_000_000 (within maxDiscountAmount cap)
      expect(prisma.booking.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            totalAmount: 18_000_000,
            discountAmount: 2_000_000,
          }),
        })
      );
    });

    it("applies FIXED coupon discount correctly", async () => {
      prisma.tour.findUnique.mockResolvedValue(MOCK_TOUR);
      prisma.coupon.findUnique.mockResolvedValue({
        id: "coupon-id-2",
        code: "WV500K",
        discountType: "FIXED",
        discountValue: 500_000,
        minBookingAmount: 3_000_000,
        maxDiscountAmount: null,
        usageLimit: null,
        usedCount: 0,
        validFrom: new Date(Date.now() - 86400_000),
        validTo: new Date(Date.now() + 86400_000),
        isActive: true,
      });
      prisma.booking.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ ...MOCK_BOOKING_ROW, totalAmount: 19_500_000, discountAmount: 500_000 });
      prisma.booking.create.mockResolvedValue({ ...MOCK_BOOKING_ROW, totalAmount: 19_500_000 });

      await service.createBooking("user-id-1", { ...BASE_CREATE_DTO, couponCode: "WV500K" });

      expect(prisma.booking.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            totalAmount: 19_500_000,
            discountAmount: 500_000,
          }),
        })
      );
    });

    it("throws BadRequestException when numberOfGuests > tour.availableSlots", async () => {
      prisma.tour.findUnique.mockResolvedValue({ ...MOCK_TOUR, availableSlots: 1 });

      await expect(
        service.createBooking("user-id-1", { ...BASE_CREATE_DTO, numberOfGuests: 5 })
      ).rejects.toThrow(BadRequestException);

      expect(prisma.booking.create).not.toHaveBeenCalled();
    });

    it("throws BadRequestException when tour is INACTIVE", async () => {
      prisma.tour.findUnique.mockResolvedValue({ ...MOCK_TOUR, status: "INACTIVE" });

      await expect(
        service.createBooking("user-id-1", BASE_CREATE_DTO)
      ).rejects.toThrow(BadRequestException);
    });

    it("throws BadRequestException when tour is DELETED", async () => {
      prisma.tour.findUnique.mockResolvedValue({ ...MOCK_TOUR, status: "DELETED" });

      await expect(
        service.createBooking("user-id-1", BASE_CREATE_DTO)
      ).rejects.toThrow(BadRequestException);
    });

    it("throws BadRequestException when tour is not found", async () => {
      prisma.tour.findUnique.mockResolvedValue(null);

      await expect(
        service.createBooking("user-id-1", BASE_CREATE_DTO)
      ).rejects.toThrow(BadRequestException);
    });

    it("generates booking code in WV-YYYYMMDD-XXXXXX format", async () => {
      prisma.tour.findUnique.mockResolvedValue(MOCK_TOUR);
      prisma.booking.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(MOCK_BOOKING_ROW);
      prisma.booking.create.mockResolvedValue(MOCK_BOOKING_ROW);

      await service.createBooking("user-id-1", BASE_CREATE_DTO);

      const createCall = prisma.booking.create.mock.calls[0][0] as { data: { bookingCode: string } };
      expect(createCall.data.bookingCode).toMatch(/^WV-\d{8}-[0-9A-F]{6}$/);
    });
  });

  // -------------------------------------------------------------------------
  // cancelBooking
  // -------------------------------------------------------------------------

  describe("cancelBooking", () => {
    it("cancels PENDING booking without restoring slots", async () => {
      prisma.booking.findUnique.mockResolvedValue({ ...MOCK_BOOKING_ROW, status: "pending" });
      prisma.booking.update.mockResolvedValue({ ...MOCK_BOOKING_ROW, status: "cancelled" });

      await service.cancelBooking("user-id-1", "WV-20260511-AAAAAA");

      expect(prisma.booking.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: "cancelled" } })
      );
      // No slot restore for PENDING
      expect(prisma.tour.update).not.toHaveBeenCalled();
    });

    it("cancels CONFIRMED booking and restores tour.availableSlots", async () => {
      prisma.booking.findUnique.mockResolvedValue({
        ...MOCK_BOOKING_ROW,
        status: "confirmed",
        numberOfGuests: 2,
        tourId: "tour-id-1",
        departureId: null,
      });
      prisma.booking.update.mockResolvedValue({ ...MOCK_BOOKING_ROW, status: "cancelled" });

      await service.cancelBooking("user-id-1", "WV-20260511-AAAAAA");

      expect(prisma.tour.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "tour-id-1" },
          data: { availableSlots: { increment: 2 } },
        })
      );
    });

    it("cancels CONFIRMED booking with departure and restores departure slots", async () => {
      prisma.booking.findUnique.mockResolvedValue({
        ...MOCK_BOOKING_ROW,
        status: "confirmed",
        numberOfGuests: 3,
        tourId: "tour-id-1",
        departureId: "dep-id-1",
      });
      prisma.booking.update.mockResolvedValue({ ...MOCK_BOOKING_ROW, status: "cancelled" });

      await service.cancelBooking("user-id-1", "WV-20260511-AAAAAA");

      expect(prisma.tourDeparture.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "dep-id-1" },
          data: { availableSlots: { increment: 3 } },
        })
      );
    });

    it("throws BadRequestException when cancelling COMPLETED booking", async () => {
      prisma.booking.findUnique.mockResolvedValue({ ...MOCK_BOOKING_ROW, status: "completed" });

      await expect(
        service.cancelBooking("user-id-1", "WV-20260511-AAAAAA")
      ).rejects.toThrow(BadRequestException);
    });

    it("throws BadRequestException when cancelling already CANCELLED booking", async () => {
      prisma.booking.findUnique.mockResolvedValue({ ...MOCK_BOOKING_ROW, status: "cancelled" });

      await expect(
        service.cancelBooking("user-id-1", "WV-20260511-AAAAAA")
      ).rejects.toThrow(BadRequestException);
    });

    it("throws ForbiddenException when cancelling another user's booking", async () => {
      prisma.booking.findUnique.mockResolvedValue({ ...MOCK_BOOKING_ROW, userId: "other-user-id" });

      await expect(
        service.cancelBooking("user-id-1", "WV-20260511-AAAAAA")
      ).rejects.toThrow(ForbiddenException);
    });

    it("throws NotFoundException when booking code does not exist", async () => {
      prisma.booking.findUnique.mockResolvedValue(null);

      await expect(
        service.cancelBooking("user-id-1", "WV-NONEXISTENT")
      ).rejects.toThrow(NotFoundException);
    });
  });

  // -------------------------------------------------------------------------
  // getByCode
  // -------------------------------------------------------------------------

  describe("getByCode", () => {
    it("returns booking when user is the owner", async () => {
      prisma.booking.findUnique.mockResolvedValue({ ...MOCK_BOOKING_ROW, userId: "user-id-1" });

      const result = await service.getByCode("user-id-1", "WV-20260511-AAAAAA");

      expect(result).toBeDefined();
      expect(result?.userId).toBe("user-id-1");
    });

    it("throws ForbiddenException when user is not the owner", async () => {
      prisma.booking.findUnique.mockResolvedValue({ ...MOCK_BOOKING_ROW, userId: "other-user-id" });

      await expect(
        service.getByCode("user-id-1", "WV-20260511-AAAAAA")
      ).rejects.toThrow(ForbiddenException);
    });

    it("throws NotFoundException when booking does not exist", async () => {
      prisma.booking.findUnique.mockResolvedValue(null);

      await expect(
        service.getByCode("user-id-1", "WV-NONEXISTENT")
      ).rejects.toThrow(NotFoundException);
    });
  });
});
