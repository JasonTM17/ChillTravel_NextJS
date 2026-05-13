import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

/**
 * SearchModule — encapsulates search/autocomplete functionality.
 *
 * PrismaModule is @Global so no explicit import needed.
 * Design §8 / Req 7.4.
 */
@Module({
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
