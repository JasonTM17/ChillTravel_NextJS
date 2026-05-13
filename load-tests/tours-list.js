/**
 * k6 load test — GET /api/v1/tours (public endpoint)
 *
 * Run:
 *   k6 run load-tests/tours-list.js
 *   k6 run --out json=load-tests/results.json load-tests/tours-list.js
 *
 * Design §18.7 / Req 40.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// ---------------------------------------------------------------------------
// Custom metrics
// ---------------------------------------------------------------------------

const errorRate = new Rate('error_rate');
const tourListDuration = new Trend('tour_list_duration', true);

// ---------------------------------------------------------------------------
// Test options
// ---------------------------------------------------------------------------

export const options = {
  vus: 100,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    error_rate: ['rate<0.05'],
  },
};

// ---------------------------------------------------------------------------
// Test scenario
// ---------------------------------------------------------------------------

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';

export default function () {
  const res = http.get(`${BASE_URL}/api/v1/tours?page=0&size=12`, {
    headers: { Accept: 'application/json' },
  });

  const ok = check(res, {
    'status is 200': (r) => r.status === 200,
    'response has success:true': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true;
      } catch {
        return false;
      }
    },
    'p95 < 500ms': (r) => r.timings.duration < 500,
  });

  errorRate.add(!ok);
  tourListDuration.add(res.timings.duration);

  sleep(0.3);
}
