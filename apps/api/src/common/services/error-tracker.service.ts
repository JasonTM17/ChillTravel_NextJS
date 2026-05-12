import { Injectable, Logger } from "@nestjs/common";
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

/**
 * IErrorTracker — abstraction for error tracking.
 * LocalErrorTracker writes JSONL to logs/errors.jsonl.
 * Future: SentryErrorTracker implements same interface.
 *
 * Req 46 / Design §18.8.
 */
export interface IErrorTracker {
  capture(error: Error, context?: Record<string, unknown>): void;
  setUser(userId: string): void;
}

@Injectable()
export class LocalErrorTracker implements IErrorTracker {
  private readonly logger = new Logger(LocalErrorTracker.name);
  private readonly logDir = join(process.cwd(), "logs");
  private readonly logFile = join(this.logDir, "errors.jsonl");

  capture(error: Error, context?: Record<string, unknown>): void {
    const entry = JSON.stringify({
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context: context ?? {}
    });

    // Fire-and-forget — never block the request
    void mkdir(this.logDir, { recursive: true })
      .then(() => appendFile(this.logFile, entry + "\n"))
      .catch((err) => this.logger.warn(`Failed to write error log: ${String(err)}`));
  }

  setUser(_userId: string): void {
    // No-op for local tracker
  }
}
