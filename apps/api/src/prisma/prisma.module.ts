import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PrismaModule — global DB access module.
 *
 * Registered as @Global() so feature modules do not need to import it
 * individually; they can simply inject PrismaService directly.
 *
 * Design reference: design.md §1.2 (module layout) and §5.1 (PrismaModule).
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
