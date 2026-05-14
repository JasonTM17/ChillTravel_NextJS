import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: '.',
    include: ['lib/**/*.{test,spec}.{ts,tsx}', 'hooks/**/*.{test,spec}.{ts,tsx}'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov'],
      reportsDirectory: './coverage',
      include: ['lib/**/*.ts', 'lib/**/*.tsx', 'hooks/**/*.ts', 'hooks/**/*.tsx'],
      exclude: ['**/*.spec.ts', '**/*.test.ts', '**/*.spec.tsx', '**/*.test.tsx', '**/index.ts'],
      thresholds: {
        lines: 15,
        functions: 10,
        branches: 15,
        statements: 15,
      },
    },
  },
});
