import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  Optional
} from "@nestjs/common";
import { errorResponse, type ApiError, type ApiFieldError } from "@vietwander/shared";
import { LocalErrorTracker } from "../services/error-tracker.service";

/**
 * Minimal structural types for the express-style request/response objects
 * NestJS hands us. Avoids a hard dependency on `@types/express` (not
 * installed in apps/api) while keeping the filter strongly typed for the
 * fields we actually touch.
 */
interface MinimalRequest {
  url?: string;
}

interface MinimalResponse {
  status(code: number): MinimalResponse;
  json(body: unknown): MinimalResponse;
}

/**
 * Shape of the `getResponse()` payload that NestJS returns for HTTP
 * exceptions. The `message` field can be a string (simple throw) or an
 * array of strings (class-validator ValidationPipe output).
 */
interface NestHttpExceptionResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
  errors?: ApiFieldError[];
}

/** Narrow `unknown` into a shape-check for Prisma known-request errors. */
function isPrismaKnownRequestError(
  err: unknown
): err is { code: string; meta?: Record<string, unknown>; message: string } {
  if (typeof err !== "object" || err === null) return false;
  const candidate = err as { name?: unknown; code?: unknown };
  return (
    candidate.name === "PrismaClientKnownRequestError" &&
    typeof candidate.code === "string"
  );
}

function extractValidationErrors(
  raw: string | string[] | undefined
): { message: string; errors: ApiFieldError[] } {
  if (Array.isArray(raw)) {
    return {
      message: "Validation failed",
      // class-validator emits a flat array of "field must be ..." strings.
      // We preserve the text but put it under the generic `_` field slot
      // since we don't have access to the original field name here.
      errors: raw.map((msg) => ({ field: deriveFieldFromMessage(msg), message: msg }))
    };
  }
  return { message: raw ?? "Request failed", errors: [] };
}

/**
 * Heuristic: class-validator messages usually start with the field name,
 * e.g. "email must be an email". We extract the first token so the caller
 * gets something more useful than the generic `_` placeholder.
 */
function deriveFieldFromMessage(message: string): string {
  const trimmed = message.trim();
  if (!trimmed) return "_";
  const first = trimmed.split(/\s+/)[0];
  return /^[A-Za-z_][\w.]*$/.test(first) ? first : "_";
}

/**
 * Global exception filter (design §5.5, Req 22).
 *
 * Responsibilities:
 *   - Maps every thrown value to the {@link ApiError} envelope.
 *   - Preserves validation details from class-validator (400 + errors[]).
 *   - Translates Prisma error codes into HTTP-appropriate responses:
 *       P2002 unique constraint → 409 Conflict
 *       P2025 record not found  → 404 Not Found
 *       P2003 FK violation      → 400 Bad Request
 *   - Falls back to 500 with a generic message. Stack traces are logged
 *     server-side only; they never leave the process.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(
    @Optional() private readonly errorTracker?: LocalErrorTracker
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<MinimalResponse>();
    const request = ctx.getRequest<MinimalRequest>();
    const path = request?.url ?? "";

    const { status, body } = this.buildErrorResponse(exception, path);

    response.status(status).json(body);
  }

  private buildErrorResponse(
    exception: unknown,
    path: string
  ): { status: number; body: ApiError } {
    // --- HttpException branch -----------------------------------------------
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const parsed: NestHttpExceptionResponse =
        typeof payload === "object" && payload !== null
          ? (payload as NestHttpExceptionResponse)
          : { message: String(payload) };

      // Prefer explicit structured errors when the caller already provided them.
      if (Array.isArray(parsed.errors) && parsed.errors.length > 0) {
        return {
          status,
          body: errorResponse(
            typeof parsed.message === "string" ? parsed.message : "Request failed",
            parsed.errors
          )
        };
      }

      const { message, errors } = extractValidationErrors(parsed.message);
      return { status, body: errorResponse(message, errors) };
    }

    // --- Prisma known-request errors ---------------------------------------
    if (isPrismaKnownRequestError(exception)) {
      return this.buildPrismaErrorResponse(exception);
    }

    // --- Fallback: unknown exception → 500 ---------------------------------
    const error = exception instanceof Error ? exception : new Error(String(exception));
    this.logger.error(
      `Unhandled exception at ${path}: ${error.message}`,
      error.stack
    );
    this.errorTracker?.capture(error, { path });
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: errorResponse("Internal server error")
    };
  }

  private buildPrismaErrorResponse(err: {
    code: string;
    meta?: Record<string, unknown>;
    message: string;
  }): { status: number; body: ApiError } {
    switch (err.code) {
      case "P2002": {
        const target = Array.isArray(err.meta?.target)
          ? (err.meta.target as string[]).join(", ")
          : typeof err.meta?.target === "string"
            ? (err.meta.target as string)
            : "field";
        return {
          status: HttpStatus.CONFLICT,
          body: errorResponse("Resource already exists", [
            { field: target, message: `Duplicate value for ${target}` }
          ])
        };
      }
      case "P2025":
        return {
          status: HttpStatus.NOT_FOUND,
          body: errorResponse("Resource not found")
        };
      case "P2003": {
        const field =
          typeof err.meta?.field_name === "string" ? (err.meta.field_name as string) : "_";
        return {
          status: HttpStatus.BAD_REQUEST,
          body: errorResponse("Foreign key constraint violation", [
            { field, message: "Referenced record does not exist" }
          ])
        };
      }
      default:
        this.logger.error(
          `Unhandled Prisma error ${err.code}: ${err.message}`
        );
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          body: errorResponse("Database error")
        };
    }
  }
}
