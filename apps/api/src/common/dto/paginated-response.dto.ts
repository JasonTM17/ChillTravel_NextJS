import { ApiProperty } from "@nestjs/swagger";
import {
  buildPaginatedResponse,
  type ApiPaginated
} from "@vietwander/shared";

/**
 * Swagger-friendly wrapper class that mirrors the structural
 * {@link ApiPaginated} shape from `@vietwander/shared`.
 *
 * Used as the `type` for `@ApiOkResponse` so Swagger can render the
 * pagination fields in documentation. For response construction, prefer
 * {@link buildPagination} which delegates to the shared helper.
 *
 * Design §3.2.
 */
export class PaginatedResponseDto<T> implements ApiPaginated<T> {
  @ApiProperty({ isArray: true, description: "Page items" })
  items!: T[];

  @ApiProperty({ description: "Zero-based page index", example: 0 })
  page!: number;

  @ApiProperty({ description: "Page size", example: 10 })
  size!: number;

  @ApiProperty({ description: "Total matching elements across all pages" })
  totalElements!: number;

  @ApiProperty({ description: "Total number of pages" })
  totalPages!: number;

  @ApiProperty()
  hasNext!: boolean;

  @ApiProperty()
  hasPrevious!: boolean;
}

/**
 * Build an {@link ApiPaginated} payload. Delegates to the shared helper so
 * both backend and frontend speak the exact same envelope shape.
 */
export function buildPagination<T>(
  items: T[],
  page: number,
  size: number,
  totalElements: number
): ApiPaginated<T> {
  return buildPaginatedResponse(items, page, size, totalElements);
}
