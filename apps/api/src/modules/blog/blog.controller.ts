import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import type { AuthenticatedUser } from '../../common/strategies/jwt.strategy';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

/**
 * BlogController — public + admin endpoints for blog posts.
 *
 * Uses a single controller with no class-level prefix so both
 * /blogs (public) and /admin/blogs (admin) routes live in the same file.
 *
 * Public routes:
 *   GET  /blogs          — list PUBLISHED blogs (paginated)
 *   GET  /blogs/:slug    — get PUBLISHED blog by slug
 *
 * Admin routes (ADMIN role required):
 *   GET    /admin/blogs        — list all blogs (including DRAFT)
 *   POST   /admin/blogs        — create blog post
 *   PUT    /admin/blogs/:id    — update blog post
 *   DELETE /admin/blogs/:id    — soft-delete blog post
 *
 * Req 15, 21 / Design §3.3 Blog.
 */
@ApiTags('Blog')
@Controller()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // =========================================================================
  // PUBLIC: GET /blogs
  // =========================================================================

  /**
   * GET /blogs
   * Returns paginated PUBLISHED blog posts ordered by publishedAt desc.
   * Req 15 — public, no auth required.
   */
  @Get('blogs')
  @Public()
  @ApiOperation({
    summary: 'List published blog posts',
    description:
      'Returns a paginated list of PUBLISHED blog posts ordered by publication date (newest first). Supports optional category filter.',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by blog category',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of published blog posts' })
  listPublished(@Query() query: PaginationQueryDto, @Query('category') category?: string) {
    return this.blogService.listPublished({ ...query, category });
  }

  // =========================================================================
  // PUBLIC: GET /blogs/:slug
  // =========================================================================

  /**
   * GET /blogs/:slug
   * Returns a single PUBLISHED blog post by slug.
   * Req 15 — public, no auth required.
   */
  @Get('blogs/:slug')
  @Public()
  @ApiOperation({
    summary: 'Get published blog post by slug',
    description:
      'Returns the full content of a PUBLISHED blog post identified by its slug. Returns 404 if not found or not published.',
  })
  @ApiParam({ name: 'slug', description: 'Blog post slug', example: 'kham-pha-hoi-an-co-kinh' })
  @ApiResponse({ status: 200, description: 'Blog post detail' })
  @ApiResponse({ status: 404, description: 'Blog post not found or not published' })
  getBySlug(@Param('slug') slug: string) {
    return this.blogService.getBySlug(slug);
  }

  // =========================================================================
  // ADMIN: GET /admin/blogs
  // =========================================================================

  /**
   * GET /admin/blogs
   * List all blog posts (including DRAFT), with optional status filter.
   * Req 15 — requires ADMIN role.
   */
  @Get('admin/blogs')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all blog posts (Admin)',
    description:
      'Returns a paginated list of all blog posts (DRAFT and PUBLISHED). DELETED posts are excluded unless status=DELETED is explicitly passed. Requires ADMIN role.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['DRAFT', 'PUBLISHED', 'DELETED'],
    description: 'Filter by blog status',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of blog posts' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  adminList(@Query() query: PaginationQueryDto, @Query('status') status?: string) {
    return this.blogService.adminList({ ...query, status });
  }

  // =========================================================================
  // ADMIN: POST /admin/blogs
  // =========================================================================

  /**
   * POST /admin/blogs
   * Create a new blog post. Slug is auto-generated from title.
   * If status=PUBLISHED, publishedAt is set to now.
   * Req 15, 21 — requires ADMIN role.
   */
  @Post('admin/blogs')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create blog post (Admin)',
    description:
      'Creates a new blog post with an auto-generated unique slug derived from the title. If status is PUBLISHED, publishedAt is set to the current timestamp. Requires ADMIN role.',
  })
  @ApiResponse({ status: 201, description: 'Blog post created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  adminCreate(@Body() dto: CreateBlogDto, @CurrentUser() user: AuthenticatedUser) {
    return this.blogService.adminCreate(user.id, dto);
  }

  // =========================================================================
  // ADMIN: PUT /admin/blogs/:id
  // =========================================================================

  /**
   * PUT /admin/blogs/:id
   * Update an existing blog post.
   * If status transitions to PUBLISHED and publishedAt is null, sets publishedAt=now.
   * Slug is regenerated if title changes.
   * Req 15, 21 — requires ADMIN role.
   */
  @Put('admin/blogs/:id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update blog post (Admin)',
    description:
      'Updates an existing blog post. If the title changes, the slug is regenerated (unique). If status transitions to PUBLISHED for the first time, publishedAt is set to now. Requires ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Blog post ID' })
  @ApiResponse({ status: 200, description: 'Blog post updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  adminUpdate(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.blogService.adminUpdate(id, dto);
  }

  // =========================================================================
  // ADMIN: DELETE /admin/blogs/:id
  // =========================================================================

  /**
   * DELETE /admin/blogs/:id
   * Soft-delete a blog post (sets status=DELETED).
   * Req 15, 21 — requires ADMIN role.
   */
  @Delete('admin/blogs/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Soft-delete blog post (Admin)',
    description:
      'Soft-deletes a blog post by setting its status to DELETED. The record is retained in the database. Requires ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Blog post ID' })
  @ApiResponse({ status: 204, description: 'Blog post soft-deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async adminSoftDelete(@Param('id') id: string) {
    await this.blogService.adminSoftDelete(id);
  }
}
