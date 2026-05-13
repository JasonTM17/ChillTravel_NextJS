/**
 * Dead Code Collector
 *
 * Uses ts-prune to scan TypeScript workspaces for unused exports.
 * Generates docs/audit/dead-code-report.md with findings and suggested removal commands.
 */

import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

interface DeadCodeEntry {
  file: string;
  line: number;
  exportName: string;
  workspace: string;
}

const WORKSPACES = [
  { name: 'apps/api', tsconfig: 'apps/api/tsconfig.json' },
  { name: 'apps/web', tsconfig: 'apps/web/tsconfig.json' },
  { name: 'packages/shared', tsconfig: 'packages/shared/tsconfig.json' },
  { name: 'packages/config', tsconfig: 'packages/config/tsconfig.json' },
];

/**
 * Patterns to exclude from dead code report (false positives):
 * - `(used in module)` — ts-prune marks these as used internally
 * - `.next/` — Next.js generated files
 * - `node_modules/` — third-party code
 * - `.d.ts` generated files from Prisma
 * - `default` exports from Next.js page/layout/route files
 */
const EXCLUDE_PATTERNS = [
  /\(used in module\)/,
  /\.next[/\\]/,
  /node_modules[/\\]/,
  /generated[/\\]/,
  /dist[/\\]/,
];

const NEXTJS_PAGE_PATTERNS = [
  /app[/\\].*page\.tsx/,
  /app[/\\].*layout\.tsx/,
  /app[/\\].*route\.ts/,
  /app[/\\].*not-found\.tsx/,
  /app[/\\].*error\.tsx/,
  /app[/\\].*loading\.tsx/,
];

/**
 * Config files whose default exports are consumed by their respective tools
 * (Next.js, Tailwind, PostCSS, etc.)
 */
const TOOL_CONFIG_FILES = [
  /next\.config\.(ts|js|mjs)/,
  /tailwind\.config\.(ts|js)/,
  /postcss\.config\.(ts|js)/,
  /vitest\.config\.(ts|js)/,
  /playwright\.config\.(ts|js)/,
];

function runTsPrune(tsconfig: string): string {
  try {
    const result = execSync(`npx ts-prune --project ${tsconfig}`, {
      encoding: 'utf-8',
      cwd: process.cwd(),
      timeout: 60000,
    });
    return result;
  } catch (error: unknown) {
    const err = error as { stdout?: string };
    // ts-prune may exit with non-zero but still produce output
    if (err.stdout) return err.stdout;
    return '';
  }
}

function parseTsPruneOutput(output: string, workspace: string): DeadCodeEntry[] {
  const entries: DeadCodeEntry[] = [];
  const lines = output.split('\n').filter(Boolean);

  for (const line of lines) {
    // Skip lines matching exclude patterns
    if (EXCLUDE_PATTERNS.some((p) => p.test(line))) continue;

    // Parse format: \path\to\file.ts:LINE - ExportName
    const match = line.match(/^(.+):(\d+)\s+-\s+(.+)$/);
    if (!match) continue;

    const [, filePath, lineNum, exportName] = match;
    const normalizedPath = filePath.replace(/\\/g, '/').replace(/^\//, '');

    // Skip Next.js page default exports (they are consumed by the framework)
    if (
      exportName.trim() === 'default' &&
      NEXTJS_PAGE_PATTERNS.some((p) => p.test(normalizedPath))
    ) {
      continue;
    }

    // Skip tool config file default exports (consumed by their respective tools)
    if (exportName.trim() === 'default' && TOOL_CONFIG_FILES.some((p) => p.test(normalizedPath))) {
      continue;
    }

    // Skip Next.js API route exports (POST, GET, PUT, DELETE, PATCH)
    if (
      /^(POST|GET|PUT|DELETE|PATCH)$/.test(exportName.trim()) &&
      /app[/\\]api[/\\].*route\.ts/.test(normalizedPath)
    ) {
      continue;
    }

    // Skip Next.js metadata exports
    if (exportName.trim() === 'metadata' && /app[/\\].*\.tsx/.test(normalizedPath)) {
      continue;
    }

    entries.push({
      file: normalizedPath,
      line: parseInt(lineNum, 10),
      exportName: exportName.trim(),
      workspace,
    });
  }

  return entries;
}

function generateRemovalCommand(entry: DeadCodeEntry): string {
  return `# Remove unused export '${entry.exportName}' from ${entry.file}:${entry.line}`;
}

function generateReport(allEntries: DeadCodeEntry[]): string {
  const timestamp = new Date().toISOString();
  const grouped = new Map<string, DeadCodeEntry[]>();

  for (const entry of allEntries) {
    const key = entry.workspace;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(entry);
  }

  let md = `# Dead Code Report

> Generated: ${timestamp}
> Tool: ts-prune v0.10.3
> Scope: All TypeScript workspaces

## Summary

| Workspace | Unused Exports |
|-----------|---------------|
`;

  for (const ws of WORKSPACES) {
    const count = grouped.get(ws.name)?.length ?? 0;
    md += `| \`${ws.name}\` | ${count} |\n`;
  }

  md += `| **Total** | **${allEntries.length}** |\n`;
  md += `\n---\n\n`;
  md += `## How to Use This Report\n\n`;
  md += `1. Review each unused export below\n`;
  md += `2. Verify it is truly unused (ts-prune may have false positives for dynamic imports or framework-consumed exports)\n`;
  md += `3. Remove confirmed dead code using the suggested approach\n`;
  md += `4. Run \`pnpm build\` after removal to verify no breakage\n\n`;
  md += `### Exclusions Applied\n\n`;
  md += `- Exports marked \`(used in module)\` by ts-prune\n`;
  md += `- Next.js generated files (\`.next/\`, route types)\n`;
  md += `- Prisma generated client files (\`packages/db/generated/\`)\n`;
  md += `- Build output (\`dist/\`)\n`;
  md += `- Next.js page/layout/route \`default\` exports (consumed by framework)\n`;
  md += `- Next.js API route HTTP method exports (\`POST\`, \`GET\`, etc.)\n`;
  md += `- Next.js \`metadata\` exports (consumed by framework)\n`;
  md += `- Tool config file \`default\` exports (\`next.config.ts\`, \`tailwind.config.ts\`, etc.)\n\n`;
  md += `---\n\n`;

  for (const [workspace, entries] of grouped) {
    md += `## ${workspace}\n\n`;
    md += `| File | Line | Export | Suggested Action |\n`;
    md += `|------|------|--------|------------------|\n`;

    for (const entry of entries) {
      const shortFile = entry.file;
      md += `| \`${shortFile}\` | ${entry.line} | \`${entry.exportName}\` | Remove export or verify usage |\n`;
    }

    md += `\n`;
  }

  md += `---\n\n`;
  md += `## Suggested Removal Commands\n\n`;
  md += `\`\`\`bash\n`;
  md += `# After verifying each export is truly unused, remove them:\n`;
  md += `# Option 1: Manual removal (recommended for review)\n`;
  md += `# Open each file and remove the unused export declaration\n\n`;
  md += `# Option 2: Use eslint auto-fix for unused imports\n`;
  md += `pnpm lint --fix\n\n`;
  md += `# Option 3: Re-run ts-prune to verify after cleanup\n`;
  md += `npx ts-prune --project apps/api/tsconfig.json\n`;
  md += `npx ts-prune --project apps/web/tsconfig.json\n`;
  md += `npx ts-prune --project packages/shared/tsconfig.json\n`;
  md += `npx ts-prune --project packages/config/tsconfig.json\n`;
  md += `\`\`\`\n\n`;
  md += `## Notes\n\n`;
  md += `- Some exports in \`packages/shared\` may be consumed by the mobile app (Flutter) or future features\n`;
  md += `- Exports in \`packages/config\` are intentionally available for all workspaces\n`;
  md += `- \`next.config.ts\` and \`tailwind.config.ts\` default exports are consumed by their respective tools\n`;
  md += `- Review barrel exports (\`index.ts\`) carefully — they re-export for external consumers\n`;

  return md;
}

// Main execution
const allEntries: DeadCodeEntry[] = [];

for (const ws of WORKSPACES) {
  console.log(`Scanning ${ws.name}...`);
  const output = runTsPrune(ws.tsconfig);
  const entries = parseTsPruneOutput(output, ws.name);
  allEntries.push(...entries);
  console.log(`  Found ${entries.length} unused exports`);
}

const report = generateReport(allEntries);
const outputPath = path.resolve('docs/audit/dead-code-report.md');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, report, 'utf-8');

console.log(`\nDead code report generated: ${outputPath}`);
console.log(`Total unused exports found: ${allEntries.length}`);
