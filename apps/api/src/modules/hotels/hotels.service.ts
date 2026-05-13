import { Injectable, NotFoundException } from '@nestjs/common';
import type { ApiPaginated } from '@vietwander/shared';
import { buildPagination } from '../../common/dto/paginated-response.dto';
import { PrismaService } from '../../prisma/prisma.service';
import type { HotelQueryDto } from './dto/hotel-query.dto';

/**
 * HotelsService — business logic for hotel listing with filters, sort, and pagination.
 *
 * Queries the HotelMock model with support for:
 * - Price range filtering (nightlyPrice)
 * - Star rating filtering (starRating)
 * - Amenities filtering (array contains)
 * - Property type filtering
 * - Distance from center filtering
 * - Multiple sort options
 *
 * Design §8 (Hotel Listing API).
 */
@Injectable()
export class HotelsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns a paginated list of hotels matching the given filters.
   */
  async findAll(query: HotelQueryDto): Promise<ApiPaginated<unknown>> {
    const page = query.page ?? 0;
    const size = query.size ?? 10;
    const skip = page * size;

    const where = this.buildWhereClause(query);
    const orderBy = this.buildOrderBy(query.sortBy);

    const [items, totalElements] = await Promise.all([
      this.prisma.hotelMock.findMany({
        where,
        skip,
        take: size,
        orderBy,
        include: {
          destination: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      this.prisma.hotelMock.count({ where }),
    ]);

    return buildPagination(items, page, size, totalElements);
  }

  /**
   * Returns a single hotel by ID with rooms and destination info.
   */
  async findById(id: string): Promise<unknown> {
    const hotel = await this.prisma.hotelMock.findUnique({
      where: { id },
      include: {
        destination: {
          select: { id: true, name: true, slug: true },
        },
        rooms: true,
      },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }

  /**
   * Build Prisma where clause from query filters.
   */
  private buildWhereClause(query: HotelQueryDto): Record<string, unknown> {
    const where: Record<string, unknown> = {};

    // Filter by destination
    if (query.destinationId) {
      where['destinationId'] = query.destinationId;
    }

    // Filter by keyword (hotel name search)
    if (query.keyword) {
      where['OR'] = [
        { name: { contains: query.keyword, mode: 'insensitive' } },
        { nameEn: { contains: query.keyword, mode: 'insensitive' } },
      ];
    }

    // Filter by price range (nightlyPrice)
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (query.minPrice !== undefined) priceFilter['gte'] = query.minPrice;
      if (query.maxPrice !== undefined) priceFilter['lte'] = query.maxPrice;
      where['nightlyPrice'] = priceFilter;
    }

    // Filter by star ratings (comma-separated, e.g. "3,4,5")
    if (query.stars) {
      const starValues = query.stars
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n) && n >= 1 && n <= 5);

      if (starValues.length > 0) {
        where['starRating'] = { in: starValues };
      }
    }

    // Filter by amenities (comma-separated, all must be present)
    if (query.amenities) {
      const amenityList = query.amenities
        .split(',')
        .map((a) => a.trim().toLowerCase())
        .filter((a) => a.length > 0);

      if (amenityList.length > 0) {
        where['amenities'] = { hasEvery: amenityList };
      }
    }

    // Filter by property type
    if (query.propertyType) {
      where['propertyType'] = query.propertyType.toLowerCase();
    }

    // Filter by max distance from center
    if (query.maxDistance !== undefined) {
      where['distanceFromCenter'] = { lte: query.maxDistance };
    }

    return where;
  }

  /**
   * Build Prisma orderBy clause from sortBy param.
   */
  private buildOrderBy(
    sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'popularity' | 'distance',
  ): Record<string, string> | Record<string, string>[] {
    switch (sortBy) {
      case 'price-asc':
        return { nightlyPrice: 'asc' };
      case 'price-desc':
        return { nightlyPrice: 'desc' };
      case 'rating':
        return [{ reviewScore: 'desc' }, { reviewCount: 'desc' }];
      case 'popularity':
        return [{ reviewCount: 'desc' }, { reviewScore: 'desc' }];
      case 'distance':
        return { distanceFromCenter: 'asc' };
      default:
        // Default: highest rated first
        return [{ reviewScore: 'desc' }, { name: 'asc' }];
    }
  }
}
