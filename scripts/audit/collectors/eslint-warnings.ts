import { execSync } from 'node:child_process';
import type { AuditMetric } from '../types.ts';

const WORKSPACES = [
  { name: 'apps/api', filter: '@vietwander/api' },
  { name: 'apps/web', filter: '@vietwander/web' },
  { name: 'packages/shared', filter: '@vietwander/shared' },
  { name: 'packages/db', filter: '@vietwander/db' },
  { name: 'packages/config', filter: '@vietwander/config' },
];

function countEslintWarnings(rootDir: string, filter: string): number {
  try {
    let result: string;
    try {
      result = execSync(`pnpm --filter ${filter} lint -- --format json`, {
        cwd: rootDir,
        encoding: 'utf-8',
        timeout: 120_000,
      });
    } catch (err: unknown) {
      // ESLint exits non-zero when there are errors — capture stdout
      const execErr = err as { stdout?: string; stderr?: string };
      result = execErr.stdout ?? '';
    }

    // Try to parse ESLint JSON output
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const eslintResults = JSON.parse(jsonMatch[0]) as Array<{ warningCount: number }>;
        return eslintResults.reduce((sum, file) => sum + file.warningCount, 0);
      }
    } catch {
      // If JSON parsing fails, count warning lines from text output
      const warningLines = result.split('\n').filter((line) => line.includes('warning'));
      return warningLines.length;
    }

    return 0;
  } catch {
    return -1; // indicates measurement failure
  }
}

export function collectEslintWarnings(rootDir: string): AuditMetric[] {
  const metrics: AuditMetric[] = [];
  let totalWarnings = 0;

  for (const workspace of WORKSPACES) {
    const count = countEslintWarnings(rootDir, workspace.filter);
    if (count >= 0) {
      totalWarnings += count;
    }

    metrics.push({
      name: `ESLint warnings (${workspace.name})`,
      currentValue: count >= 0 ? count : 'measurement failed',
      target: 'reduce by 50% from baseline',
      automated: true,
      command: `pnpm --filter ${workspace.filter} lint`,
    });
  }

  metrics.push({
    name: 'ESLint warnings (total)',
    currentValue: totalWarnings,
    target: 'reduce by 50% from baseline',
    automated: true,
    command: 'pnpm lint',
  });

  return metrics;
}
