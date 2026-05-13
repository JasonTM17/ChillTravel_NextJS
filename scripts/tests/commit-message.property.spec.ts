// Feature: wanderviet-pro-upgrade-plan, Property 4: Conventional Commit Message Validation
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

import { isValidCommitMessage, COMMIT_MESSAGE_REGEX } from './validators';

/** Number of iterations for property tests */
const PBT_NUM_RUNS = 100;

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/** Valid commit types */
const validTypeArb = fc.constantFrom(
  'feat', 'fix', 'docs', 'style', 'refactor',
  'perf', 'test', 'chore', 'ci', 'build', 'revert',
);

/** Valid scope (lowercase alphanumeric + hyphens) */
const validScopeArb = fc.string({
  unit: fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')),
  minLength: 1,
  maxLength: 20,
});

/** Valid subject (printable ASCII, 1-100 chars) */
const validSubjectArb = fc.string({
  unit: fc.integer({ min: 0x20, max: 0x7e }).map((n) => String.fromCharCode(n)),
  minLength: 1,
  maxLength: 100,
});

/** Generates a valid commit message */
const validCommitMessageArb = fc
  .tuple(
    validTypeArb,
    fc.option(validScopeArb, { nil: undefined }),
    fc.option(fc.constant('!'), { nil: undefined }),
    validSubjectArb,
  )
  .map(([type, scope, breaking, subject]) => {
    const scopePart = scope ? `(${scope})` : '';
    const breakingPart = breaking ?? '';
    return `${type}${scopePart}${breakingPart}: ${subject}`;
  });

/** Generates an invalid commit type */
const invalidTypeArb = fc
  .string({ minLength: 1, maxLength: 10 })
  .filter(
    (s) =>
      !['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'ci', 'build', 'revert'].includes(s),
  );

/** Generates a commit message with invalid type */
const invalidTypeCommitArb = fc
  .tuple(invalidTypeArb, validSubjectArb)
  .map(([type, subject]) => `${type}: ${subject}`);

/** Generates a commit message missing the colon-space separator */
const missingSeparatorArb = fc
  .tuple(validTypeArb, validSubjectArb)
  .map(([type, subject]) => `${type} ${subject}`);

/** Generates a commit message with subject > 100 chars */
const tooLongSubjectArb = fc
  .tuple(
    validTypeArb,
    fc.string({
      unit: fc.integer({ min: 0x20, max: 0x7e }).map((n) => String.fromCharCode(n)),
      minLength: 101,
      maxLength: 150,
    }),
  )
  .map(([type, subject]) => `${type}: ${subject}`);

// ─── Property Tests ──────────────────────────────────────────────────────────

/**
 * **Validates: Requirements 10.4**
 *
 * Property 4: Conventional Commit Message Validation
 *
 * For any commit message string, the validator SHALL accept it if and only if
 * it matches the regex ^(feat|fix|docs|style|refactor|perf|test|chore|ci|build|revert)(\([a-z0-9\-]+\))?!?: .{1,100}$
 */
describe('Property 4: Conventional Commit Message Validation', () => {
  it('accepts all validly-constructed commit messages', () => {
    fc.assert(
      fc.property(validCommitMessageArb, (message) => {
        expect(isValidCommitMessage(message)).toBe(true);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('validator result matches direct regex test for valid messages', () => {
    fc.assert(
      fc.property(validCommitMessageArb, (message) => {
        const validatorResult = isValidCommitMessage(message);
        const regexResult = COMMIT_MESSAGE_REGEX.test(message);
        expect(validatorResult).toBe(regexResult);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('rejects commit messages with invalid type prefix', () => {
    fc.assert(
      fc.property(invalidTypeCommitArb, (message) => {
        expect(isValidCommitMessage(message)).toBe(false);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('rejects commit messages missing colon-space separator', () => {
    fc.assert(
      fc.property(missingSeparatorArb, (message) => {
        expect(isValidCommitMessage(message)).toBe(false);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('rejects commit messages with subject longer than 100 characters', () => {
    fc.assert(
      fc.property(tooLongSubjectArb, (message) => {
        expect(isValidCommitMessage(message)).toBe(false);
      }),
      { numRuns: PBT_NUM_RUNS, seed: Date.now() },
    );
  });

  it('rejects empty strings', () => {
    expect(isValidCommitMessage('')).toBe(false);
  });

  it('rejects messages with uppercase scope', () => {
    expect(isValidCommitMessage('feat(API): add endpoint')).toBe(false);
  });

  it('accepts messages with breaking change indicator', () => {
    expect(isValidCommitMessage('feat(api)!: breaking change')).toBe(true);
  });
});
