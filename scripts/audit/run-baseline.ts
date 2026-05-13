#!/usr/bin/env tsx
/**
 * Audit Baseline Report Generator
 *
 * Orchestrates all metric collectors and outputs a structured report.
 * Run with: pnpm tsx scripts/audit/run-baseline.ts
 */

import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { collectTypescriptStrict } from './collectors/typescript-strict.ts';
import { collectEslintWarnings } from './collectors/eslint-warnings.ts';
import { collectTestCoverage } from './collectors/test-coverage.ts';
import { collectDependencyFreshness } from './collectors/dependency-freshness.ts';
import { collectBundleSize } from './collectors/bundle-size.ts';
import { collectDockerImageSize } from './collectors/docker-image-size.ts';
import { collectSecurityAudit } from './collectors/security-audit.ts';
import { collectAdrCount } from './collectors/adr-count.ts';
import type { AuditMetric, BaselineReport, SecurityBlocker } from './types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, '..', '..');

function detectSecurityBlockers(metrics: AuditMetric[]): SecurityBlocker[] {
  const blockers: SecurityBlocker[] = [];

  // Check for critical/high security vulnerabilities
  const criticalVuln = metrics.find((m) => m.name === 'Security vulnerabilities (critical)');
  if (
    criticalVuln &&
    typeof criticalVuln.currentValue === 'number' &&
    criticalVuln.currentValue > 0
  ) {
    blockers.push({
      type: 'SECURITY_VULNERABILITY',
      description: `${criticalVuln.currentValue} critical vulnerability(ies) found in production dependencies`,
      requirement: 'Req 1.5 — blocker until resolved',
    });
  }

  const highVuln = metrics.find((m) => m.name === 'Security vulnerabilities (high)');
  if (highVuln && typeof highVuln.currentValue === 'number' && highVuln.currentValue > 0) {
    blockers.push({
      type: 'SECURITY_VULNERABILITY',
      description: `${highVuln.currentValue} high severity vulnerability(ies) found in production dependencies`,
      requirement: 'Req 1.5 — blocker until resolved',
    });
  }

  return blockers;
}

function formatReportMarkdown(report: BaselineReport): string {
  const lines: string[] = [];

  lines.push('# WanderViet — Baseline Audit Report');
  lines.push('');
  lines.push(`> Generated at: ${report.generatedAt}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('| # | Metric | Current Value | Target | Automated | Command |');
  lines.push('|---|--------|---------------|--------|-----------|---------|');

  report.metrics.forEach((metric, index) => {
    const automated = metric.automated ? '✅' : '❌';
    const command = metric.command ? `\`${metric.command}\`` : '—';
    lines.push(
      `| ${index + 1} | ${metric.name} | ${metric.currentValue} | ${metric.target} | ${automated} | ${command} |`,
    );
  });

  lines.push('');

  // Manual procedures section
  const manualMetrics = report.metrics.filter((m) => m.manualProcedure);
  if (manualMetrics.length > 0) {
    lines.push('## Manual Measurement Procedures');
    lines.push('');
    for (const metric of manualMetrics) {
      lines.push(`### ${metric.name}`);
      lines.push('');
      lines.push(`**Reason:** Cannot be fully automated.`);
      lines.push('');
      lines.push(`**Procedure:**`);
      lines.push('```bash');
      lines.push(metric.manualProcedure!);
      lines.push('```');
      lines.push('');
    }
  }

  // Blockers section
  if (report.blockers.length > 0) {
    lines.push('## 🚨 Security Blockers');
    lines.push('');
    lines.push(
      'The following issues MUST be resolved before proceeding with dependent requirements:',
    );
    lines.push('');
    for (const blocker of report.blockers) {
      lines.push(`- **[${blocker.type}]** ${blocker.description}`);
      lines.push(`  - Reference: ${blocker.requirement}`);
    }
    lines.push('');
  } else {
    lines.push('## ✅ No Security Blockers Detected');
    lines.push('');
  }

  // Post-upgrade targets
  lines.push('## Post-Upgrade Targets');
  lines.push('');
  lines.push('| Metric | Target |');
  lines.push('|--------|--------|');
  lines.push('| TypeScript strict (all workspaces) | strict + noUncheckedIndexedAccess |');
  lines.push('| ESLint warnings | Reduce by ≥ 50% from baseline |');
  lines.push('| Test coverage (API core) | ≥ 70% line coverage |');
  lines.push('| Test coverage (Web lib+hooks) | ≥ 50% line coverage |');
  lines.push('| Outdated dependencies | 0 high/critical severity |');
  lines.push('| Web bundle JS | < 300 KB first load |');
  lines.push('| Web bundle CSS | < 100 KB |');
  lines.push('| Security vulnerabilities (critical) | 0 |');
  lines.push('| Security vulnerabilities (high) | 0 |');
  lines.push('| Docker image sizes | < 500 MB each |');
  lines.push('| ADR count | ≥ 8 |');
  lines.push('');

  return lines.join('\n');
}

async function main(): Promise<void> {
  console.log('🔍 WanderViet Audit Baseline — collecting metrics...\n');

  const allMetrics: AuditMetric[] = [];

  // Collect all metrics
  console.log('  📋 Checking TypeScript strict mode...');
  allMetrics.push(...collectTypescriptStrict(ROOT_DIR));

  console.log('  📋 Counting ESLint warnings...');
  allMetrics.push(...collectEslintWarnings(ROOT_DIR));

  console.log('  📋 Collecting test coverage...');
  allMetrics.push(...collectTestCoverage(ROOT_DIR));

  console.log('  📋 Checking dependency freshness...');
  allMetrics.push(...collectDependencyFreshness(ROOT_DIR));

  console.log('  📋 Measuring web bundle size...');
  allMetrics.push(...collectBundleSize(ROOT_DIR));

  console.log('  📋 Measuring Docker image sizes...');
  allMetrics.push(...collectDockerImageSize(ROOT_DIR));

  console.log('  📋 Running security audit...');
  allMetrics.push(...collectSecurityAudit(ROOT_DIR));

  console.log('  📋 Counting ADRs...');
  allMetrics.push(...collectAdrCount(ROOT_DIR));

  // Detect blockers
  const blockers = detectSecurityBlockers(allMetrics);

  // Build report
  const report: BaselineReport = {
    generatedAt: new Date().toISOString(),
    metrics: allMetrics,
    blockers,
  };

  // Ensure output directory exists
  const outputDir = resolve(ROOT_DIR, 'docs/audit');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Write markdown report
  const markdown = formatReportMarkdown(report);
  const reportPath = resolve(outputDir, 'baseline-report.md');
  writeFileSync(reportPath, markdown, 'utf-8');

  // Write JSON for programmatic access
  const jsonPath = resolve(outputDir, 'baseline-report.json');
  writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf-8');

  console.log(`\n✅ Audit complete! Report written to:`);
  console.log(`   📄 ${reportPath}`);
  console.log(`   📄 ${jsonPath}`);

  if (blockers.length > 0) {
    console.log(`\n🚨 ${blockers.length} BLOCKER(S) DETECTED — see report for details.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Audit failed:', err);
  process.exit(1);
});
