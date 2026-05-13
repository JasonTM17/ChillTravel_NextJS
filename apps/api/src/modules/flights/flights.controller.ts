import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { FlightQueryDto } from './dto/flight-query.dto';
import { FlightsService } from './flights.service';

/**
 * FlightsController — public flight listing endpoint.
 *
 * GET /flights — paginated flight listing with filters and sort.
 *
 * Supports filtering by origin, destination, departure date, time blocks,
 * stops, airlines, and price range. Default sort: lowest price first.
 * Max 20 results per page.
 */
@ApiTags('Flights')
@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  /**
   * GET /flights
   * List flights with optional filters, sort, and pagination.
   * Public endpoint — no auth required.
   */
  @Get()
  @Public()
  @ApiOperation({
    summary: 'List flights',
    description:
      'Returns a paginated list of flights. Supports filtering by origin, destination, ' +
      'departure date, departure time blocks (00-06, 06-12, 12-18, 18-24), number of stops, ' +
      'airlines, and price range. Default sort: lowest price. Max 20 results per page.',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of flights' })
  findAll(@Query() query: FlightQueryDto) {
    return this.flightsService.findAll(query);
  }
}
