import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: '.',
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'src/**/*.property.spec.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'src/modules/auth/**/*.ts',
        'src/modules/booking*/**/*.ts',
        'src/modules/coupon*/**/*.ts',
        'src/modules/tour*/**/*.ts',
        'src/modules/payment*/**/*.ts',
      ],
      exclude: [
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.property.spec.ts',
        '**/index.ts',
        '**/main.ts',
        '**/*.module.ts',
        '**/*.dto.ts',
        '**/*.entity.ts',
        '**/test-utils/**',
      ],
      thresholds: {
        lines: 25,
        functions: 25,
        branches: 15,
        statements: 25,
      },
    },
  },
});
