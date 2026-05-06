import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Injectable, type INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";

type EnvelopeBody = {
  success: boolean;
  data?: unknown;
  message?: string;
  meta?: Record<string, unknown>;
};

function isEnvelopeBody(value: unknown): value is EnvelopeBody {
  return typeof value === "object" && value !== null && "success" in value;
}

@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((value) => {
        if (isEnvelopeBody(value)) {
          return value;
        }
        return { success: true, data: value, message: "OK", meta: {} };
      })
    );
  }
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<{ status: (statusCode: number) => { json: (body: unknown) => void } }>();
    const request = host.switchToHttp().getRequest<{ url?: string }>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : "Internal server error";
    const errorBody = typeof exceptionResponse === "object" && exceptionResponse !== null ? (exceptionResponse as Record<string, unknown>) : {};
    const rawMessage = errorBody.message ?? exceptionResponse;
    const details = Array.isArray(rawMessage) ? rawMessage : undefined;
    const message = Array.isArray(rawMessage) ? "Validation failed" : String(rawMessage);

    response.status(status).json({
      success: false,
      data: null,
      message,
      error: {
        code: errorBody.error ?? HttpStatus[status] ?? "Error",
        statusCode: status,
        details
      },
      meta: {
        path: request.url ?? "",
        timestamp: new Date().toISOString()
      }
    });
  }
}

export function configureApiApp(app: INestApplication) {
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false }
    })
  );
  app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());
  app.useGlobalFilters(new ApiExceptionFilter());
}
