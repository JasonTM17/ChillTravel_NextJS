/**
 * Core Web Vitals reporter (Req 5.4).
 *
 * Sends LCP, CLS, and INP metrics to `/api/vitals` endpoint.
 * Uses the `web-vitals` library for accurate measurement.
 *
 * Usage: Call `reportWebVitals()` once in the root layout or _app component.
 */

type MetricPayload = {
  name: string;
  value: number;
  id: string;
  navigationType: string;
  rating: string;
};

function sendToEndpoint(metric: MetricPayload): void {
  const body = JSON.stringify(metric);

  // Use sendBeacon for reliability (fires even on page unload)
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon('/api/vitals', blob);
  } else {
    fetch('/api/vitals', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(() => {
      // Silently fail — vitals reporting is best-effort
    });
  }
}

/**
 * Initialize Core Web Vitals reporting.
 * Dynamically imports `web-vitals` to avoid bundling it on the server.
 */
export function reportWebVitals(): void {
  if (typeof window === 'undefined') return;

  import('web-vitals').then(({ onLCP, onCLS, onINP }) => {
    onLCP((metric) => {
      sendToEndpoint({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        navigationType: metric.navigationType ?? 'unknown',
        rating: metric.rating,
      });
    });

    onCLS((metric) => {
      sendToEndpoint({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        navigationType: metric.navigationType ?? 'unknown',
        rating: metric.rating,
      });
    });

    onINP((metric) => {
      sendToEndpoint({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        navigationType: metric.navigationType ?? 'unknown',
        rating: metric.rating,
      });
    });
  }).catch(() => {
    // web-vitals not available — skip silently
  });
}
