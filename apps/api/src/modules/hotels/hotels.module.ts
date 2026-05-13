import { Module } from '@nestjs/common';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';

/**
 * HotelsModule — encapsulates hotel listing and detail functionality.
 *
 * PrismaModule is @Global so no explicit import needed.
 * Design §8 (Hotel Listing API).
 */
@Module({
  controllers: [HotelsController],
  providers: [HotelsService],
  exports: [HotelsService],
})
export class HotelsModule {}
