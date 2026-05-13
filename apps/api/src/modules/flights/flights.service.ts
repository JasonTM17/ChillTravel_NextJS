import { Injectable } from '@nestjs/common';
import { buildPagination } from '../../common/dto/paginated-response.dto';
import { PrismaService } from '../../prisma/prisma.service';
import type { FlightQueryDto } from './dto/flight-query.dto';

/**
 * FlightsService — business logic for flight listing with filters, sort, and pagination.
 *
 * Queries the FlightMock model with support for:
 * - Origin/destination filtering
 * - Departure date filtering
 * - Departure time block filtering (00-06, 06-12, 12-18, 18-24)
 * - Number of stops filtering
 * - Airline filtering
 * - Price range filtering (basePrice + taxAmount)
 * - Multiple sort options (default: lowest price)
 *
 * Max 20 results per page.
 */
@Injectable()
export class FlightsService {
  /** Hard cap on page size for flight results */
  private readonly MAX_PAGE_SIZE = 20;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns a paginated list of flights matching the given filters.
   */
  async findAll(query: FlightQueryDto) {
    const page = query.page ?? 0;
    const size = Math.min(query.size ?? 20, this.MAX_PAGE_SIZE);
    const skip = page * size;

    const where = this.buildWhereClause(query);
    const orderBy = this.buildOrderBy(query.sortBy);

    const [items, totalElements] = await Promise.all([
      this.prisma.flightMock.findMany({
        where,
        skip,
        take: size,
        orderBy,
        include: {
          airline: {
            select: {
              id: true,
              code: true,
              nameVi: true,
              nameEn: true,
              nameJa: true,
              logoUrl: true,
            },
          },
        },
      }),
      this.prisma.flightMock.count({ where }),
    ]);

    // Map items to include totalPrice for convenience
    const mapped = items.map((flight) => ({
      ...flight,
      totalPrice: flight.basePrice + flight.taxAmount,
    }));

    return buildPagination(mapped, page, size, totalElements);
  }

  /**
   * Build Prisma where clause from query filters.
   */
  private buildWhereClause(query: FlightQueryDto): Record<string, unknown> {
    const where: Record<string, unknown> = {};

    // Filter by origin airport code
    if (query.origin) {
      where['origin'] = query.origin.toUpperCase();
    }

    // Filter by destination airport code
    if (query.destination) {
      where['destination'] = query.destination.toUpperCase();
    }

    // Filter by departure date (full day range in UTC)
    if (query.departureDate) {
      const date = new Date(query.departureDate);
      if (!isNaN(date.getTime())) {
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);
        where['departureTime'] = { gte: startOfDay, lte: endOfDay };
      }
    }

    // Filter by departure time blocks (comma-separated: "00-06,06-12,12-18,18-24")
    if (query.departureTimeBlock) {
      const blocks = query.departureTimeBlock
        .split(',')
        .map((b) => b.trim())
        .filter((b) => /^\d{2}-\d{2}$/.test(b));

      if (blocks.length > 0) {
        const hourRanges = blocks
          .map((block) => {
            const [startStr, endStr] = block.split('-');
            const start = parseInt(startStr ?? '0', 10);
            const end = parseInt(endStr ?? '0', 10);
            if (start >= 0 && start <= 24 && end >= 0 && end <= 24) {
              return { start, end };
            }
            return null;
          })
          .filter((r): r is { start: number; end: number } => r !== null);

        // If departureDate is set, build OR conditions with time ranges
        if (query.departureDate && hourRanges.length > 0) {
          const date = new Date(query.departureDate);
          if (!isNaN(date.getTime())) {
            const orConditions = hourRanges.map((range) => {
              const start = new Date(date);
              start.setUTCHours(range.start, 0, 0, 0);
              const end = new Date(date);
              // For "18-24", end should be end of day
              if (range.end === 24) {
                end.setUTCHours(23, 59, 59, 999);
              } else {
                end.setUTCHours(range.end, 0, 0, 0);
              }
              return { departureTime: { gte: start, lt: end } };
            });
            // Override the departureTime filter with OR blocks
            delete where['departureTime'];
            where['OR'] = orConditions;
          }
        }
      }
    }

    // Filter by number of stops (comma-separated: "0,1,2")
    if (query.stops) {
      const stopValues = query.stops
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n) && n >= 0);

      if (stopValues.length > 0) {
        where['stops'] = { in: stopValues };
      }
    }

    // Filter by airline codes (comma-separated: "VN,VJ,QH")
    if (query.airlines) {
      const airlineCodes = query.airlines
        .split(',')
        .map((a) => a.trim().toUpperCase())
        .filter((a) => a.length > 0);

      if (airlineCodes.length > 0) {
        where['airline'] = { code: { in: airlineCodes } };
      }
    }

    // Filter by price range (basePrice)
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (query.minPrice !== undefined) priceFilter['gte'] = query.minPrice;
      if (query.maxPrice !== undefined) priceFilter['lte'] = query.maxPrice;
      where['basePrice'] = priceFilter;
    }

    return where;
  }

  /**
   * Build Prisma orderBy clause from sortBy param.
   * Default: lowest price first.
   */
  private buildOrderBy(
    sortBy?: 'price-asc' | 'price-desc' | 'duration' | 'departure',
  ): Record<string, string> {
    switch (sortBy) {
      case 'price-desc':
        return { basePrice: 'desc' };
      case 'duration':
        return { durationMin: 'asc' };
      case 'departure':
        return { departureTime: 'asc' };
      case 'price-asc':
      default:
        return { basePrice: 'asc' };
    }
  }
}
