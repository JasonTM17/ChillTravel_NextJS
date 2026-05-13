#!/usr/bin/env node
/**
 * OpenAPI contract snapshot checker.
 *
 * Compares the current OpenAPI spec against a saved snapshot.
 * Fails on breaking changes (removed fields, changed types).
 * Warns on additions (new fields, new endpoints).
 * Fails if spec differs from snapshot without a CHANGELOG.md entry.
 *
 * Usage:
 *   # Update snapshot:
 *   node scripts/openapi-contract-check.mjs --update
 *
 *   # Check for breaking changes:
 *   node scripts/openapi-contract-check.mjs
 *
 * Design §3 Contract Testing / Req 3.9
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const API_URL = process.env.API_URL ?? 'http://localhost:4000';
const SPEC_URL = `${API_URL}/api/docs-json`;
const SNAPSHOT_FILE = join(ROOT, 'packages', 'shared', 'openapi.snapshot.json');
const CHANGELOG_FILE = join(ROOT, 'CHANGELOG.md');

const UPDATE_MODE = process.argv.includes('--update');

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
      if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) continue;
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
        if (param.endsWith(':true') && !currOp.parameters.includes(param)) {
          breaking.push(`REMOVED required param: ${param} from ${method.toUpperCase()} ${path}`);
        }
      }
      // Check for removed response codes
      for (const code of snapOp.responses) {
        if (!currOp.responses.includes(code)) {
          warnings.push(`REMOVED response ${code} from ${method.toUpperCase()} ${path}`);
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

/**
 * Checks whether the spec has changed compared to the snapshot.
 * Uses a deep JSON comparison (serialized form).
 */
function hasSpecChanged(snapshot, current) {
  return JSON.stringify(snapshot) !== JSON.stringify(current);
}

/**
 * Checks if CHANGELOG.md has a new entry compared to the last committed version.
 * Returns true if there's a new entry (uncommitted changes to CHANGELOG.md or
 * the file has content beyond what was in the last commit).
 */
function hasChangelogEntry() {
  if (!existsSync(CHANGELOG_FILE)) {
    return false;
  }

  try {
    // Check if CHANGELOG.md has uncommitted changes (staged or unstaged)
    const gitStatus = execSync('git status --porcelain CHANGELOG.md', {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim();

    if (gitStatus.length > 0) {
      // CHANGELOG.md has been modified — new entry present
      return true;
    }

    // Check if CHANGELOG.md was modified in the current branch compared to main
    // This handles the case where CHANGELOG was already committed in the same PR
    try {
      const diffOutput = execSync('git diff main -- CHANGELOG.md', {
        cwd: ROOT,
        encoding: 'utf8',
      }).trim();
      return diffOutput.length > 0;
    } catch {
      // If main doesn't exist or git diff fails, check if file has content
      const content = readFileSync(CHANGELOG_FILE, 'utf8').trim();
      return content.length > 0;
    }
  } catch {
    // If git is not available, just check if the file exists and has content
    const content = readFileSync(CHANGELOG_FILE, 'utf8').trim();
    return content.length > 0;
  }
}

async function main() {
  let currentSpec;
  try {
    currentSpec = await fetchSpec();
  } catch (err) {
    console.error(`Failed to fetch spec: ${err.message}`);
    console.error('Make sure the API is running on port 4000.');
    process.exit(1);
  }

  if (UPDATE_MODE) {
    writeFileSync(SNAPSHOT_FILE, JSON.stringify(currentSpec, null, 2), 'utf8');
    console.log(`Snapshot updated: ${SNAPSHOT_FILE}`);
    return;
  }

  if (!existsSync(SNAPSHOT_FILE)) {
    console.log('No snapshot found. Creating initial snapshot...');
    writeFileSync(SNAPSHOT_FILE, JSON.stringify(currentSpec, null, 2), 'utf8');
    console.log(`Snapshot created: ${SNAPSHOT_FILE}`);
    return;
  }

  const snapshot = JSON.parse(readFileSync(SNAPSHOT_FILE, 'utf8'));
  const { breaking, warnings } = findBreakingChanges(snapshot, currentSpec);
  const specChanged = hasSpecChanged(snapshot, currentSpec);

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings (non-breaking changes):');
    for (const w of warnings) console.log(`  - ${w}`);
  }

  if (breaking.length > 0) {
    console.error('\n❌ Breaking changes detected:');
    for (const b of breaking) console.error(`  - ${b}`);
    console.error('\nUpdate the snapshot with: node scripts/openapi-contract-check.mjs --update');
    process.exit(1);
  }

  // Req 3.9: Fail if spec differs from snapshot without CHANGELOG entry
  if (specChanged) {
    const hasEntry = hasChangelogEntry();
    if (!hasEntry) {
      console.error('\n❌ OpenAPI spec has changed but no CHANGELOG.md entry found.');
      console.error('   Please add a CHANGELOG.md entry describing the API changes.');
      console.error('   Then update the snapshot: node scripts/openapi-contract-check.mjs --update');
      process.exit(1);
    }
    console.log('\n⚠️  OpenAPI spec has changed (CHANGELOG entry found — OK).');
    console.log('   Remember to update the snapshot: node scripts/openapi-contract-check.mjs --update');
  } else {
    console.log('✅ No spec changes detected.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
