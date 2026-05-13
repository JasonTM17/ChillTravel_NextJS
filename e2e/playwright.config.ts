import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration for WanderViet.
 *
 * Supports CI sharding via environment variables:
 *   PLAYWRIGHT_SHARD_INDEX — 1-based shard index (e.g. 1, 2)
 *   PLAYWRIGHT_SHARD_TOTAL — total number of shards (e.g. 2)
 *
 * Usage in CI:
 *   npx playwright test --shard=1/2
 *   npx playwright test --shard=2/2
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /* Use multiple workers in CI for parallel execution within each shard */
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['html', { outputFolder: 'playwright-report' }], ['github'], ['json', { outputFile: 'test-results/results.json' }]]
    : [['html', { outputFolder: 'playwright-report' }], ['list']],
  /* Global timeout per test */
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter @vietwander/api dev',
      url: 'http://localhost:4000/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'pnpm --filter @vietwander/web dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
