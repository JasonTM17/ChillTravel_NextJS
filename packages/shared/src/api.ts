/**
 * WanderViet unified API response envelopes + pagination helpers.
 *
 * These shapes implement design §3.2 (response format) and §3.4 (pagination
 * query) of the WanderViet Travel Platform spec. They are **distinct from**
 * the legacy `ApiResponse<T>` (see `./types`) and `ApiErrorEnvelope` (see
 * `./contracts`) envelopes that the ChillTravel baseline still uses. Both
 * envelope families coexist so existing consumers (AI service, mobile,
 * legacy web endpoints) keep working unchanged while new WanderViet
 * endpoints adopt the canonical format.
 *
 * This module is runtime-dependency-free — pure TypeScript + small helpers.
 * The backend (`apps/api`) is expected to wrap these types in class-validator
 * DTOs; the web/mobile clients consume them directly.
 */

// ---------------------------------------------------------------------------
// Response envelopes
// ---------------------------------------------------------------------------

/**
 * Canonical WanderViet success envelope.
 *
 * @example
 * { success: true, message: "OK", data: { id: "1" }, timestamp: "2025-..." }
 */
export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  /** ISO-8601 UTC timestamp of when the response was produced. */
  timestamp: string;
}

/**
 * Single field-level error entry attached to {@link ApiError.errors}.
 *
 * `field` is the dotted path of the offending request field (e.g.
 * `"body.email"`) or `"_"` when the error is not tied to a specific field.
 */
export interface ApiFieldError {
  field: string;
  message: string;
}

/**
 * Canonical WanderViet error envelope.
 *
 * @example
 * {
 *   success: false,
 *   message: "Validation failed",
 *   errors: [{ field: "email", message: "Must be a valid email" }],
 *   timestamp: "2025-..."
 * }
 */
export interface ApiError {
  success: false;
  message: string;
  errors: ApiFieldError[];
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

/**
 * Page-shaped payload returned as the `data` field of an {@link ApiSuccess}
 * when the endpoint is paginated (design §3.2).
 */
export interface ApiPaginated<T> {
  items: T[];
  /** Zero-based page index (design §3.4). */
  page: number;
  /** Page size (number of items per page). */
  size: number;
  /** Total number of items across all pages. */
  totalElements: number;
  /** Total number of pages. Always `>= 0`. */
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/** Convenience alias for `ApiSuccess<ApiPaginated<T>>`. */
export type ApiPaginatedResponse<T> = ApiSuccess<ApiPaginated<T>>;

/**
 * Query params accepted by paginated list endpoints (design §3.4).
 *
 * Defaults applied by the server:
 *   - `page` → `0`
 *   - `size` → `10`
 *
 * `sort` accepts either a single `"field,asc|desc"` string or an array of
 * them for multi-column sort, per typical REST conventions.
 */
export interface PaginationQuery {
  page?: number;
  size?: number;
  sort?: string | string[];
}

/** Parsed sort descriptor produced by {@link parseSortQuery}. */
export interface SortQuery {
  field: string;
  direction: "asc" | "desc";
}

/** Default page index used when `page` is missing or invalid. */
export const DEFAULT_PAGE = 0;
/** Default page size used when `size` is missing or invalid. */
export const DEFAULT_PAGE_SIZE = 10;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse the `sort` query parameter into an array of {@link SortQuery}
 * descriptors. Unknown / malformed directions default to `"asc"`. Empty or
 * missing input yields an empty array.
 *
 * Accepted forms:
 *   - `"createdAt,desc"` → `[{ field: "createdAt", direction: "desc" }]`
 *   - `"name"`           → `[{ field: "name", direction: "asc" }]`
 *   - `["a,asc", "b,desc"]` → both descriptors in order
 */
export function parseSortQuery(sort?: string | string[]): SortQuery[] {
  if (sort === undefined || sort === null) {
    return [];
  }
  const raw = Array.isArray(sort) ? sort : [sort];
  const out: SortQuery[] = [];
  for (const entry of raw) {
    if (typeof entry !== "string") continue;
    const trimmed = entry.trim();
    if (!trimmed) continue;
    const [fieldPart, dirPart] = trimmed.split(",", 2).map((v) => v.trim());
    if (!fieldPart) continue;
    const direction: "asc" | "desc" =
      dirPart && dirPart.toLowerCase() === "desc" ? "desc" : "asc";
    out.push({ field: fieldPart, direction });
  }
  return out;
}

/**
 * Build an {@link ApiPaginated} payload from an already-sliced page of
 * items plus the total element count. `totalPages`, `hasNext`, and
 * `hasPrevious` are computed from `page`, `size`, and `totalElements`.
 *
 * If `size <= 0` the function treats `size` as `1` for the purposes of
 * computing `totalPages` to avoid division-by-zero; callers should
 * normalize inputs before calling.
 */
export function buildPaginatedResponse<T>(
  items: T[],
  page: number,
  size: number,
  totalElements: number
): ApiPaginated<T> {
  const safeSize = size > 0 ? size : 1;
  const totalPages =
    totalElements <= 0 ? 0 : Math.ceil(totalElements / safeSize);
  const hasPrevious = page > 0;
  const hasNext = page + 1 < totalPages;
  return {
    items,
    page,
    size,
    totalElements,
    totalPages,
    hasNext,
    hasPrevious,
  };
}

/**
 * Wrap a payload in an {@link ApiSuccess} envelope. `timestamp` is stamped
 * as the current ISO-8601 UTC string.
 */
export function successResponse<T>(
  data: T,
  message = "OK"
): ApiSuccess<T> {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Build an {@link ApiError} envelope. `errors` defaults to an empty array
 * (for non-validation errors such as 404/500 where there is no specific
 * field to report).
 */
export function errorResponse(
  message: string,
  errors: ApiFieldError[] = []
): ApiError {
  return {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };
}
