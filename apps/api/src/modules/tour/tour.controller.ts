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
import { Audit } from '../../common/decorators/audit.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateDepartureDto } from './dto/create-departure.dto';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { CreateTourDto } from './dto/create-tour.dto';
import { TourQueryDto } from './dto/tour-query.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { TourService } from './tour.service';

/**
 * TourController — public browsing + admin CRUD for tours, itinerary, and departures.
 *
 * Uses a single controller with no class-level prefix so both
 * /tours (public) and /admin/tours (admin) routes live in the same file.
 *
 * IMPORTANT: GET /tours/featured is registered BEFORE GET /tours/:slug to
 * avoid NestJS routing conflict (featured would match as a slug).
 *
 * Design §3.3 Tours, §18.1 TourDeparture / Req 8, 9, 21, 34.
 */
@ApiTags('Tours')
@Controller()
export class TourController {
  constructor(private readonly tourService: TourService) {}

  // =========================================================================
  // PUBLIC ENDPOINTS
  // =========================================================================

  /**
   * GET /tours
   * List tours with optional filters, sort, and pagination.
   * Req 8 — public, no auth required.
   */
  @Get('tours')
  @Public()
  @ApiOperation({
    summary: 'List tours',
    description:
      'Returns a paginated list of ACTIVE tours. Supports filtering by keyword, category, price range, duration, and destination. Sort options: price, popular, rating, newest.',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of tours' })
  findAll(@Query() query: TourQueryDto) {
    return this.tourService.findAll(query);
  }

  /**
   * GET /tours/featured
   * Returns featured ACTIVE tours (limit 8).
   * MUST be registered BEFORE /tours/:slug to avoid routing conflict.
   * Req 8 — public, no auth required.
   */
  @Get('tours/featured')
  @Public()
  @ApiOperation({
    summary: 'Get featured tours',
    description: 'Returns up to 8 featured ACTIVE tours for homepage display.',
  })
  @ApiResponse({ status: 200, description: 'List of featured tours' })
  findFeatured() {
    return this.tourService.findFeatured();
  }

  /**
   * GET /tours/:slug
   * Get tour detail by slug with images, itinerary, departures, and avg rating.
   * Req 8 — public, no auth required.
   */
  @Get('tours/:slug')
  @Public()
  @ApiOperation({
    summary: 'Get tour by slug',
    description:
      'Returns full tour detail including images, itinerary (ordered by day), open future departures, and average rating from APPROVED reviews.',
  })
  @ApiParam({ name: 'slug', description: 'URL-friendly tour identifier' })
  @ApiResponse({ status: 200, description: 'Tour detail' })
  @ApiResponse({ status: 404, description: 'Tour not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.tourService.findBySlug(slug);
  }

  // =========================================================================
  // ADMIN ENDPOINTS — TOUR CRUD
  // =========================================================================

  /**
   * POST /admin/tours
   * Create a new tour.
   * Req 9 — requires ADMIN role.
   */
  @Post('admin/tours')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Audit('ADMIN_CREATE_TOUR', 'Tour')
  @ApiOperation({
    summary: 'Create tour (Admin)',
    description:
      'Creates a new tour. Slug is auto-generated from title. Validates destination exists, price >= 0, maxGuests > 0.',
  })
  @ApiResponse({ status: 201, description: 'Tour created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Destination not found' })
  create(@Body() dto: CreateTourDto) {
    return this.tourService.create(dto);
  }

  /**
   * PUT /admin/tours/:id
   * Update an existing tour.
   * Req 9 — requires ADMIN role.
   */
  @Put('admin/tours/:id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Audit('ADMIN_UPDATE_TOUR', 'Tour')
  @ApiOperation({
    summary: 'Update tour (Admin)',
    description:
      'Updates tour fields. Slug is regenerated only if title changes. Validates destination if changed.',
  })
  @ApiParam({ name: 'id', description: 'Tour ID' })
  @ApiResponse({ status: 200, description: 'Tour updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Tour or destination not found' })
  update(@Param('id') id: string, @Body() dto: UpdateTourDto) {
    return this.tourService.update(id, dto);
  }

  /**
   * DELETE /admin/tours/:id
   * Soft-delete a tour (sets status=DELETED).
   * Req 9, 21 — requires ADMIN role.
   */
  @Delete('admin/tours/:id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @Audit('ADMIN_DELETE_TOUR', 'Tour')
  @ApiOperation({
    summary: 'Soft-delete tour (Admin)',
    description: 'Sets tour status to DELETED. The record is not removed from the database.',
  })
  @ApiParam({ name: 'id', description: 'Tour ID' })
  @ApiResponse({ status: 204, description: 'Tour deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Tour not found' })
  async softDelete(@Param('id') id: string) {
    await this.tourService.softDelete(id);
  }

  // =========================================================================
  // ADMIN ENDPOINTS — ITINERARY
  // =========================================================================

  /**
   * POST /admin/tours/:id/itinerary
   * Add or upsert an itinerary day for a tour.
   * Req 9 — requires ADMIN role.
   */
  @Post('admin/tours/:id/itinerary')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add/upsert itinerary day (Admin)',
    description:
      'Adds or updates an itinerary day for the tour. Upserted by (tourId, dayNumber) unique constraint.',
  })
  @ApiParam({ name: 'id', description: 'Tour ID' })
  @ApiResponse({ status: 201, description: 'Itinerary day added/updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Tour not found' })
  addItinerary(@Param('id') id: string, @Body() dto: CreateItineraryDto) {
    return this.tourService.addItinerary(id, dto);
  }

  /**
   * PUT /admin/tour-itinerary/:id
   * Update an itinerary item by its ID.
   * Req 9 — requires ADMIN role.
   */
  @Put('admin/tour-itinerary/:id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update itinerary item (Admin)',
    description: 'Updates an existing tour itinerary item by its ID.',
  })
  @ApiParam({ name: 'id', description: 'TourItinerary ID' })
  @ApiResponse({ status: 200, description: 'Itinerary item updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Itinerary item not found' })
  updateItinerary(@Param('id') id: string, @Body() dto: CreateItineraryDto) {
    return this.tourService.updateItinerary(id, dto);
  }

  /**
   * DELETE /admin/tour-itinerary/:id
   * Delete an itinerary item by its ID.
   * Req 9 — requires ADMIN role.
   */
  @Delete('admin/tour-itinerary/:id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete itinerary item (Admin)',
    description: 'Deletes a tour itinerary item by its ID.',
  })
  @ApiParam({ name: 'id', description: 'TourItinerary ID' })
  @ApiResponse({ status: 204, description: 'Itinerary item deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Itinerary item not found' })
  async deleteItinerary(@Param('id') id: string) {
    await this.tourService.deleteItinerary(id);
  }

  // =========================================================================
  // ADMIN ENDPOINTS — DEPARTURES
  // =========================================================================

  /**
   * POST /admin/tours/:id/departures
   * Add a departure for a tour.
   * Req 34 — requires ADMIN role.
   */
  @Post('admin/tours/:id/departures')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add tour departure (Admin)',
    description: 'Creates a new departure for the specified tour.',
  })
  @ApiParam({ name: 'id', description: 'Tour ID' })
  @ApiResponse({ status: 201, description: 'Departure created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Tour not found' })
  addDeparture(@Param('id') id: string, @Body() dto: CreateDepartureDto) {
    return this.tourService.addDeparture(id, dto);
  }

  /**
   * PUT /admin/tour-departures/:id
   * Update a tour departure by its ID.
   * Req 34 — requires ADMIN role.
   */
  @Put('admin/tour-departures/:id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update tour departure (Admin)',
    description: 'Updates an existing tour departure by its ID.',
  })
  @ApiParam({ name: 'id', description: 'TourDeparture ID' })
  @ApiResponse({ status: 200, description: 'Departure updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Departure not found' })
  updateDeparture(@Param('id') id: string, @Body() dto: CreateDepartureDto) {
    return this.tourService.updateDeparture(id, dto);
  }

  /**
   * DELETE /admin/tour-departures/:id
   * Delete a tour departure by its ID.
   * Req 34 — requires ADMIN role.
   */
  @Delete('admin/tour-departures/:id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete tour departure (Admin)',
    description: 'Deletes a tour departure by its ID.',
  })
  @ApiParam({ name: 'id', description: 'TourDeparture ID' })
  @ApiResponse({ status: 204, description: 'Departure deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  @ApiResponse({ status: 404, description: 'Departure not found' })
  async deleteDeparture(@Param('id') id: string) {
    await this.tourService.deleteDeparture(id);
  }
}
