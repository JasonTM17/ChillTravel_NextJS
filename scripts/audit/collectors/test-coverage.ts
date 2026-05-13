import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { AuditMetric } from '../types.ts';

const WORKSPACES = [
  { name: 'apps/api', filter: '@vietwander/api', target: '≥ 70% (core modules)' },
  { name: 'apps/web', filter: '@vietwander/web', target: '≥ 50% (lib + hooks)' },
  { name: 'packages/shared', filter: '@vietwander/shared', target: '≥ 60%' },
  { name: 'packages/db', filter: '@vietwander/db', target: '≥ 50%' },
];

interface CoverageSummary {
  total?: {
    lines?: { pct: number };
    statements?: { pct: number };
    branches?: { pct: number };
    functions?: { pct: number };
  };
}

function getCoverage(
  rootDir: string,
  workspace: { name: string; filter: string },
): number | string {
  try {
    // Try to run tests with coverage
    try {
      execSync(`pnpm --filter ${workspace.filter} test -- --coverage --reporter=json`, {
        cwd: rootDir,
        encoding: 'utf-8',
        timeout: 180_000,
        stdio: 'pipe',
      });
    } catch {
      // Tests may fail but still produce coverage — continue to check for report
    }

    // Look for coverage summary JSON
    const coveragePath = resolve(rootDir, workspace.name, 'coverage', 'coverage-summary.json');
    if (existsSync(coveragePath)) {
      const content = readFileSync(coveragePath, 'utf-8');
      const summary = JSON.parse(content) as CoverageSummary;
      return summary.total?.lines?.pct ?? 'no line coverage data';
    }

    return 'no coverage report generated';
  } catch {
    return 'measurement failed (test run error)';
  }
}

export function collectTestCoverage(rootDir: string): AuditMetric[] {
  const metrics: AuditMetric[] = [];

  for (const workspace of WORKSPACES) {
    const coverage = getCoverage(rootDir, workspace);

    metrics.push({
      name: `Test coverage (${workspace.name})`,
      currentValue: typeof coverage === 'number' ? `${coverage}%` : coverage,
      target: workspace.target,
      automated: true,
      command: `pnpm --filter ${workspace.filter} test -- --coverage`,
    });
  }

  return metrics;
}
