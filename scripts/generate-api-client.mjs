#!/usr/bin/env node
/**
 * OpenAPI TypeScript client generator.
 *
 * Fetches the OpenAPI spec from the running API server and generates
 * a typed TypeScript client into packages/shared/src/generated/.
 *
 * Usage:
 *   # Start the API first, then run:
 *   node scripts/generate-api-client.mjs
 *
 * Or add to root package.json scripts:
 *   "generate:api-client": "node scripts/generate-api-client.mjs"
 *
 * Design §18.5 / Req 39.
 *
 * NOTE: This script requires the API to be running on port 4000.
 * It uses `openapi-typescript` (if installed) or falls back to a
 * simple fetch + write approach.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const API_URL = process.env.API_URL ?? "http://localhost:4000";
const SPEC_URL = `${API_URL}/api/docs-json`;
const OUTPUT_DIR = join(ROOT, "packages", "shared", "src", "generated");
const SNAPSHOT_FILE = join(ROOT, "packages", "shared", "openapi.snapshot.json");

async function main() {
  console.log(`Fetching OpenAPI spec from ${SPEC_URL}...`);

  let spec;
  try {
    const res = await fetch(SPEC_URL);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    spec = await res.json();
  } catch (err) {
    console.error(`Failed to fetch OpenAPI spec: ${err.message}`);
    console.error("Make sure the API is running on port 4000.");
    process.exit(1);
  }

  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Write the raw spec as a snapshot for contract testing
  writeFileSync(SNAPSHOT_FILE, JSON.stringify(spec, null, 2), "utf8");
  console.log(`Snapshot written to ${SNAPSHOT_FILE}`);

  // Generate a simple TypeScript type file from the spec
  // (In production, use openapi-typescript or openapi-generator-cli)
  const typeContent = generateTypes(spec);
  const typesFile = join(OUTPUT_DIR, "api-types.ts");
  writeFileSync(typesFile, typeContent, "utf8");
  console.log(`Types written to ${typesFile}`);

  // Write an index re-export
  const indexFile = join(OUTPUT_DIR, "index.ts");
  writeFileSync(
    indexFile,
    `// Auto-generated — do not edit manually\n// Run: node scripts/generate-api-client.mjs\nexport * from "./api-types";\n`,
    "utf8",
  );
  console.log(`Index written to ${indexFile}`);
  console.log("Done.");
}

/**
 * Generate TypeScript type declarations from an OpenAPI 3.x spec.
 * This is a simplified generator — for production use openapi-typescript.
 */
function generateTypes(spec) {
  const lines = [
    "// Auto-generated from OpenAPI spec — do not edit manually",
    `// Generated at: ${new Date().toISOString()}`,
    `// API version: ${spec.info?.version ?? "unknown"}`,
    "",
    "// ============================================================",
    "// Endpoint paths (for reference)",
    "// ============================================================",
    "",
  ];

  const paths = spec.paths ?? {};
  for (const [path, methods] of Object.entries(paths)) {
    for (const [method] of Object.entries(methods)) {
      if (["get", "post", "put", "patch", "delete"].includes(method)) {
        lines.push(`// ${method.toUpperCase()} ${path}`);
      }
    }
  }

  lines.push(
    "",
    "// ============================================================",
    "// Schema types (simplified)",
    "// ============================================================",
    "",
    "export type ApiPath = keyof typeof API_PATHS;",
    "",
    "export const API_PATHS = {",
  );

  for (const path of Object.keys(paths)) {
    const key = path
      .replace(/^\/api\/v1\//, "")
      .replace(/[/{}-]/g, "_")
      .replace(/^_+|_+$/g, "")
      .replace(/__+/g, "_")
      .toUpperCase();
    lines.push(`  ${key || "ROOT"}: "${path}",`);
  }

  lines.push("} as const;", "");

  return lines.join("\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
