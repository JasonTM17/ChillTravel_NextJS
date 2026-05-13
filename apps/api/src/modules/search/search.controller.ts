import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { AutocompleteQueryDto } from './dto/autocomplete-query.dto';
import { SearchService } from './search.service';

/**
 * SearchController — public search/autocomplete endpoints.
 *
 * GET /search/autocomplete — returns up to 8 suggestions matching the query
 * across destinations, cities, and hotels using PostgreSQL ILIKE matching.
 *
 * Design §8 / Req 7.4.
 */
@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * GET /search/autocomplete
   * Returns autocomplete suggestions for the search bar.
   * Minimum 2 characters required; returns empty array otherwise.
   */
  @Get('autocomplete')
  @Public()
  @ApiOperation({
    summary: 'Search autocomplete',
    description:
      'Returns up to 8 autocomplete suggestions matching the query string. ' +
      'Searches across destinations, cities, and hotels using ILIKE pattern matching. ' +
      'Returns empty array if query is less than 2 characters.',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of autocomplete suggestions',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          type: { type: 'string', enum: ['destination', 'city', 'hotel'] },
          description: { type: 'string' },
          imageUrl: { type: 'string', nullable: true },
        },
      },
    },
  })
  autocomplete(@Query() query: AutocompleteQueryDto) {
    return this.searchService.autocomplete(query.q, query.type ?? 'all', query.limit ?? 8);
  }
}
