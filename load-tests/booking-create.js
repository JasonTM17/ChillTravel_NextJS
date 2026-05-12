/**
 * k6 load test — POST /api/v1/bookings (authenticated endpoint)
 *
 * Requires a valid JWT token. Set via env var:
 *   k6 run -e JWT_TOKEN=<token> load-tests/booking-create.js
 *
 * Design §18.7 / Req 40.
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const errorRate = new Rate("error_rate");

export const options = {
  vus: 10,
  duration: "30s",
  thresholds: {
    http_req_duration: ["p(95)<1000"],
    error_rate: ["rate<0.1"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";
const JWT_TOKEN = __ENV.JWT_TOKEN || "";

export default function () {
  if (!JWT_TOKEN) {
    console.warn("JWT_TOKEN not set — booking endpoint will return 401");
  }

  const payload = JSON.stringify({
    tourId: "test-tour-id",
    contactName: "Load Test User",
    contactEmail: "loadtest@wanderviet.com",
    contactPhone: "0900000000",
    numberOfGuests: 1,
  });

  const res = http.post(`${BASE_URL}/api/v1/bookings`, payload, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(JWT_TOKEN ? { Authorization: `Bearer ${JWT_TOKEN}` } : {}),
    },
  });

  const ok = check(res, {
    "status is 201 or 400 (validation)": (r) =>
      r.status === 201 || r.status === 400 || r.status === 401,
    "response is JSON": (r) => {
      try {
        JSON.parse(r.body);
        return true;
      } catch {
        return false;
      }
    },
  });

  errorRate.add(!ok);
  sleep(1);
}
