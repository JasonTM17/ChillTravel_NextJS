import { execSync } from 'node:child_process';
import { readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import type { AuditMetric } from '../types.ts';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

function getDirectorySize(dirPath: string): number {
  if (!existsSync(dirPath)) return 0;

  let totalSize = 0;
  const entries = readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      totalSize += getDirectorySize(fullPath);
    } else if (entry.isFile()) {
      totalSize += statSync(fullPath).size;
    }
  }

  return totalSize;
}

function getFileSizeByExtension(dirPath: string, extensions: string[]): number {
  if (!existsSync(dirPath)) return 0;

  let totalSize = 0;
  const entries = readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      totalSize += getFileSizeByExtension(fullPath, extensions);
    } else if (entry.isFile() && extensions.some((ext) => entry.name.endsWith(ext))) {
      totalSize += statSync(fullPath).size;
    }
  }

  return totalSize;
}

export function collectBundleSize(rootDir: string): AuditMetric[] {
  const metrics: AuditMetric[] = [];
  const webBuildDir = resolve(rootDir, 'apps/web/.next');
  const webStaticDir = resolve(rootDir, 'apps/web/.next/static');

  // Try to build web if .next doesn't exist
  if (!existsSync(webBuildDir)) {
    try {
      execSync('pnpm --filter @vietwander/web build', {
        cwd: rootDir,
        encoding: 'utf-8',
        timeout: 300_000,
        stdio: 'pipe',
      });
    } catch {
      metrics.push({
        name: 'Web bundle size (JS)',
        currentValue: 'build failed — cannot measure',
        target: '< 300 KB (first load JS)',
        automated: false,
        command: 'pnpm --filter @vietwander/web build',
        manualProcedure:
          'Run `pnpm --filter @vietwander/web build` then check `.next/static` directory sizes',
      });
      metrics.push({
        name: 'Web bundle size (CSS)',
        currentValue: 'build failed — cannot measure',
        target: '< 100 KB',
        automated: false,
        command: 'pnpm --filter @vietwander/web build',
        manualProcedure:
          'Run `pnpm --filter @vietwander/web build` then check `.next/static/css` directory size',
      });
      return metrics;
    }
  }

  const jsSize = getFileSizeByExtension(webStaticDir, ['.js']);
  const cssSize = getFileSizeByExtension(webStaticDir, ['.css']);

  metrics.push({
    name: 'Web bundle size (JS)',
    currentValue: formatBytes(jsSize),
    target: '< 300 KB (first load JS)',
    automated: true,
    command: 'pnpm --filter @vietwander/web build && du -sh apps/web/.next/static/chunks/',
  });

  metrics.push({
    name: 'Web bundle size (CSS)',
    currentValue: formatBytes(cssSize),
    target: '< 100 KB',
    automated: true,
    command: 'pnpm --filter @vietwander/web build && du -sh apps/web/.next/static/css/',
  });

  return metrics;
}
