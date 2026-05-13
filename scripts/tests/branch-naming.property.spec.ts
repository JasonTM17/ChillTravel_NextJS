// Feature: wanderviet-pro-upgrade-plan, Property 5: Feature Branch Naming Validation
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

import { isValidBranchName, BRANCH_NAME_REGEX } from './validators';

/** Number of iterations for property tests */
const PBT_NUM_RUNS = 100;

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/** Valid branch type prefixes */
const validBranchTypeArb = fc.constantFrom(
  'feat', 'fix', 'docs', 'style', 'refactor',
  'perf', 'test', 'chore', 'ci', 'build',
);

/**
 * Valid branch name suffix: starts with [a-z0-9], followed by [a-z0-9-],
 * total length 3-61 characters.
 */
const validBranchSuffixArb = fc
  .tuple(
    fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')),
    fc.string({
      unit: fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')),
      minLength: 2,
      maxLength: 60,
    }),
  )
  .map(([first, rest]) => `${first}${rest}`);

/** Generates a valid branch name */
const validBranchNameArb = fc
  .tuple(validBranchTypeArb, validBranchSuffixArb)
  .map(([type, suffix]) => `${type}/${suffix}`);

/** Generates an invalid branch type prefix */
const invalidBranchTypeArb = fc
  .string({ minLength: 1, maxLength: 10 })
  .filter(
    (s) =>
      !['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'ci', 'build'].includes(s) &&
      /^[a-z]+$/.test(s),
  );

/** Generates a branch name with invalid type */
const invalidTypeBranchArb = fc
  .tuple(invalidBranchTypeArb, validBranchSuffixArb)
  .map(([type, suffix]) => `${type}/${suffix}`);

/** Generates a branch name with suffix starting with a hyphen (invalid) */
const hyphenStartBranchArb = fc
  .tuple(
    validBranchTypeArb,
    fc.string({
      unit: fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')),
      minLength: 2,
      maxLength: 60,
    }),
  )
  .map(([type, rest]) => `${type}/-${rest}`);

/** Generates a branch name with suffix too short (< 3 chars) */
const tooShortSuffixArb = fc
  .tuple(
    validBranchTypeArb,
    fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')),
  )
  .map(([type, char]) => `${type}/${char}`);

/** Generates a branch name with uppercase characters (invalid) */
const uppercaseBranchArb = fc
  .tuple(
    validBranchTypeArb,
    fc.string({
      unit: fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')),
      minLength: 3,
      maxLength: 20,
    }),
  )
  .map(([type, suffix]) => `${type}/${suffix}`);

// ─── Property Tests ──────────────────────────────────────────────────────────

/**
 * **Validates: Requirements 10.2**
 *
 * Property 5: Feature Branch Naming Validation
 *
 * For any branch name string, the validator SHALL accept it if and only if
 * it matches the regex ^(feat|fix|docs|style|refactor|perf|test|chore|ci|build)\/[a-z0-9][a-z0-9\-]{2,60}$
 */
describe('Property 5: Feature Branch Naming Validation', () => {
  it('accepts all validly-constructed branch names', () => {
    fc.assert(
      fc.property(validBranchNameArb, (name) => {
        expect(isValidBranchName(name)).toBe(true);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('validator result matches direct regex test for valid names', () => {
    fc.assert(
      fc.property(validBranchNameArb, (name) => {
        const validatorResult = isValidBranchName(name);
        const regexResult = BRANCH_NAME_REGEX.test(name);
        expect(validatorResult).toBe(regexResult);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('rejects branch names with invalid type prefix', () => {
    fc.assert(
      fc.property(invalidTypeBranchArb, (name) => {
        expect(isValidBranchName(name)).toBe(false);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('rejects branch names starting with a hyphen after slash', () => {
    fc.assert(
      fc.property(hyphenStartBranchArb, (name) => {
        expect(isValidBranchName(name)).toBe(false);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('rejects branch names with suffix shorter than 3 characters', () => {
    fc.assert(
      fc.property(tooShortSuffixArb, (name) => {
        expect(isValidBranchName(name)).toBe(false);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('rejects branch names with uppercase characters', () => {
    fc.assert(
      fc.property(uppercaseBranchArb, (name) => {
        expect(isValidBranchName(name)).toBe(false);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('rejects branch names without a slash separator', () => {
    expect(isValidBranchName('feat-add-feature')).toBe(false);
  });

  it('rejects the "revert" type (not allowed for branches)', () => {
    expect(isValidBranchName('revert/some-change')).toBe(false);
  });

  it('accepts minimum valid branch name (3-char suffix)', () => {
    expect(isValidBranchName('fix/abc')).toBe(true);
  });
});
