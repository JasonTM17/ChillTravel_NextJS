/**
 * OpenTelemetry initialization (opt-in via OTEL_EXPORTER_OTLP_ENDPOINT env var).
 *
 * Requirement: Req 5.9
 * Design: §5 Observability Stack — OpenTelemetry (opt-in via env)
 *
 * This file should be imported at the very top of `main.ts` BEFORE any other
 * imports, so that auto-instrumentation can patch modules before they load:
 *
 *   import './telemetry';
 *   import { NestFactory } from '@nestjs/core';
 *   ...
 *
 * When `OTEL_EXPORTER_OTLP_ENDPOINT` is NOT set, this module is a no-op.
 */

const otlpEndpoint = process.env['OTEL_EXPORTER_OTLP_ENDPOINT'];

if (otlpEndpoint) {
  // Dynamic require to avoid loading heavy OTEL deps when not needed.
  // Uses require() with try/catch so missing packages don't break the build.
  void (async () => {
    try {
      /* eslint-disable @typescript-eslint/no-require-imports */
      const { NodeSDK } = require('@opentelemetry/sdk-node') as {
        NodeSDK: new (config: Record<string, unknown>) => {
          start(): void;
          shutdown(): Promise<void>;
        };
      };
      const { getNodeAutoInstrumentations } = require(
        '@opentelemetry/auto-instrumentations-node',
      ) as { getNodeAutoInstrumentations: (config: Record<string, unknown>) => unknown[] };
      const { OTLPTraceExporter } = require(
        '@opentelemetry/exporter-trace-otlp-http',
      ) as { OTLPTraceExporter: new (config: { url: string }) => unknown };
      const { Resource } = require('@opentelemetry/resources') as {
        Resource: new (attrs: Record<string, string>) => unknown;
      };
      /* eslint-enable @typescript-eslint/no-require-imports */

      const resource = new Resource({
        'service.name': 'wanderviet-api',
        'service.version': '1.0.0',
      });

      const traceExporter = new OTLPTraceExporter({
        url: `${otlpEndpoint}/v1/traces`,
      });

      const sdk = new NodeSDK({
        resource,
        traceExporter,
        instrumentations: [
          getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-http': { enabled: true },
            '@opentelemetry/instrumentation-express': { enabled: true },
            '@opentelemetry/instrumentation-pg': { enabled: true },
            '@opentelemetry/instrumentation-fs': { enabled: false },
            '@opentelemetry/instrumentation-dns': { enabled: false },
          }),
        ],
      });

      sdk.start();

      // Graceful shutdown
      const shutdown = async () => {
        try {
          await sdk.shutdown();
        } catch (err) {
          console.error('OpenTelemetry shutdown error:', err);
        }
      };

      process.on('SIGTERM', shutdown);
      process.on('SIGINT', shutdown);

      console.info(
        `[telemetry] OpenTelemetry initialized — exporting traces to ${otlpEndpoint}`,
      );
    } catch (err) {
      console.warn(
        '[telemetry] Failed to initialize OpenTelemetry (packages may not be installed):',
        err instanceof Error ? err.message : err,
      );
    }
  })();
}
