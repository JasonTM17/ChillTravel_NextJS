// Feature: wanderviet-pro-upgrade-plan, Property 6: Forbidden File Pattern Detection
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

import { isForbiddenFile, FORBIDDEN_PATTERNS } from './validators';

/** Number of iterations for property tests */
const PBT_NUM_RUNS = 100;

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/** Generates a valid directory path segment (lowercase, no special chars) */
const pathSegmentArb = fc.string({
  unit: fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-_'.split('')),
  minLength: 1,
  maxLength: 15,
});

/** Generates a directory prefix (0-3 segments) */
const dirPrefixArb = fc
  .array(pathSegmentArb, { minLength: 0, maxLength: 3 })
  .map((segments) => (segments.length > 0 ? segments.join('/') + '/' : ''));

/** Generates a .env file path at any depth */
const envFileArb = dirPrefixArb.map((prefix) => `${prefix}.env`);

/** Generates a .env.* file path at any depth */
const envDotFileArb = fc
  .tuple(dirPrefixArb, pathSegmentArb)
  .map(([prefix, suffix]) => `${prefix}.env.${suffix}`);

/** Generates a file path inside node_modules at any depth */
const nodeModulesFileArb = fc
  .tuple(dirPrefixArb, pathSegmentArb, pathSegmentArb)
  .map(([prefix, pkg, file]) => `${prefix}node_modules/${pkg}/${file}.js`);

/** Generates a file path inside dist at any depth */
const distFileArb = fc
  .tuple(dirPrefixArb, pathSegmentArb)
  .map(([prefix, file]) => `${prefix}dist/${file}.js`);

/** Generates a file path inside .next at any depth */
const nextFileArb = fc
  .tuple(dirPrefixArb, pathSegmentArb)
  .map(([prefix, file]) => `${prefix}.next/${file}.js`);

/** Generates a file path inside coverage at any depth */
const coverageFileArb = fc
  .tuple(dirPrefixArb, pathSegmentArb)
  .map(([prefix, file]) => `${prefix}coverage/${file}.json`);

/** Generates a .key file path at any depth */
const keyFileArb = fc
  .tuple(dirPrefixArb, pathSegmentArb)
  .map(([prefix, name]) => `${prefix}${name}.key`);

/** Generates a .pem file path at any depth */
const pemFileArb = fc
  .tuple(dirPrefixArb, pathSegmentArb)
  .map(([prefix, name]) => `${prefix}${name}.pem`);

/** Generates any forbidden file path */
const forbiddenFileArb = fc.oneof(
  envFileArb,
  envDotFileArb,
  nodeModulesFileArb,
  distFileArb,
  nextFileArb,
  coverageFileArb,
  keyFileArb,
  pemFileArb,
);

/** Generates a safe file extension (not .key or .pem) */
const safeExtensionArb = fc.constantFrom('.ts', '.js', '.json', '.md', '.css', '.html', '.tsx');

/** Generates a safe file path that should NOT be forbidden */
const safeFileArb = fc
  .tuple(
    fc.array(pathSegmentArb, { minLength: 1, maxLength: 3 }),
    pathSegmentArb,
    safeExtensionArb,
  )
  .filter(([dirs]) => {
    const path = dirs.join('/');
    // Ensure the path doesn't accidentally contain forbidden directory names
    return (
      !path.includes('node_modules') &&
      !path.includes('dist') &&
      !path.includes('.next') &&
      !path.includes('coverage')
    );
  })
  .filter(([, fileName]) => {
    // Ensure filename doesn't start with .env
    return !fileName.startsWith('.env') && !fileName.startsWith('env');
  })
  .map(([dirs, fileName, ext]) => `${dirs.join('/')}/${fileName}${ext}`);

// ─── Property Tests ──────────────────────────────────────────────────────────

/**
 * **Validates: Requirements 10.8**
 *
 * Property 6: Forbidden File Pattern Detection
 *
 * For any file path matching one of the forbidden patterns, the pre-commit
 * hook SHALL reject the commit containing that file.
 */
describe('Property 6: Forbidden File Pattern Detection', () => {
  it('detects all .env files as forbidden regardless of depth', () => {
    fc.assert(
      fc.property(envFileArb, (filePath) => {
        expect(isForbiddenFile(filePath)).toBe(true);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('detects all .env.* files as forbidden regardless of depth', () => {
    fc.assert(
      fc.property(envDotFileArb, (filePath) => {
        expect(isForbiddenFile(filePath)).toBe(true);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('detects all files inside node_modules as forbidden', () => {
    fc.assert(
      fc.property(nodeModulesFileArb, (filePath) => {
        expect(isForbiddenFile(filePath)).toBe(true);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('detects all files inside dist as forbidden', () => {
    fc.assert(
      fc.property(distFileArb, (filePath) => {
        expect(isForbiddenFile(filePath)).toBe(true);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('detects all files inside .next as forbidden', () => {
    fc.assert(
      fc.property(nextFileArb, (filePath) => {
        expect(isForbiddenFile(filePath)).toBe(true);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('detects all files inside coverage as forbidden', () => {
    fc.assert(
      fc.property(coverageFileArb, (filePath) => {
        expect(isForbiddenFile(filePath)).toBe(true);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('detects all .key files as forbidden regardless of depth', () => {
    fc.assert(
      fc.property(keyFileArb, (filePath) => {
        expect(isForbiddenFile(filePath)).toBe(true);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('detects all .pem files as forbidden regardless of depth', () => {
    fc.assert(
      fc.property(pemFileArb, (filePath) => {
        expect(isForbiddenFile(filePath)).toBe(true);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('detects any generated forbidden file path as forbidden', () => {
    fc.assert(
      fc.property(forbiddenFileArb, (filePath) => {
        expect(isForbiddenFile(filePath)).toBe(true);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('allows safe file paths that do not match any forbidden pattern', () => {
    fc.assert(
      fc.property(safeFileArb, (filePath) => {
        expect(isForbiddenFile(filePath)).toBe(false);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('handles Windows-style backslash paths correctly', () => {
    expect(isForbiddenFile('src\\config\\.env')).toBe(true);
    expect(isForbiddenFile('apps\\api\\dist\\main.js')).toBe(true);
    expect(isForbiddenFile('certs\\server.pem')).toBe(true);
  });

  it('correctly identifies root-level forbidden files', () => {
    expect(isForbiddenFile('.env')).toBe(true);
    expect(isForbiddenFile('.env.local')).toBe(true);
    expect(isForbiddenFile('.env.production')).toBe(true);
  });
});
