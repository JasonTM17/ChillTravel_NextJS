import { execSync } from 'node:child_process';
import type { AuditMetric } from '../types.ts';

interface OutdatedInfo {
  outdatedCount: number;
  totalDeps: number;
  details: string;
}

function getOutdatedDeps(rootDir: string): OutdatedInfo {
  try {
    // pnpm outdated returns non-zero exit code when there are outdated deps
    let result: string;
    try {
      result = execSync('pnpm outdated --recursive', {
        cwd: rootDir,
        encoding: 'utf-8',
        timeout: 60_000,
      });
    } catch (err: unknown) {
      // pnpm outdated exits with code 1 when outdated deps exist — capture stdout
      const execErr = err as { stdout?: string; stderr?: string };
      result = execErr.stdout ?? '';
    }

    // Count lines that look like package entries (contain version-like patterns)
    const lines = result
      .split('\n')
      .filter((line) => line.match(/\d+\.\d+\.\d+/) && !line.startsWith('Package'));

    return {
      outdatedCount: lines.length,
      totalDeps: lines.length, // approximate — total outdated
      details:
        lines.length > 0 ? `${lines.length} outdated packages found` : 'all packages up to date',
    };
  } catch {
    return {
      outdatedCount: -1,
      totalDeps: -1,
      details: 'measurement failed',
    };
  }
}

export function collectDependencyFreshness(rootDir: string): AuditMetric[] {
  const info = getOutdatedDeps(rootDir);

  return [
    {
      name: 'Outdated dependencies (monorepo-wide)',
      currentValue:
        info.outdatedCount >= 0 ? `${info.outdatedCount} outdated packages` : info.details,
      target: '0 outdated packages with high/critical severity',
      automated: true,
      command: 'pnpm outdated --recursive',
    },
  ];
}
