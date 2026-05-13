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
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { AddDestinationImageDto } from './destination/dto/add-destination-image.dto';
import { CreateDestinationDto } from './destination/dto/create-destination.dto';
import { DestinationQueryDto } from './destination/dto/destination-query.dto';
import { UpdateDestinationDto } from './destination/dto/update-destination.dto';
import { DestinationsService } from './destinations.service';

/**
 * Destinations controller — public browsing + admin CRUD.
 *
 * Uses a single controller with no class-level prefix so both
 * /destinations (public) and /admin/destinations (admin) routes live
 * in the same file without requiring AppModule changes.
 *
 * Design §3.3 Destinations / Req 6, 7, 21.
 */
@ApiTags('Destinations')
@Controller()
export class DestinationsController {
  constructor(private readonly destinations: DestinationsService) {}

  // =========================================================================
  // PUBLIC ENDPOINTS
  // =========================================================================

  /**
   * GET /destinations
   * List destinations with optional filters, pagination, and sort.
   * Req 6 — public, no auth required.
   */
  @Get('destinations')
  @Public()
  @ApiOperation({
    summary: 'List destinations',
    description:
      'Returns a paginated list of ACTIVE destinations. Supports filtering by keyword, country, city, and category.',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of destinations' })
  findAll(@Query() query: DestinationQueryDto) {
    return this.destinations.findAll(query);
  }

  /**
   * GET /destinations/:slug
   * Get destination detail by slug.
   * Req 6 — public, no auth required.
   */
  @Get('destinations/:slug')
  @Public()
  @ApiOperation({
    summary: 'Get destination by slug',
    description: 'Returns full destination detail including images and tags.',
  })
  @ApiParam({ name: 'slug', description: 'URL-friendly destination identifier' })
  @ApiResponse({ status: 200, description: 'Destination detail' })
  @ApiResponse({ status: 404, description: 'Destination not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.destinations.findBySlug(slug);
  }

  // =========================================================================
  // ADMIN ENDPOINTS
  // =========================================================================

  /**
   * POST /admin/destinations
   * Create a new destination.
   * Req 7 — requires ADMIN role.
   */
  @Post('admin/destinations')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create destination (Admin)',
    description:
      'Creates a new destination. Slug is auto-generated from name. Country and city are found or created automatically.',
  })
  @ApiResponse({ status: 201, description: 'Destination created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  create(@Body() dto: CreateDestinationDto) {
    return this.destinations.create(dto);
  }

  /**
   * PUT /admin/destinations/:id
   * Update an existing destination.
   * Req 7 — requires ADMIN role.
   */
  @Put('admin/destinations/:id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update destination (Admin)',
    description: 'Updates destination fields. Slug is regenerated only if name changes.',
  })
  @ApiParam({ name: 'id', description: 'Destination ID' })
  @ApiResponse({ status: 200, description: 'Destination updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Destination not found' })
  update(@Param('id') id: string, @Body() dto: UpdateDestinationDto) {
    return this.destinations.update(id, dto);
  }

  /**
   * DELETE /admin/destinations/:id
   * Soft-delete a destination (sets status=DELETED).
   * Req 7, 21 — requires ADMIN role.
   */
  @Delete('admin/destinations/:id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Soft-delete destination (Admin)',
    description: 'Sets destination status to DELETED. The record is not removed from the database.',
  })
  @ApiParam({ name: 'id', description: 'Destination ID' })
  @ApiResponse({ status: 204, description: 'Destination deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Destination not found' })
  async softDelete(@Param('id') id: string) {
    await this.destinations.softDelete(id);
  }

  /**
   * POST /admin/destinations/:id/images
   * Add an image to a destination.
   * Req 7 — requires ADMIN role. (File upload comes in Task 22.)
   */
  @Post('admin/destinations/:id/images')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add image to destination (Admin)',
    description:
      'Adds an image record to the destination. Accepts imageUrl as a string. File upload support will be added in Task 22.',
  })
  @ApiParam({ name: 'id', description: 'Destination ID' })
  @ApiResponse({ status: 201, description: 'Image added' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Destination not found' })
  addImage(@Param('id') id: string, @Body() dto: AddDestinationImageDto) {
    return this.destinations.addImage(id, dto);
  }

  /**
   * DELETE /admin/destination-images/:imageId
   * Remove a destination image record.
   * Req 7 — requires ADMIN role.
   */
  @Delete('admin/destination-images/:imageId')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remove destination image (Admin)',
    description: 'Deletes a destination image record by its ID.',
  })
  @ApiParam({ name: 'imageId', description: 'DestinationImage ID' })
  @ApiResponse({ status: 204, description: 'Image removed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async removeImage(@Param('imageId') imageId: string) {
    await this.destinations.removeImage(imageId);
  }
}
