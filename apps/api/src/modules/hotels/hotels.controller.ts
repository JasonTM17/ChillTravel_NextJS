import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { HotelQueryDto } from './dto/hotel-query.dto';
import { HotelsService } from './hotels.service';

/**
 * HotelsController — public hotel listing and detail endpoints.
 *
 * GET /hotels — paginated hotel listing with filters and sort.
 * GET /hotels/:id — single hotel detail.
 *
 * Design §8 (Hotel Listing API).
 */
@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  /**
   * GET /hotels
   * List hotels with optional filters, sort, and pagination.
   * Public endpoint — no auth required.
   */
  @Get()
  @Public()
  @ApiOperation({
    summary: 'List hotels',
    description:
      'Returns a paginated list of hotels. Supports filtering by price range, ' +
      'star rating, amenities, property type, distance from center, and destination. ' +
      'Sort options: price-asc, price-desc, rating, popularity, distance.',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of hotels' })
  findAll(@Query() query: HotelQueryDto) {
    return this.hotelsService.findAll(query);
  }

  /**
   * GET /hotels/:id
   * Get a single hotel by ID with full details.
   * Public endpoint — no auth required.
   */
  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Get hotel by ID',
    description: 'Returns full hotel detail including rooms, destination info, and all metadata.',
  })
  @ApiParam({ name: 'id', description: 'Hotel ID' })
  @ApiResponse({ status: 200, description: 'Hotel detail' })
  @ApiResponse({ status: 404, description: 'Hotel not found' })
  findById(@Param('id') id: string) {
    return this.hotelsService.findById(id);
  }
}
