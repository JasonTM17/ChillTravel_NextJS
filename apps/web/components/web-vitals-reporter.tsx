'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/web-vitals';

/**
 * Client component that initializes Core Web Vitals reporting (Req 5.4).
 * Include this in the root layout to start collecting LCP, CLS, INP metrics.
 */
export function WebVitalsReporter() {
  useEffect(() => {
    reportWebVitals();
  }, []);

  return null;
}
