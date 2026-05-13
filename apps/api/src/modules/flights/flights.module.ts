import { Module } from '@nestjs/common';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';

/**
 * FlightsModule — encapsulates flight listing functionality.
 *
 * Note: In the current architecture, controllers and services are registered
 * directly in AppModule's flat arrays. This module exists for organizational
 * purposes and can be imported if the architecture migrates to module-based.
 */
@Module({
  controllers: [FlightsController],
  providers: [FlightsService],
  exports: [FlightsService],
})
export class FlightsModule {}
