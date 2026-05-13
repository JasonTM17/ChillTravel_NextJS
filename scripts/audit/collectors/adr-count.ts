import { readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { AuditMetric } from '../types.ts';

export function collectAdrCount(rootDir: string): AuditMetric[] {
  const adrDir = resolve(rootDir, 'docs/adr');

  if (!existsSync(adrDir)) {
    return [
      {
        name: 'ADR count',
        currentValue: '0 (directory not found)',
        target: '≥ 8 ADRs (4 existing + 4 new)',
        automated: true,
        command: 'ls docs/adr/*.md | wc -l',
      },
    ];
  }

  const files = readdirSync(adrDir).filter((f) => f.endsWith('.md'));

  return [
    {
      name: 'ADR count',
      currentValue: files.length,
      target: '≥ 8 ADRs (4 existing + 4 new)',
      automated: true,
      command: 'ls docs/adr/*.md | wc -l',
    },
  ];
}
