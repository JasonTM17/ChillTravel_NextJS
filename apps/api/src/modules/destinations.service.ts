import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { generateSlug, ensureUniqueSlug } from "../common/utils/slug.util";
import { buildPagination } from "../common/dto/paginated-response.dto";
import type { DestinationQueryDto } from "./destination/dto/destination-query.dto";
import type { CreateDestinationDto } from "./destination/dto/create-destination.dto";
import type { UpdateDestinationDto } from "./destination/dto/update-destination.dto";
import type { AddDestinationImageDto } from "./destination/dto/add-destination-image.dto";
import type { ApiPaginated } from "@vietwander/shared";

/**
 * DestinationService — real Prisma-backed implementation.
 * Replaces the mock implementation that used in-memory shared data.
 * Design §5.2 / Req 6, 7, 21.
 */
@Injectable()
export class DestinationsService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // Public: list with filters + pagination
  // ---------------------------------------------------------------------------

  async findAll(query: DestinationQueryDto): Promise<ApiPaginated<unknown>> {
    const page = query.page ?? 0;
    const size = query.size ?? 10;
    const skip = page * size;

    // Build Prisma where clause
    const where: Record<string, unknown> = {
      status: "ACTIVE"
    };

    if (query.keyword) {
      where["OR"] = [
        { name: { contains: query.keyword, mode: "insensitive" } },
        { description: { contains: query.keyword, mode: "insensitive" } },
        { shortDescription: { contains: query.keyword, mode: "insensitive" } }
      ];
    }

    if (query.country) {
      where["country"] = {
        name: { contains: query.country, mode: "insensitive" }
      };
    }

    if (query.city) {
      where["city"] = {
        name: { contains: query.city, mode: "insensitive" }
      };
    }

    if (query.category) {
      where["category"] = { contains: query.category, mode: "insensitive" };
    }

    // Build orderBy from sort param
    const orderBy = this.buildOrderBy(query.sort);

    const [items, totalElements] = await Promise.all([
      this.prisma.destination.findMany({
        where,
        skip,
        take: size,
        orderBy,
        include: {
          country: { select: { id: true, name: true } },
          city: { select: { id: true, name: true } },
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1
          }
        }
      }),
      this.prisma.destination.count({ where })
    ]);

    return buildPagination(items, page, size, totalElements);
  }

  // ---------------------------------------------------------------------------
  // Public: get by slug
  // ---------------------------------------------------------------------------

  async findBySlug(slug: string): Promise<unknown> {
    const destination = await this.prisma.destination.findUnique({
      where: { slug },
      include: {
        country: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        images: { orderBy: { sortOrder: "asc" } },
        tags: true
      }
    });

    if (!destination || destination.status === "DELETED") {
      throw new NotFoundException("Destination not found");
    }

    return destination;
  }

  // ---------------------------------------------------------------------------
  // Admin: create
  // ---------------------------------------------------------------------------

  async create(dto: CreateDestinationDto): Promise<unknown> {
    // Find or create Country
    const country = await this.prisma.country.upsert({
      where: { name: dto.country },
      create: { name: dto.country },
      update: {}
    });

    // Find or create City (if provided)
    let cityId: string | null = null;
    if (dto.city) {
      const city = await this.prisma.city.upsert({
        where: { name_countryId: { name: dto.city, countryId: country.id } },
        create: { name: dto.city, countryId: country.id },
        update: {}
      });
      cityId = city.id;
    }

    // Generate unique slug from name
    const baseSlug = generateSlug(dto.name);
    const slug = await ensureUniqueSlug(baseSlug, async (candidate) => {
      const existing = await this.prisma.destination.findUnique({
        where: { slug: candidate }
      });
      return !!existing;
    });

    const destination = await this.prisma.destination.create({
      data: {
        name: dto.name,
        slug,
        countryId: country.id,
        cityId,
        description: dto.description,
        shortDescription: dto.shortDescription ?? null,
        longDescription: dto.longDescription ?? "",
        bestTimeToVisit: dto.bestTimeToVisit ?? "",
        imageUrl: dto.imageUrl ?? null,
        category: dto.category ?? null,
        budgetMin: dto.budgetMin ?? 0,
        budgetMax: dto.budgetMax ?? 0,
        currency: dto.currency ?? "VND",
        latitude: dto.latitude ?? 0,
        longitude: dto.longitude ?? 0,
        safetyLevel: dto.safetyLevel ?? "medium",
        travelStyles: dto.travelStyles ?? [],
        cultureNotes: dto.cultureNotes ?? [],
        foodHighlights: dto.foodHighlights ?? [],
        isFeatured: dto.isFeatured ?? false,
        status: "ACTIVE"
      },
      include: {
        country: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        images: true
      }
    });

    return destination;
  }

  // ---------------------------------------------------------------------------
  // Admin: update
  // ---------------------------------------------------------------------------

  async update(id: string, dto: UpdateDestinationDto): Promise<unknown> {
    // Verify destination exists
    const existing = await this.prisma.destination.findUnique({ where: { id } });
    if (!existing || existing.status === "DELETED") {
      throw new NotFoundException("Destination not found");
    }

    // Handle country change
    let countryId = existing.countryId;
    if (dto.country) {
      const country = await this.prisma.country.upsert({
        where: { name: dto.country },
        create: { name: dto.country },
        update: {}
      });
      countryId = country.id;
    }

    // Handle city change
    let cityId = existing.cityId;
    if (dto.city !== undefined) {
      if (dto.city) {
        const city = await this.prisma.city.upsert({
          where: { name_countryId: { name: dto.city, countryId } },
          create: { name: dto.city, countryId },
          update: {}
        });
        cityId = city.id;
      } else {
        cityId = null;
      }
    }

    // Regenerate slug only if name changed
    let slug = existing.slug;
    if (dto.name && dto.name !== existing.name) {
      const baseSlug = generateSlug(dto.name);
      slug = await ensureUniqueSlug(baseSlug, async (candidate) => {
        if (candidate === existing.slug) return false; // allow keeping same slug
        const found = await this.prisma.destination.findUnique({
          where: { slug: candidate }
        });
        return !!found;
      });
    }

    const updated = await this.prisma.destination.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        slug,
        countryId,
        cityId,
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.shortDescription !== undefined && { shortDescription: dto.shortDescription }),
        ...(dto.longDescription !== undefined && { longDescription: dto.longDescription }),
        ...(dto.bestTimeToVisit !== undefined && { bestTimeToVisit: dto.bestTimeToVisit }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.budgetMin !== undefined && { budgetMin: dto.budgetMin }),
        ...(dto.budgetMax !== undefined && { budgetMax: dto.budgetMax }),
        ...(dto.currency !== undefined && { currency: dto.currency }),
        ...(dto.latitude !== undefined && { latitude: dto.latitude }),
        ...(dto.longitude !== undefined && { longitude: dto.longitude }),
        ...(dto.safetyLevel !== undefined && { safetyLevel: dto.safetyLevel }),
        ...(dto.travelStyles !== undefined && { travelStyles: dto.travelStyles }),
        ...(dto.cultureNotes !== undefined && { cultureNotes: dto.cultureNotes }),
        ...(dto.foodHighlights !== undefined && { foodHighlights: dto.foodHighlights }),
        ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured })
      },
      include: {
        country: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        images: true
      }
    });

    return updated;
  }

  // ---------------------------------------------------------------------------
  // Admin: soft delete
  // ---------------------------------------------------------------------------

  async softDelete(id: string): Promise<void> {
    const existing = await this.prisma.destination.findUnique({ where: { id } });
    if (!existing || existing.status === "DELETED") {
      throw new NotFoundException("Destination not found");
    }

    await this.prisma.destination.update({
      where: { id },
      data: { status: "DELETED" }
    });
  }

  // ---------------------------------------------------------------------------
  // Admin: add image
  // ---------------------------------------------------------------------------

  async addImage(destinationId: string, dto: AddDestinationImageDto): Promise<unknown> {
    const destination = await this.prisma.destination.findUnique({
      where: { id: destinationId }
    });
    if (!destination || destination.status === "DELETED") {
      throw new NotFoundException("Destination not found");
    }

    const image = await this.prisma.destinationImage.create({
      data: {
        destinationId,
        url: dto.imageUrl,
        prompt: "",
        alt: dto.altText ?? "",
        altText: dto.altText ?? null,
        sortOrder: dto.sortOrder ?? 0
      }
    });

    return image;
  }

  // ---------------------------------------------------------------------------
  // Admin: remove image
  // ---------------------------------------------------------------------------

  async removeImage(imageId: string): Promise<void> {
    const image = await this.prisma.destinationImage.findUnique({
      where: { id: imageId }
    });
    if (!image) {
      throw new NotFoundException("Destination image not found");
    }

    await this.prisma.destinationImage.delete({ where: { id: imageId } });
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private buildOrderBy(
    sort?: string | string[]
  ): Record<string, "asc" | "desc"> | Record<string, "asc" | "desc">[] {
    if (!sort) return { createdAt: "desc" };

    const sortValues = Array.isArray(sort) ? sort : [sort];
    const orderBy = sortValues.map((s) => {
      const [field, direction] = s.split(",");
      const dir: "asc" | "desc" =
        direction?.toLowerCase() === "asc" ? "asc" : "desc";
      return { [field]: dir };
    });

    return orderBy.length === 1 ? orderBy[0] : orderBy;
  }
}
