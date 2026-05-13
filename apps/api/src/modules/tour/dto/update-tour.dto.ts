import { PartialType } from '@nestjs/swagger';
import { CreateTourDto } from './create-tour.dto';

/**
 * DTO for updating an existing tour.
 * All fields from CreateTourDto are optional.
 * Design §3.3 Tours / Req 9.
 */
export class UpdateTourDto extends PartialType(CreateTourDto) {}
