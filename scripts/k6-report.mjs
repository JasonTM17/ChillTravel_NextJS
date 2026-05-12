#!/usr/bin/env node
/**
 * k6 JSON output → Markdown report generator.
 *
 * Usage:
 *   k6 run --out json=load-tests/results.json load-tests/tours-list.js
 *   node scripts/k6-report.mjs load-tests/results.json docs/load-test-report.md
 *
 * Design §18.7 / Req 40.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [, , inputFile, outputFile] = process.argv;

if (!inputFile) {
  console.error("Usage: node scripts/k6-report.mjs <results.json> [output.md]");
  process.exit(1);
}

const lines = readFileSync(inputFile, "utf8").trim().split("\n");

// Parse k6 JSON output (one JSON object per line)
const metrics = {};
for (const line of lines) {
  try {
    const entry = JSON.parse(line);
    if (entry.type === "Metric") {
      metrics[entry.data.name] = entry.data;
    }
  } catch {
    // Skip non-JSON lines
  }
}

// Extract key metrics
function getMetric(name, stat) {
  const m = metrics[name];
  if (!m) return "N/A";
  const val = m.values?.[stat];
  if (val === undefined) return "N/A";
  return typeof val === "number" ? val.toFixed(2) : String(val);
}

const now = new Date().toISOString();
const report = `# WanderViet Load Test Report

Generated: ${now}

## Summary

| Metric | Value |
|--------|-------|
| Avg latency | ${getMetric("http_req_duration", "avg")} ms |
| p95 latency | ${getMetric("http_req_duration", "p(95)")} ms |
| p99 latency | ${getMetric("http_req_duration", "p(99)")} ms |
| Max latency | ${getMetric("http_req_duration", "max")} ms |
| Requests/s | ${getMetric("http_reqs", "rate")} |
| Total requests | ${getMetric("http_reqs", "count")} |
| Error rate | ${getMetric("http_req_failed", "rate")} |

## Thresholds

See k6 output for threshold pass/fail status.

## Notes

- Test target: \`GET /api/v1/tours?page=0&size=12\`
- VUs: 100, Duration: 30s
- All payment flows are mock/demo only.
`;

const outPath =
  outputFile ?? join(process.cwd(), "docs", "load-test-report.md");
writeFileSync(outPath, report, "utf8");
console.log(`Report written to ${outPath}`);
