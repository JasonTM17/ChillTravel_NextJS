import { execSync } from 'node:child_process';
import type { AuditMetric } from '../types.ts';

interface AuditCounts {
  critical: number;
  high: number;
  moderate: number;
  low: number;
  info: number;
  total: number;
}

function runSecurityAudit(rootDir: string): AuditCounts {
  try {
    // pnpm audit returns non-zero when vulnerabilities are found
    let result: string;
    try {
      result = execSync('pnpm audit --prod', {
        cwd: rootDir,
        encoding: 'utf-8',
        timeout: 60_000,
      });
    } catch (err: unknown) {
      // pnpm audit exits non-zero when vulnerabilities exist — capture stdout
      const execErr = err as { stdout?: string; stderr?: string };
      result = execErr.stdout ?? '';
    }

    const counts: AuditCounts = {
      critical: 0,
      high: 0,
      moderate: 0,
      low: 0,
      info: 0,
      total: 0,
    };

    // Parse severity counts from pnpm audit output
    const criticalMatch = result.match(/(\d+)\s+critical/i);
    const highMatch = result.match(/(\d+)\s+high/i);
    const moderateMatch = result.match(/(\d+)\s+moderate/i);
    const lowMatch = result.match(/(\d+)\s+low/i);
    const infoMatch = result.match(/(\d+)\s+info/i);

    const criticalVal = criticalMatch?.[1];
    const highVal = highMatch?.[1];
    const moderateVal = moderateMatch?.[1];
    const lowVal = lowMatch?.[1];
    const infoVal = infoMatch?.[1];

    if (criticalVal) counts.critical = parseInt(criticalVal, 10);
    if (highVal) counts.high = parseInt(highVal, 10);
    if (moderateVal) counts.moderate = parseInt(moderateVal, 10);
    if (lowVal) counts.low = parseInt(lowVal, 10);
    if (infoVal) counts.info = parseInt(infoVal, 10);

    counts.total = counts.critical + counts.high + counts.moderate + counts.low + counts.info;

    return counts;
  } catch {
    return { critical: -1, high: -1, moderate: -1, low: -1, info: -1, total: -1 };
  }
}

export function collectSecurityAudit(rootDir: string): AuditMetric[] {
  const counts = runSecurityAudit(rootDir);
  const failed = counts.total < 0;

  return [
    {
      name: 'Security vulnerabilities (critical)',
      currentValue: failed ? 'measurement failed' : counts.critical,
      target: '0',
      automated: true,
      command: 'pnpm audit --prod',
    },
    {
      name: 'Security vulnerabilities (high)',
      currentValue: failed ? 'measurement failed' : counts.high,
      target: '0',
      automated: true,
      command: 'pnpm audit --prod',
    },
    {
      name: 'Security vulnerabilities (moderate)',
      currentValue: failed ? 'measurement failed' : counts.moderate,
      target: '≤ 5',
      automated: true,
      command: 'pnpm audit --prod',
    },
  ];
}
