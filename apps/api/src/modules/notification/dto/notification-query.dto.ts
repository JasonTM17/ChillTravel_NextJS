import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';

/**
 * Query DTO for listing notifications.
 * Extends pagination with an optional `unreadOnly` filter.
 *
 * Req 37 / Design §18.1 Notification.
 */
export class NotificationQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'When true, return only unread notifications',
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  unreadOnly?: boolean;
}
