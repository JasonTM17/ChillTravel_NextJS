import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { buildPagination } from "../../common/dto/paginated-response.dto";
import { generateSlug, ensureUniqueSlug } from "../../common/utils/slug.util";
import type { PaginationQueryDto } from "../../common/dto/pagination.dto";
import type { CreateBlogDto } from "./dto/create-blog.dto";
import type { UpdateBlogDto } from "./dto/update-blog.dto";

/**
 * BlogService — business logic for blog posts.
 *
 * Handles:
 *  - listPublished: paginated PUBLISHED blogs ordered by publishedAt desc.
 *  - getBySlug: find PUBLISHED blog by slug, 404 if not found or DELETED.
 *  - adminCreate: generate slug, create blog. If status=PUBLISHED, set publishedAt=now.
 *  - adminUpdate: update blog. If status transitions to PUBLISHED and publishedAt is null,
 *    set publishedAt=now. Regenerate slug if title changes.
 *  - adminSoftDelete: set status=DELETED.
 *  - adminList: paginated all blogs (including DRAFT), optional status filter.
 *
 * Req 15, 21 / Design §3.3 Blog.
 */
@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // Public: list PUBLISHED blogs (paginated, ordered by publishedAt desc)
  // ---------------------------------------------------------------------------

  async listPublished(query: PaginationQueryDto & { category?: string }) {
    const page = query.page ?? 0;
    const size = query.size ?? 10;
    const skip = page * size;

    const where: Record<string, unknown> = { status: "PUBLISHED" };
    if (query.category) {
      where["category"] = query.category;
    }

    const [items, totalElements] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: size,
        orderBy: { publishedAt: "desc" },
        include: {
          author: {
            select: { id: true, fullName: true, avatarUrl: true }
          }
        }
      }),
      this.prisma.blogPost.count({ where })
    ]);

    return buildPagination(items, page, size, totalElements);
  }

  // ---------------------------------------------------------------------------
  // Public: get PUBLISHED blog by slug
  // ---------------------------------------------------------------------------

  async getBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, fullName: true, avatarUrl: true }
        }
      }
    });

    if (!post || post.status !== "PUBLISHED") {
      throw new NotFoundException("Không tìm thấy bài viết");
    }

    return post;
  }

  // ---------------------------------------------------------------------------
  // Admin: create blog post with auto-generated slug
  // ---------------------------------------------------------------------------

  async adminCreate(authorId: string, dto: CreateBlogDto) {
    const baseSlug = generateSlug(dto.title);
    const slug = await ensureUniqueSlug(
      baseSlug,
      async (s) => !!(await this.prisma.blogPost.findUnique({ where: { slug: s } }))
    );

    const status = dto.status ?? "DRAFT";
    const publishedAt =
      status === "PUBLISHED" ? new Date() : null;

    const post = await this.prisma.blogPost.create({
      data: {
        title: dto.title,
        slug,
        excerpt: dto.excerpt ?? null,
        content: dto.content,
        coverImageUrl: dto.coverImageUrl ?? null,
        category: dto.category ?? null,
        status,
        authorId,
        publishedAt
      },
      include: {
        author: {
          select: { id: true, fullName: true, avatarUrl: true }
        }
      }
    });

    return post;
  }

  // ---------------------------------------------------------------------------
  // Admin: update blog post
  // ---------------------------------------------------------------------------

  async adminUpdate(id: string, dto: UpdateBlogDto) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing || existing.status === "DELETED") {
      throw new NotFoundException("Không tìm thấy bài viết");
    }

    // Regenerate slug if title changes
    let slug = existing.slug;
    if (dto.title && dto.title !== existing.title) {
      const baseSlug = generateSlug(dto.title);
      slug = await ensureUniqueSlug(
        baseSlug,
        async (s) =>
          !!(await this.prisma.blogPost.findFirst({
            where: { slug: s, NOT: { id } }
          }))
      );
    }

    // Set publishedAt when transitioning to PUBLISHED for the first time
    let publishedAt = existing.publishedAt;
    if (dto.status === "PUBLISHED" && !existing.publishedAt) {
      publishedAt = new Date();
    }

    const updated = await this.prisma.blogPost.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        slug,
        ...(dto.excerpt !== undefined && { excerpt: dto.excerpt }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.coverImageUrl !== undefined && { coverImageUrl: dto.coverImageUrl }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.status !== undefined && { status: dto.status }),
        publishedAt
      },
      include: {
        author: {
          select: { id: true, fullName: true, avatarUrl: true }
        }
      }
    });

    return updated;
  }

  // ---------------------------------------------------------------------------
  // Admin: soft-delete (set status=DELETED)
  // ---------------------------------------------------------------------------

  async adminSoftDelete(id: string): Promise<void> {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing || existing.status === "DELETED") {
      throw new NotFoundException("Không tìm thấy bài viết");
    }

    await this.prisma.blogPost.update({
      where: { id },
      data: { status: "DELETED" }
    });
  }

  // ---------------------------------------------------------------------------
  // Admin: list all blogs (including DRAFT), optional status filter (paginated)
  // ---------------------------------------------------------------------------

  async adminList(query: PaginationQueryDto & { status?: string }) {
    const page = query.page ?? 0;
    const size = query.size ?? 20;
    const skip = page * size;

    // Exclude DELETED by default unless explicitly requested
    const where: Record<string, unknown> = {};
    if (query.status) {
      where["status"] = query.status;
    } else {
      where["status"] = { not: "DELETED" };
    }

    const [items, totalElements] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: size,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { id: true, fullName: true, avatarUrl: true }
          }
        }
      }),
      this.prisma.blogPost.count({ where })
    ]);

    return buildPagination(items, page, size, totalElements);
  }
}
