import { BadRequestException, NotFoundException } from '@nestjs/common';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TourService } from './tour.service';

// ---------------------------------------------------------------------------
// Mock factory
// ---------------------------------------------------------------------------

function makePrisma() {
  return {
    tour: {
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    destination: {
      findUnique: vi.fn(),
    },
    review: {
      aggregate: vi.fn().mockResolvedValue({ _avg: { rating: null } }),
      groupBy: vi.fn().mockResolvedValue([]),
    },
    tourItinerary: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    tourDeparture: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
}

// ---------------------------------------------------------------------------
// Shared test data
// ---------------------------------------------------------------------------

const MOCK_DESTINATION = {
  id: 'dest-id-1',
  name: 'Hạ Long Bay',
  slug: 'ha-long-bay',
  status: 'ACTIVE',
};

const MOCK_TOUR = {
  id: 'tour-id-1',
  slug: 'northern-vietnam-adventure',
  title: 'Northern Vietnam Adventure',
  destinationId: 'dest-id-1',
  description: 'A great tour',
  shortDescription: null,
  durationDays: 6,
  durationNights: 5,
  basePrice: 10000000,
  salePrice: null,
  maxGuests: 16,
  minGuests: 2,
  availableSlots: 12,
  startDate: null,
  endDate: null,
  status: 'ACTIVE',
  featured: false,
  imageUrl: null,
  category: 'adventure',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('TourService', () => {
  let service: TourService;
  let prisma: ReturnType<typeof makePrisma>;

  beforeEach(() => {
    prisma = makePrisma();
    service = new TourService(prisma as any);
  });

  // -------------------------------------------------------------------------
  // findAll
  // -------------------------------------------------------------------------

  describe('findAll', () => {
    it('applies keyword filter to title and description', async () => {
      await service.findAll({ keyword: 'beach', page: 0, size: 10 });

      expect(prisma.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                title: expect.objectContaining({ contains: 'beach' }),
              }),
              expect.objectContaining({
                description: expect.objectContaining({ contains: 'beach' }),
              }),
            ]),
          }),
        }),
      );
    });

    it('applies price range filter with gte and lte', async () => {
      await service.findAll({ minPrice: 1000000, maxPrice: 5000000, page: 0, size: 10 });

      expect(prisma.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            basePrice: { gte: 1000000, lte: 5000000 },
          }),
        }),
      );
    });

    it('applies only minPrice when maxPrice is omitted', async () => {
      await service.findAll({ minPrice: 2000000, page: 0, size: 10 });

      expect(prisma.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            basePrice: { gte: 2000000 },
          }),
        }),
      );
    });

    it('applies category filter', async () => {
      await service.findAll({ category: 'beach', page: 0, size: 10 });

      expect(prisma.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: expect.objectContaining({ contains: 'beach' }),
          }),
        }),
      );
    });

    it('only returns ACTIVE tours', async () => {
      await service.findAll({ page: 0, size: 10 });

      expect(prisma.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'ACTIVE' }),
        }),
      );
    });

    it('returns paginated result with items and totalElements', async () => {
      prisma.tour.findMany.mockResolvedValue([MOCK_TOUR]);
      prisma.tour.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 0, size: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.totalElements).toBe(1);
    });
  });

  // -------------------------------------------------------------------------
  // create
  // -------------------------------------------------------------------------

  describe('create', () => {
    it('throws BadRequestException when basePrice is negative', async () => {
      prisma.destination.findUnique.mockResolvedValue(MOCK_DESTINATION);

      await expect(
        service.create({
          title: 'Test Tour',
          destinationId: 'dest-id-1',
          description: 'desc',
          durationDays: 3,
          durationNights: 2,
          basePrice: -1,
          maxGuests: 10,
          availableSlots: 10,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when maxGuests is 0', async () => {
      prisma.destination.findUnique.mockResolvedValue(MOCK_DESTINATION);

      await expect(
        service.create({
          title: 'Test Tour',
          destinationId: 'dest-id-1',
          description: 'desc',
          durationDays: 3,
          durationNights: 2,
          basePrice: 1000000,
          maxGuests: 0,
          availableSlots: 10,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when destination does not exist', async () => {
      prisma.destination.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          title: 'Test Tour',
          destinationId: 'nonexistent-dest',
          description: 'desc',
          durationDays: 3,
          durationNights: 2,
          basePrice: 1000000,
          maxGuests: 10,
          availableSlots: 10,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when startDate >= endDate', async () => {
      prisma.destination.findUnique.mockResolvedValue(MOCK_DESTINATION);

      await expect(
        service.create({
          title: 'Test Tour',
          destinationId: 'dest-id-1',
          description: 'desc',
          durationDays: 3,
          durationNights: 2,
          basePrice: 1000000,
          maxGuests: 10,
          availableSlots: 10,
          startDate: '2026-12-31',
          endDate: '2026-01-01',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when startDate equals endDate', async () => {
      prisma.destination.findUnique.mockResolvedValue(MOCK_DESTINATION);

      await expect(
        service.create({
          title: 'Test Tour',
          destinationId: 'dest-id-1',
          description: 'desc',
          durationDays: 3,
          durationNights: 2,
          basePrice: 1000000,
          maxGuests: 10,
          availableSlots: 10,
          startDate: '2026-06-01',
          endDate: '2026-06-01',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('creates tour with auto-generated slug from title', async () => {
      prisma.destination.findUnique.mockResolvedValue(MOCK_DESTINATION);
      // slug not taken
      prisma.tour.findUnique.mockResolvedValue(null);
      prisma.tour.create.mockResolvedValue(MOCK_TOUR);

      await service.create({
        title: 'Northern Vietnam Adventure',
        destinationId: 'dest-id-1',
        description: 'desc',
        durationDays: 6,
        durationNights: 5,
        basePrice: 10000000,
        maxGuests: 16,
        availableSlots: 12,
      });

      expect(prisma.tour.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: 'northern-vietnam-adventure',
            title: 'Northern Vietnam Adventure',
          }),
        }),
      );
    });

    it('appends -1 suffix when base slug already exists', async () => {
      prisma.destination.findUnique.mockResolvedValue(MOCK_DESTINATION);
      // First call (base slug) returns existing tour, second call (-1 suffix) returns null
      prisma.tour.findUnique
        .mockResolvedValueOnce(MOCK_TOUR) // "northern-vietnam-adventure" exists
        .mockResolvedValueOnce(null); // "northern-vietnam-adventure-1" is free
      prisma.tour.create.mockResolvedValue({
        ...MOCK_TOUR,
        slug: 'northern-vietnam-adventure-1',
      });

      await service.create({
        title: 'Northern Vietnam Adventure',
        destinationId: 'dest-id-1',
        description: 'desc',
        durationDays: 6,
        durationNights: 5,
        basePrice: 10000000,
        maxGuests: 16,
        availableSlots: 12,
      });

      expect(prisma.tour.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: 'northern-vietnam-adventure-1',
          }),
        }),
      );
    });

    it('does not call tour.create when validation fails', async () => {
      prisma.destination.findUnique.mockResolvedValue(MOCK_DESTINATION);

      await expect(
        service.create({
          title: 'Bad Tour',
          destinationId: 'dest-id-1',
          description: 'desc',
          durationDays: 3,
          durationNights: 2,
          basePrice: -100,
          maxGuests: 10,
          availableSlots: 10,
        }),
      ).rejects.toThrow(BadRequestException);

      expect(prisma.tour.create).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // softDelete
  // -------------------------------------------------------------------------

  describe('softDelete', () => {
    it('throws NotFoundException when tour does not exist', async () => {
      prisma.tour.findUnique.mockResolvedValue(null);

      await expect(service.softDelete('nonexistent-id')).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when tour is already deleted', async () => {
      prisma.tour.findUnique.mockResolvedValue({
        ...MOCK_TOUR,
        status: 'DELETED',
      });

      await expect(service.softDelete('tour-id-1')).rejects.toThrow(NotFoundException);
    });

    it('sets status to DELETED on soft delete', async () => {
      prisma.tour.findUnique.mockResolvedValue(MOCK_TOUR);
      prisma.tour.update.mockResolvedValue({ ...MOCK_TOUR, status: 'DELETED' });

      await service.softDelete('tour-id-1');

      expect(prisma.tour.update).toHaveBeenCalledWith({
        where: { id: 'tour-id-1' },
        data: { status: 'DELETED' },
      });
    });

    it('does not call tour.update when tour is not found', async () => {
      prisma.tour.findUnique.mockResolvedValue(null);

      await expect(service.softDelete('nonexistent-id')).rejects.toThrow(NotFoundException);

      expect(prisma.tour.update).not.toHaveBeenCalled();
    });
  });
});
