import tseslint from 'typescript-eslint';
import importX from 'eslint-plugin-import-x';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/coverage/**',
      '**/storybook-static/**',
      '**/.turbo/**',
      '**/generated/**',
      'apps/ai-service/**',
      'packages/db/prisma/**',
      'scripts/**',
      'load-tests/**',
      'e2e/**',
    ],
  },

  // Base config for all TypeScript files
  ...tseslint.configs.recommended,

  // Import plugin and unused-imports plugin
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'import-x': importX,
      'unused-imports': unusedImports,
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          project: [
            './apps/api/tsconfig.json',
            './apps/web/tsconfig.json',
            './packages/shared/tsconfig.json',
            './packages/config/tsconfig.json',
          ],
        },
      },
    },
    rules: {
      // Import ordering: grouped and alphabetized
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      // Prevent circular dependencies
      'import-x/no-cycle': ['error', { maxDepth: 4 }],

      // No console except warn and error
      'no-console': ['error', { allow: ['warn', 'error'] }],

      // Remove unused imports automatically
      'unused-imports/no-unused-imports': 'error',

      // Relax some typescript-eslint rules that are too strict for existing code
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Relax rules for test files — `any` is common in mocks and test utilities
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
