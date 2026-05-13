import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: '.',
    include: ['**/*.{test,spec}.{ts,tsx}', '**/*.property.spec.ts'],
    globals: true,
  },
});
