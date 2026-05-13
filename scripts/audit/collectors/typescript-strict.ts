import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { AuditMetric } from '../types.ts';

interface TsconfigCompilerOptions {
  strict?: boolean;
  noUncheckedIndexedAccess?: boolean;
}

interface TsconfigJson {
  compilerOptions?: TsconfigCompilerOptions;
}

const WORKSPACES = [
  { name: 'apps/api', path: 'apps/api/tsconfig.json' },
  { name: 'apps/web', path: 'apps/web/tsconfig.json' },
  { name: 'packages/shared', path: 'packages/shared/tsconfig.json' },
  { name: 'packages/db', path: 'packages/db/tsconfig.json' },
  { name: 'packages/config', path: 'packages/config/tsconfig.json' },
];

function checkStrictMode(
  rootDir: string,
  tsconfigPath: string,
): { strict: boolean; noUncheckedIndexedAccess: boolean } {
  const fullPath = resolve(rootDir, tsconfigPath);
  if (!existsSync(fullPath)) {
    return { strict: false, noUncheckedIndexedAccess: false };
  }

  try {
    const content = readFileSync(fullPath, 'utf-8');
    // Strip comments for JSON parsing (simple approach for single-line comments)
    const stripped = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    const tsconfig = JSON.parse(stripped) as TsconfigJson;
    const opts = tsconfig.compilerOptions ?? {};
    return {
      strict: opts.strict === true,
      noUncheckedIndexedAccess: opts.noUncheckedIndexedAccess === true,
    };
  } catch {
    return { strict: false, noUncheckedIndexedAccess: false };
  }
}

export function collectTypescriptStrict(rootDir: string): AuditMetric[] {
  const metrics: AuditMetric[] = [];

  for (const workspace of WORKSPACES) {
    const result = checkStrictMode(rootDir, workspace.path);
    const status =
      result.strict && result.noUncheckedIndexedAccess
        ? 'strict + noUncheckedIndexedAccess'
        : result.strict
          ? 'strict only'
          : 'not strict';

    metrics.push({
      name: `TypeScript strict mode (${workspace.name})`,
      currentValue: status,
      target: 'strict + noUncheckedIndexedAccess',
      automated: true,
      command: `cat ${workspace.path} | grep -E "strict|noUncheckedIndexedAccess"`,
    });
  }

  return metrics;
}
