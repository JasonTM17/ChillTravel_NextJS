import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  type PaginationQuery
} from "@vietwander/shared";

/** Upper bound on page size to prevent clients exhausting DB resources. */
export const MAX_PAGE_SIZE = 100;

/**
 * Shared pagination query DTO used by every paginated list endpoint
 * (design §3.4 / Req 22).
 *
 * Defaults (applied server-side):
 *   - `page` → 0
 *   - `size` → 10
 *   - `sort` → omitted
 *
 * `sort` accepts either a single `"field,direction"` string or an array of
 * them for multi-column sorting, matching the REST convention documented
 * in design §3.4.
 */
export class PaginationQueryDto implements PaginationQuery {
  @ApiPropertyOptional({
    default: DEFAULT_PAGE,
    description: "Zero-based page index",
    minimum: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    default: DEFAULT_PAGE_SIZE,
    description: "Page size (items per page)",
    minimum: 1,
    maximum: MAX_PAGE_SIZE
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  size?: number = DEFAULT_PAGE_SIZE;

  @ApiPropertyOptional({
    description:
      'Sort expression using "field,direction" syntax (e.g. "createdAt,desc"). ' +
      "Pass the parameter multiple times for multi-column sorting.",
    example: "createdAt,desc"
  })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => String(v)) : String(value)
  )
  @IsString({ each: true })
  sort?: string | string[];
}
