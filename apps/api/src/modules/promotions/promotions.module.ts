import { Module } from '@nestjs/common';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';

/**
 * PromotionsModule — encapsulates public promotions functionality.
 *
 * Note: In the current architecture, controllers and services are registered
 * directly in AppModule's flat arrays. This module exists for organizational
 * purposes and can be imported if the architecture migrates to module-based.
 */
@Module({
  controllers: [PromotionsController],
  providers: [PromotionsService],
  exports: [PromotionsService],
})
export class PromotionsModule {}
