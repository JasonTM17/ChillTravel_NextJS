import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { ApiPaginated } from '@vietwander/shared';
import { buildPagination } from '../../common/dto/paginated-response.dto';
import { generateSlug, ensureUniqueSlug } from '../../common/utils/slug.util';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateDepartureDto } from './dto/create-departure.dto';
import type { CreateItineraryDto } from './dto/create-itinerary.dto';
import type { CreateTourDto } from './dto/create-tour.dto';
import type { TourQueryDto } from './dto/tour-query.dto';
import type { UpdateTourDto } from './dto/update-tour.dto';

/**
 * TourService — business logic for tours, itinerary, and departures.
 * Design §5.2 / Req 8, 9, 21, 34.
 */
@Injectable()
export class TourService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // Public: list with filters, sort, pagination
  // ---------------------------------------------------------------------------

  async findAll(query: TourQueryDto): Promise<ApiPaginated<unknown>> {
    const page = query.page ?? 0;
    const size = query.size ?? 10;
    const skip = page * size;

    // Build where clause — only ACTIVE tours
    const where: Record<string, unknown> = { status: 'ACTIVE' };

    if (query.keyword) {
      where['OR'] = [
        { title: { contains: query.keyword, mode: 'insensitive' } },
        { description: { contains: query.keyword, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where['category'] = { contains: query.category, mode: 'insensitive' };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (query.minPrice !== undefined) priceFilter['gte'] = query.minPrice;
      if (query.maxPrice !== undefined) priceFilter['lte'] = query.maxPrice;
      where['basePrice'] = priceFilter;
    }

    if (query.duration !== undefined) {
      where['durationDays'] = query.duration;
    }

    if (query.destinationId) {
      where['destinationId'] = query.destinationId;
    }

    // Build orderBy based on sortBy param
    const orderBy = this.buildOrderBy(query.sortBy);

    // For rating sort we need a different approach (raw aggregation)
    // For popular sort we use _count on bookings
    if (query.sortBy === 'rating') {
      // Fetch all matching IDs with avg rating, then paginate
      return this.findAllSortedByRating(where, page, size);
    }

    const [items, totalElements] = await Promise.all([
      this.prisma.tour.findMany({
        where,
        skip,
        take: size,
        orderBy,
        include: {
          destination: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        },
      }),
      this.prisma.tour.count({ where }),
    ]);

    return buildPagination(items, page, size, totalElements);
  }

  /**
   * Special handling for rating sort — compute avg rating per tour and sort.
   */
  private async findAllSortedByRating(
    where: Record<string, unknown>,
    page: number,
    size: number,
  ): Promise<ApiPaginated<unknown>> {
    // Get all matching tour IDs
    const allTours = await this.prisma.tour.findMany({
      where,
      select: { id: true },
    });

    const tourIds = allTours.map((t) => t.id);
    const totalElements = tourIds.length;

    if (totalElements === 0) {
      return buildPagination([], page, size, 0);
    }

    // Compute avg ratings for all matching tours
    const ratings = await this.prisma.review.groupBy({
      by: ['tourId'],
      where: {
        tourId: { in: tourIds },
        status: 'APPROVED',
      },
      _avg: { rating: true },
    });

    const ratingMap = new Map<string, number>();
    for (const r of ratings) {
      if (r.tourId) ratingMap.set(r.tourId, r._avg.rating ?? 0);
    }

    // Sort tour IDs by avg rating desc
    const sortedIds = tourIds.sort((a, b) => (ratingMap.get(b) ?? 0) - (ratingMap.get(a) ?? 0));

    // Paginate
    const pagedIds = sortedIds.slice(page * size, page * size + size);

    if (pagedIds.length === 0) {
      return buildPagination([], page, size, totalElements);
    }

    const items = await this.prisma.tour.findMany({
      where: { id: { in: pagedIds } },
      include: {
        destination: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      },
    });

    // Re-sort to match the sorted order
    const itemMap = new Map(items.map((t) => [t.id, t]));
    const orderedItems = pagedIds.map((id) => itemMap.get(id)).filter(Boolean);

    return buildPagination(orderedItems, page, size, totalElements);
  }

  // ---------------------------------------------------------------------------
  // Public: featured tours
  // ---------------------------------------------------------------------------

  async findFeatured(): Promise<unknown[]> {
    const tours = await this.prisma.tour.findMany({
      where: { featured: true, status: 'ACTIVE' },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        destination: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      },
    });
    return tours;
  }

  // ---------------------------------------------------------------------------
  // Public: get by slug
  // ---------------------------------------------------------------------------

  async findBySlug(slug: string): Promise<unknown> {
    const tour = await this.prisma.tour.findUnique({
      where: { slug },
      include: {
        destination: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        itinerary: { orderBy: { dayNumber: 'asc' } },
        departures: {
          where: {
            status: 'OPEN',
            departureDate: { gte: new Date() },
          },
          orderBy: { departureDate: 'asc' },
        },
      },
    });

    if (!tour || tour.status === 'DELETED') {
      throw new NotFoundException('Tour not found');
    }

    const avgRating = await this.computeAvgRating(tour.id);

    return { ...tour, avgRating };
  }

  // ---------------------------------------------------------------------------
  // Admin: create
  // ---------------------------------------------------------------------------

  async create(dto: CreateTourDto): Promise<unknown> {
    // Validate destination exists
    const destination = await this.prisma.destination.findUnique({
      where: { id: dto.destinationId },
    });
    if (!destination || destination.status === 'DELETED') {
      throw new NotFoundException('Destination not found');
    }

    // Validate price
    if (dto.basePrice < 0) {
      throw new BadRequestException('basePrice must be >= 0');
    }

    // Validate maxGuests
    if (dto.maxGuests < 1) {
      throw new BadRequestException('maxGuests must be > 0');
    }

    // Validate date range if both provided
    if (dto.startDate && dto.endDate) {
      const start = new Date(dto.startDate);
      const end = new Date(dto.endDate);
      if (start >= end) {
        throw new BadRequestException('startDate must be before endDate');
      }
    }

    // Generate unique slug from title
    const baseSlug = generateSlug(dto.title);
    const slug = await ensureUniqueSlug(baseSlug, async (candidate) => {
      const existing = await this.prisma.tour.findUnique({
        where: { slug: candidate },
      });
      return !!existing;
    });

    const tour = await this.prisma.tour.create({
      data: {
        title: dto.title,
        slug,
        destinationId: dto.destinationId,
        description: dto.description,
        shortDescription: dto.shortDescription ?? null,
        durationDays: dto.durationDays,
        durationNights: dto.durationNights,
        basePrice: dto.basePrice,
        salePrice: dto.salePrice ?? null,
        maxGuests: dto.maxGuests,
        minGuests: dto.minGuests ?? 1,
        availableSlots: dto.availableSlots,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        featured: dto.featured ?? false,
        imageUrl: dto.imageUrl ?? null,
        category: dto.category ?? null,
        status: 'ACTIVE',
      },
      include: {
        destination: { select: { id: true, name: true, slug: true } },
      },
    });

    return tour;
  }

  // ---------------------------------------------------------------------------
  // Admin: update
  // ---------------------------------------------------------------------------

  async update(id: string, dto: UpdateTourDto): Promise<unknown> {
    const existing = await this.prisma.tour.findUnique({ where: { id } });
    if (!existing || existing.status === 'DELETED') {
      throw new NotFoundException('Tour not found');
    }

    // Validate destination if changed
    if (dto.destinationId && dto.destinationId !== existing.destinationId) {
      const destination = await this.prisma.destination.findUnique({
        where: { id: dto.destinationId },
      });
      if (!destination || destination.status === 'DELETED') {
        throw new NotFoundException('Destination not found');
      }
    }

    // Validate price if provided
    if (dto.basePrice !== undefined && dto.basePrice < 0) {
      throw new BadRequestException('basePrice must be >= 0');
    }

    // Validate maxGuests if provided
    if (dto.maxGuests !== undefined && dto.maxGuests < 1) {
      throw new BadRequestException('maxGuests must be > 0');
    }

    // Validate date range if both provided
    const startDate = dto.startDate ?? existing.startDate?.toISOString();
    const endDate = dto.endDate ?? existing.endDate?.toISOString();
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        throw new BadRequestException('startDate must be before endDate');
      }
    }

    // Regenerate slug only if title changed
    let slug = existing.slug;
    if (dto.title && dto.title !== existing.title) {
      const baseSlug = generateSlug(dto.title);
      slug = await ensureUniqueSlug(baseSlug, async (candidate) => {
        if (candidate === existing.slug) return false;
        const found = await this.prisma.tour.findUnique({
          where: { slug: candidate },
        });
        return !!found;
      });
    }

    const updated = await this.prisma.tour.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        slug,
        ...(dto.destinationId !== undefined && { destinationId: dto.destinationId }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.shortDescription !== undefined && { shortDescription: dto.shortDescription }),
        ...(dto.durationDays !== undefined && { durationDays: dto.durationDays }),
        ...(dto.durationNights !== undefined && { durationNights: dto.durationNights }),
        ...(dto.basePrice !== undefined && { basePrice: dto.basePrice }),
        ...(dto.salePrice !== undefined && { salePrice: dto.salePrice }),
        ...(dto.maxGuests !== undefined && { maxGuests: dto.maxGuests }),
        ...(dto.minGuests !== undefined && { minGuests: dto.minGuests }),
        ...(dto.availableSlots !== undefined && { availableSlots: dto.availableSlots }),
        ...(dto.startDate !== undefined && {
          startDate: dto.startDate ? new Date(dto.startDate) : null,
        }),
        ...(dto.endDate !== undefined && { endDate: dto.endDate ? new Date(dto.endDate) : null }),
        ...(dto.featured !== undefined && { featured: dto.featured }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.category !== undefined && { category: dto.category }),
      },
      include: {
        destination: { select: { id: true, name: true, slug: true } },
      },
    });

    return updated;
  }

  // ---------------------------------------------------------------------------
  // Admin: soft delete
  // ---------------------------------------------------------------------------

  async softDelete(id: string): Promise<void> {
    const existing = await this.prisma.tour.findUnique({ where: { id } });
    if (!existing || existing.status === 'DELETED') {
      throw new NotFoundException('Tour not found');
    }

    await this.prisma.tour.update({
      where: { id },
      data: { status: 'DELETED' },
    });
  }

  // ---------------------------------------------------------------------------
  // Admin: itinerary management
  // ---------------------------------------------------------------------------

  async addItinerary(tourId: string, dto: CreateItineraryDto): Promise<unknown> {
    const tour = await this.prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour || tour.status === 'DELETED') {
      throw new NotFoundException('Tour not found');
    }

    // Upsert by (tourId, dayNumber)
    const itinerary = await this.prisma.tourItinerary.upsert({
      where: { tourId_dayNumber: { tourId, dayNumber: dto.dayNumber } },
      create: {
        tourId,
        dayNumber: dto.dayNumber,
        title: dto.title,
        description: dto.description ?? null,
        meals: dto.meals ?? null,
        accommodation: dto.accommodation ?? null,
        activities: dto.activities ?? null,
      },
      update: {
        title: dto.title,
        description: dto.description ?? null,
        meals: dto.meals ?? null,
        accommodation: dto.accommodation ?? null,
        activities: dto.activities ?? null,
      },
    });

    return itinerary;
  }

  async updateItinerary(id: string, dto: Partial<CreateItineraryDto>): Promise<unknown> {
    const existing = await this.prisma.tourItinerary.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Itinerary item not found');
    }

    const updated = await this.prisma.tourItinerary.update({
      where: { id },
      data: {
        ...(dto.dayNumber !== undefined && { dayNumber: dto.dayNumber }),
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.meals !== undefined && { meals: dto.meals }),
        ...(dto.accommodation !== undefined && { accommodation: dto.accommodation }),
        ...(dto.activities !== undefined && { activities: dto.activities }),
      },
    });

    return updated;
  }

  async deleteItinerary(id: string): Promise<void> {
    const existing = await this.prisma.tourItinerary.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Itinerary item not found');
    }

    await this.prisma.tourItinerary.delete({ where: { id } });
  }

  // ---------------------------------------------------------------------------
  // Admin: departure management
  // ---------------------------------------------------------------------------

  async addDeparture(tourId: string, dto: CreateDepartureDto): Promise<unknown> {
    const tour = await this.prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour || tour.status === 'DELETED') {
      throw new NotFoundException('Tour not found');
    }

    const departure = await this.prisma.tourDeparture.create({
      data: {
        tourId,
        departureDate: new Date(dto.departureDate),
        returnDate: dto.returnDate ? new Date(dto.returnDate) : null,
        availableSlots: dto.availableSlots,
        priceOverride: dto.priceOverride ?? null,
        status: dto.status ?? 'OPEN',
      },
    });

    return departure;
  }

  async updateDeparture(id: string, dto: Partial<CreateDepartureDto>): Promise<unknown> {
    const existing = await this.prisma.tourDeparture.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Tour departure not found');
    }

    const updated = await this.prisma.tourDeparture.update({
      where: { id },
      data: {
        ...(dto.departureDate !== undefined && { departureDate: new Date(dto.departureDate) }),
        ...(dto.returnDate !== undefined && {
          returnDate: dto.returnDate ? new Date(dto.returnDate) : null,
        }),
        ...(dto.availableSlots !== undefined && { availableSlots: dto.availableSlots }),
        ...(dto.priceOverride !== undefined && { priceOverride: dto.priceOverride }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
    });

    return updated;
  }

  async deleteDeparture(id: string): Promise<void> {
    const existing = await this.prisma.tourDeparture.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Tour departure not found');
    }

    await this.prisma.tourDeparture.delete({ where: { id } });
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Compute average rating from APPROVED reviews for a tour.
   * Returns null if no approved reviews exist.
   */
  private async computeAvgRating(tourId: string): Promise<number | null> {
    const result = await this.prisma.review.aggregate({
      where: { tourId, status: 'APPROVED' },
      _avg: { rating: true },
    });
    return result._avg.rating;
  }

  /**
   * Build Prisma orderBy clause from sortBy param.
   * popular sort uses _count on bookings (desc).
   */
  private buildOrderBy(
    sortBy?: 'price' | 'popular' | 'rating' | 'newest',
  ): Record<string, unknown> | Record<string, unknown>[] {
    switch (sortBy) {
      case 'price':
        return { basePrice: 'asc' };
      case 'popular':
        return { bookings: { _count: 'desc' } };
      case 'newest':
        return { createdAt: 'desc' };
      default:
        // Default: newest
        return { createdAt: 'desc' };
    }
  }
}
