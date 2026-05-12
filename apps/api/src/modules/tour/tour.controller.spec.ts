/**
 * TourController unit tests — Task 48, Req 24, Design §11.2
 *
 * Tests the HTTP layer (controller methods) with a fully mocked TourService.
 * No real DB, no real JWT verification needed.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundException } from "@nestjs/common";
import { TourController } from "./tour.controller";
import { TourService } from "./tour.service";

// ---------------------------------------------------------------------------
// Mock factory
// ---------------------------------------------------------------------------

function makeTourService(): TourService {
  return {
    findAll: vi.fn(),
    findFeatured: vi.fn(),
    findBySlug: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
    addItinerary: vi.fn(),
    updateItinerary: vi.fn(),
    deleteItinerary: vi.fn(),
    addDeparture: vi.fn(),
    updateDeparture: vi.fn(),
    deleteDeparture: vi.fn(),
  } as unknown as TourService;
}

// ---------------------------------------------------------------------------
// Shared test data
// ---------------------------------------------------------------------------

const MOCK_TOUR = {
  id: "tour-id-1",
  title: "Northern Vietnam Adventure",
  slug: "northern-vietnam-adventure",
  destinationId: "dest-id-1",
  description: "A great tour through northern Vietnam",
  shortDescription: "Great tour",
  durationDays: 6,
  durationNights: 5,
  basePrice: 10_000_000,
  salePrice: null,
  maxGuests: 16,
  minGuests: 2,
  availableSlots: 12,
  status: "ACTIVE",
  featured: true,
  imageUrl: "https://example.com/tour.jpg",
  category: "adventure",
  avgRating: 4.5,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

const MOCK_PAGINATED_RESULT = {
  items: [MOCK_TOUR],
  page: 0,
  size: 10,
  totalElements: 1,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("TourController", () => {
  let controller: TourController;
  let service: TourService;

  beforeEach(() => {
    service = makeTourService();
    controller = new TourController(service);
  });

  // -------------------------------------------------------------------------
  // findAll
  // -------------------------------------------------------------------------

  describe("findAll", () => {
    it("calls tourService.findAll with query and returns paginated list", async () => {
      const query = { page: 0, size: 10, keyword: "vietnam" };
      vi.mocked(service.findAll).mockResolvedValue(MOCK_PAGINATED_RESULT as any);

      const result = await controller.findAll(query as any);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(MOCK_PAGINATED_RESULT);
    });

    it("returns paginated result with items array", async () => {
      vi.mocked(service.findAll).mockResolvedValue(MOCK_PAGINATED_RESULT as any);

      const result = await controller.findAll({} as any);

      expect(result.items).toHaveLength(1);
      expect(result.totalElements).toBe(1);
    });

    it("returns empty paginated result when no tours match", async () => {
      const emptyResult = {
        items: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
      };
      vi.mocked(service.findAll).mockResolvedValue(emptyResult as any);

      const result = await controller.findAll({ keyword: "nonexistent" } as any);

      expect(result.items).toHaveLength(0);
      expect(result.totalElements).toBe(0);
    });

    it("passes filter params (minPrice, maxPrice, category) to service", async () => {
      const query = { minPrice: 1_000_000, maxPrice: 5_000_000, category: "beach" };
      vi.mocked(service.findAll).mockResolvedValue(MOCK_PAGINATED_RESULT as any);

      await controller.findAll(query as any);

      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  // -------------------------------------------------------------------------
  // findFeatured
  // -------------------------------------------------------------------------

  describe("findFeatured", () => {
    it("calls tourService.findFeatured and returns array of featured tours", async () => {
      vi.mocked(service.findFeatured).mockResolvedValue([MOCK_TOUR] as any);

      const result = await controller.findFeatured();

      expect(service.findFeatured).toHaveBeenCalledOnce();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    it("returns empty array when no featured tours exist", async () => {
      vi.mocked(service.findFeatured).mockResolvedValue([]);

      const result = await controller.findFeatured();

      expect(result).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // findBySlug
  // -------------------------------------------------------------------------

  describe("findBySlug", () => {
    it("calls tourService.findBySlug with slug and returns tour detail", async () => {
      vi.mocked(service.findBySlug).mockResolvedValue(MOCK_TOUR as any);

      const result = await controller.findBySlug("northern-vietnam-adventure");

      expect(service.findBySlug).toHaveBeenCalledWith("northern-vietnam-adventure");
      expect(result).toEqual(MOCK_TOUR);
    });

    it("propagates NotFoundException when tour slug does not exist", async () => {
      vi.mocked(service.findBySlug).mockRejectedValue(
        new NotFoundException("Tour not found")
      );

      await expect(
        controller.findBySlug("nonexistent-slug")
      ).rejects.toThrow(NotFoundException);
    });

    it("returns tour with avgRating field", async () => {
      const tourWithRating = { ...MOCK_TOUR, avgRating: 4.8 };
      vi.mocked(service.findBySlug).mockResolvedValue(tourWithRating as any);

      const result = await controller.findBySlug("northern-vietnam-adventure") as typeof tourWithRating;

      expect(result.avgRating).toBe(4.8);
    });
  });

  // -------------------------------------------------------------------------
  // create (admin)
  // -------------------------------------------------------------------------

  describe("create", () => {
    it("calls tourService.create with dto and returns created tour", async () => {
      const dto = {
        title: "New Tour",
        destinationId: "dest-id-1",
        description: "A new tour",
        durationDays: 3,
        durationNights: 2,
        basePrice: 5_000_000,
        maxGuests: 10,
        availableSlots: 10,
      };
      vi.mocked(service.create).mockResolvedValue({ ...MOCK_TOUR, ...dto } as any);

      const result = await controller.create(dto as any);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toBeDefined();
    });
  });

  // -------------------------------------------------------------------------
  // softDelete (admin)
  // -------------------------------------------------------------------------

  describe("softDelete", () => {
    it("calls tourService.softDelete with id", async () => {
      vi.mocked(service.softDelete).mockResolvedValue(undefined);

      await controller.softDelete("tour-id-1");

      expect(service.softDelete).toHaveBeenCalledWith("tour-id-1");
    });

    it("propagates NotFoundException when tour does not exist", async () => {
      vi.mocked(service.softDelete).mockRejectedValue(
        new NotFoundException("Tour not found")
      );

      await expect(controller.softDelete("nonexistent-id")).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
