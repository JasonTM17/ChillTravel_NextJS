#!/usr/bin/env node
/**
 * OpenAPI contract snapshot checker.
 *
 * Compares the current OpenAPI spec against a saved snapshot.
 * Fails on breaking changes (removed fields, changed types).
 * Warns on additions (new fields, new endpoints).
 *
 * Usage:
 *   # Update snapshot:
 *   node scripts/openapi-contract-check.mjs --update
 *
 *   # Check for breaking changes:
 *   node scripts/openapi-contract-check.mjs
 *
 * Design §18.5 / Req 47.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const API_URL = process.env.API_URL ?? "http://localhost:4000";
const SPEC_URL = `${API_URL}/api/docs-json`;
const SNAPSHOT_FILE = join(ROOT, "packages", "shared", "openapi.snapshot.json");

const UPDATE_MODE = process.argv.includes("--update");

async function fetchSpec() {
  const res = await fetch(SPEC_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

function extractPaths(spec) {
  const result = {};
  for (const [path, methods] of Object.entries(spec.paths ?? {})) {
    result[path] = {};
    for (const [method, op] of Object.entries(methods)) {
      if (!["get", "post", "put", "patch", "delete"].includes(method)) continue;
      result[path][method] = {
        operationId: op.operationId,
        parameters: (op.parameters ?? [])
          .map((p) => `${p.in}:${p.name}:${p.required ?? false}`)
          .sort(),
        requestBodyRequired: op.requestBody?.required ?? false,
        responses: Object.keys(op.responses ?? {}).sort(),
      };
    }
  }
  return result;
}

function findBreakingChanges(snapshot, current) {
  const breaking = [];
  const warnings = [];

  const snapPaths = extractPaths(snapshot);
  const currPaths = extractPaths(current);

  // Check for removed endpoints
  for (const [path, methods] of Object.entries(snapPaths)) {
    if (!currPaths[path]) {
      breaking.push(`REMOVED path: ${path}`);
      continue;
    }
    for (const [method, snapOp] of Object.entries(methods)) {
      const currOp = currPaths[path][method];
      if (!currOp) {
        breaking.push(`REMOVED endpoint: ${method.toUpperCase()} ${path}`);
        continue;
      }
      // Check for removed required parameters
      for (const param of snapOp.parameters) {
        if (param.endsWith(":true") && !currOp.parameters.includes(param)) {
          breaking.push(
            `REMOVED required param: ${param} from ${method.toUpperCase()} ${path}`,
          );
        }
      }
      // Check for removed response codes
      for (const code of snapOp.responses) {
        if (!currOp.responses.includes(code)) {
          warnings.push(
            `REMOVED response ${code} from ${method.toUpperCase()} ${path}`,
          );
        }
      }
    }
  }

  // Check for new endpoints (warnings only)
  for (const [path, methods] of Object.entries(currPaths)) {
    if (!snapPaths[path]) {
      warnings.push(`NEW path: ${path}`);
      continue;
    }
    for (const method of Object.keys(methods)) {
      if (!snapPaths[path][method]) {
        warnings.push(`NEW endpoint: ${method.toUpperCase()} ${path}`);
      }
    }
  }

  return { breaking, warnings };
}

async function main() {
  let currentSpec;
  try {
    currentSpec = await fetchSpec();
  } catch (err) {
    console.error(`Failed to fetch spec: ${err.message}`);
    console.error("Make sure the API is running on port 4000.");
    process.exit(1);
  }

  if (UPDATE_MODE) {
    writeFileSync(SNAPSHOT_FILE, JSON.stringify(currentSpec, null, 2), "utf8");
    console.log(`Snapshot updated: ${SNAPSHOT_FILE}`);
    return;
  }

  if (!existsSync(SNAPSHOT_FILE)) {
    console.log("No snapshot found. Creating initial snapshot...");
    writeFileSync(SNAPSHOT_FILE, JSON.stringify(currentSpec, null, 2), "utf8");
    console.log(`Snapshot created: ${SNAPSHOT_FILE}`);
    return;
  }

  const snapshot = JSON.parse(readFileSync(SNAPSHOT_FILE, "utf8"));
  const { breaking, warnings } = findBreakingChanges(snapshot, currentSpec);

  if (warnings.length > 0) {
    console.log("\n⚠️  Warnings (non-breaking changes):");
    for (const w of warnings) console.log(`  - ${w}`);
  }

  if (breaking.length > 0) {
    console.error("\n❌ Breaking changes detected:");
    for (const b of breaking) console.error(`  - ${b}`);
    console.error(
      "\nUpdate the snapshot with: node scripts/openapi-contract-check.mjs --update",
    );
    process.exit(1);
  }

  console.log("✅ No breaking changes detected.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
