/**
 * Git Workflow Validators
 *
 * Pure validation functions for commit messages, branch names,
 * and forbidden file pattern detection.
 * Used by pre-commit hooks and CI quality gates.
 */

// ─── Commit Message Validation ───────────────────────────────────────────────

/**
 * Regex for Conventional Commits format.
 * Format: <type>(<scope>)?!?: <subject (1-100 chars)>
 *
 * Validates: Requirements 10.4
 */
export const COMMIT_MESSAGE_REGEX =
  /^(feat|fix|docs|style|refactor|perf|test|chore|ci|build|revert)(\([a-z0-9\-]+\))?!?: .{1,100}$/;

/**
 * Validates a commit message against Conventional Commits format.
 * Returns true if the message is valid.
 */
export function isValidCommitMessage(message: string): boolean {
  return COMMIT_MESSAGE_REGEX.test(message);
}

// ─── Branch Name Validation ──────────────────────────────────────────────────

/**
 * Regex for feature branch naming convention.
 * Format: <type>/<kebab-case-name (3-61 chars, starts with lowercase letter or digit)>
 *
 * Validates: Requirements 10.2
 */
export const BRANCH_NAME_REGEX =
  /^(feat|fix|docs|style|refactor|perf|test|chore|ci|build)\/[a-z0-9][a-z0-9\-]{2,60}$/;

/**
 * Validates a branch name against the naming convention.
 * Returns true if the branch name is valid.
 */
export function isValidBranchName(name: string): boolean {
  return BRANCH_NAME_REGEX.test(name);
}

// ─── Forbidden File Pattern Detection ────────────────────────────────────────

/**
 * Forbidden file patterns that must never be committed.
 * These patterns use minimatch/glob-style matching.
 *
 * Validates: Requirements 10.8
 */
export const FORBIDDEN_PATTERNS = [
  '**/.env',
  '**/.env.*',
  '**/node_modules/**',
  '**/dist/**',
  '**/.next/**',
  '**/coverage/**',
  '**/*.key',
  '**/*.pem',
] as const;

/**
 * Checks if a file path matches any forbidden pattern.
 * Uses simplified glob matching (no external dependency).
 * Returns true if the file is forbidden (should be rejected).
 */
export function isForbiddenFile(filePath: string): boolean {
  // Normalize path separators to forward slashes
  const normalized = filePath.replace(/\\/g, '/');

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (matchesGlobPattern(normalized, pattern)) {
      return true;
    }
  }
  return false;
}

/**
 * Simple glob pattern matcher supporting:
 * - ** (matches any number of path segments)
 * - * (matches any characters within a single segment)
 * - Literal matching
 */
function matchesGlobPattern(filePath: string, pattern: string): boolean {
  // Handle **/.env pattern (file named .env at any depth)
  if (pattern === '**/.env') {
    return filePath === '.env' || filePath.endsWith('/.env');
  }

  // Handle **/.env.* pattern (file named .env.something at any depth)
  if (pattern === '**/.env.*') {
    const segments = filePath.split('/');
    const fileName = segments[segments.length - 1]!;
    return /^\.env\..+$/.test(fileName);
  }

  // Handle **/dir/** pattern (any file inside a specific directory at any depth)
  const dirMatch = pattern.match(/^\*\*\/(.+)\/\*\*$/);
  if (dirMatch) {
    const dirName = dirMatch[1]!;
    return (
      filePath.startsWith(`${dirName}/`) ||
      filePath.includes(`/${dirName}/`)
    );
  }

  // Handle **/*.ext pattern (file with specific extension at any depth)
  const extMatch = pattern.match(/^\*\*\/\*(\..+)$/);
  if (extMatch) {
    const ext = extMatch[1]!;
    return filePath.endsWith(ext);
  }

  return false;
}
