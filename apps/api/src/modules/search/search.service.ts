import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Autocomplete suggestion returned by the search service.
 */
export interface AutocompleteSuggestion {
  id: string;
  name: string;
  type: 'destination' | 'city' | 'hotel';
  description: string;
  imageUrl?: string;
}

/**
 * SearchService — provides autocomplete suggestions by querying PostgreSQL
 * across destinations, cities, and hotel names using ILIKE pattern matching.
 *
 * Design §8 (Search/Autocomplete API) / Req 7.4.
 */
@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns autocomplete suggestions matching the query string.
   *
   * Searches across:
   * - Destinations (name, shortDescription)
   * - Cities (name)
   * - Hotels (name) — only when type is "hotel" or "all"
   *
   * Results are capped at `limit` (max 8).
   */
  async autocomplete(
    query: string,
    type: 'hotel' | 'flight' | 'tour' | 'all' = 'all',
    limit: number = 8,
  ): Promise<AutocompleteSuggestion[]> {
    // Return empty array for queries shorter than 2 characters
    if (!query || query.trim().length < 2) {
      return [];
    }

    const effectiveLimit = Math.min(limit, 8);
    const _searchPattern = `%${query.trim()}%`;
    const results: AutocompleteSuggestion[] = [];

    // Search destinations (relevant for all types except "flight")
    if (type === 'all' || type === 'tour') {
      const destinations = await this.prisma.destination.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            { name: { contains: query.trim(), mode: 'insensitive' } },
            { shortDescription: { contains: query.trim(), mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          shortDescription: true,
          imageUrl: true,
          city: { select: { name: true } },
          country: { select: { name: true } },
        },
        take: effectiveLimit,
        orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
      });

      for (const dest of destinations) {
        results.push({
          id: dest.id,
          name: dest.name,
          type: 'destination',
          description:
            dest.shortDescription ??
            [dest.city?.name, dest.country?.name].filter(Boolean).join(', ') ??
            '',
          imageUrl: dest.imageUrl ?? undefined,
        });
      }
    }

    // Search cities (relevant for all types)
    if (type === 'all' || type === 'tour' || type === 'flight') {
      const remainingSlots = effectiveLimit - results.length;
      if (remainingSlots > 0) {
        const cities = await this.prisma.city.findMany({
          where: {
            name: { contains: query.trim(), mode: 'insensitive' },
          },
          select: {
            id: true,
            name: true,
            country: { select: { name: true } },
          },
          take: remainingSlots,
          orderBy: { name: 'asc' },
        });

        for (const city of cities) {
          // Avoid duplicates if city name matches a destination already in results
          const alreadyIncluded = results.some(
            (r) => r.name.toLowerCase() === city.name.toLowerCase() && r.type === 'city',
          );
          if (!alreadyIncluded) {
            results.push({
              id: city.id,
              name: city.name,
              type: 'city',
              description: city.country?.name ?? '',
            });
          }
        }
      }
    }

    // Search hotels (only when type is "hotel" or "all")
    if (type === 'all' || type === 'hotel') {
      const remainingSlots = effectiveLimit - results.length;
      if (remainingSlots > 0) {
        const hotels = await this.prisma.hotelMock.findMany({
          where: {
            OR: [
              { name: { contains: query.trim(), mode: 'insensitive' } },
              { nameEn: { contains: query.trim(), mode: 'insensitive' } },
            ],
          },
          select: {
            id: true,
            name: true,
            nameEn: true,
            address: true,
            imageUrls: true,
            destination: { select: { name: true } },
          },
          take: remainingSlots,
          orderBy: [{ reviewScore: 'desc' }, { name: 'asc' }],
        });

        for (const hotel of hotels) {
          results.push({
            id: hotel.id,
            name: hotel.name,
            type: 'hotel',
            description: hotel.address ?? hotel.destination?.name ?? '',
            imageUrl: hotel.imageUrls?.[0] ?? undefined,
          });
        }
      }
    }

    // Ensure we never exceed the limit
    return results.slice(0, effectiveLimit);
  }
}
