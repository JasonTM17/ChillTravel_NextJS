import { PartialType } from '@nestjs/swagger';
import { CreateDestinationDto } from './create-destination.dto';

/**
 * DTO for updating an existing destination (Admin).
 * All fields from CreateDestinationDto become optional.
 * Req 7 / Design §5.2.
 */
export class UpdateDestinationDto extends PartialType(CreateDestinationDto) {}
