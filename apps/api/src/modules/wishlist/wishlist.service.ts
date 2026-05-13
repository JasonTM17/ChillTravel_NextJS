import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { AddWishlistDto } from './dto/add-wishlist.dto';

/**
 * WishlistService — business logic for the user wishlist.
 *
 * Handles:
 *  - list: return all WishlistEntry rows for a user, populated with
 *    tour or destination info based on itemType.
 *  - add: idempotent upsert — create if not exists, return existing if
 *    the unique constraint (userId, itemId, itemType) is already satisfied.
 *  - remove: delete by WishlistEntry.id, verify ownership (403 if not owner).
 *
 * Req 14 / Design §3.3 Wishlist.
 */
@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // list: return all wishlist entries for a user with populated item info
  // ---------------------------------------------------------------------------

  async list(userId: string) {
    const entries = await this.prisma.wishlistEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Populate tour or destination info for each entry
    const populated = await Promise.all(
      entries.map(async (entry) => {
        if (entry.itemType === 'TOUR') {
          const tour = await this.prisma.tour.findUnique({
            where: { id: entry.itemId },
            select: {
              id: true,
              title: true,
              slug: true,
              imageUrl: true,
              basePrice: true,
              salePrice: true,
              durationDays: true,
              status: true,
              destination: {
                select: { id: true, name: true, city: true, country: true },
              },
            },
          });
          return { ...entry, item: tour };
        } else {
          const destination = await this.prisma.destination.findUnique({
            where: { id: entry.itemId },
            select: {
              id: true,
              name: true,
              slug: true,
              imageUrl: true,
              city: true,
              country: true,
              category: true,
              status: true,
            },
          });
          return { ...entry, item: destination };
        }
      }),
    );

    return populated;
  }

  // ---------------------------------------------------------------------------
  // add: idempotent — create if not exists, return existing if already present
  // ---------------------------------------------------------------------------

  async add(userId: string, dto: AddWishlistDto) {
    // Check if entry already exists (handle unique constraint gracefully)
    const existing = await this.prisma.wishlistEntry.findUnique({
      where: {
        userId_itemId_itemType: {
          userId,
          itemId: dto.itemId,
          itemType: dto.itemType,
        },
      },
    });

    if (existing) {
      return existing;
    }

    // Create new entry
    const entry = await this.prisma.wishlistEntry.create({
      data: {
        userId,
        itemId: dto.itemId,
        itemType: dto.itemType,
      },
    });

    return entry;
  }

  // ---------------------------------------------------------------------------
  // remove: delete by WishlistEntry.id, verify ownership
  // ---------------------------------------------------------------------------

  async remove(userId: string, entryId: string): Promise<void> {
    const entry = await this.prisma.wishlistEntry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      throw new NotFoundException('Không tìm thấy mục trong danh sách yêu thích');
    }

    if (entry.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa mục này khỏi danh sách yêu thích');
    }

    await this.prisma.wishlistEntry.delete({ where: { id: entryId } });
  }
}
