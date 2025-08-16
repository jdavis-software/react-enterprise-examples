// eslint.config.mjs
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import playwright from 'eslint-plugin-playwright';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import testingLibrary from 'eslint-plugin-testing-library';
import unusedImports from 'eslint-plugin-unused-imports';
import vitest from 'eslint-plugin-vitest';
import tseslint from 'typescript-eslint';

export default [
  // Global ignores
  {
    ignores: [
      '**/dist/**',
      '**/storybook-static/**',
      '**/coverage/**',
      '**/.vercel/**',
      '**/.playwright/**',
    ],
  },

  // Base JS
  js.configs.recommended,

  // TypeScript (type-checked across workspaces)
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    languageOptions: {
      ...cfg.languageOptions,
      parserOptions: {
        ...cfg.languageOptions?.parserOptions,
        projectService: true, // discovers tsconfig per workspace
        tsconfigRootDir: import.meta.dirname,
      },
    },
  })),

  // React + Hooks + A11y + Imports
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      'import-x': importX,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
      },
    },
    rules: {
      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // TS hygiene
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', disallowTypeAnnotations: true },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',

      // Imports
      'import-x/first': 'error',
      'import-x/newline-after-import': 'warn',
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          includeTypes: true,
          devDependencies: [
            '**/*.config.*',
            '**/vite.config.*',
            '**/.storybook/**',
            '**/*.stories.*',
            '**/__tests__/**',
            '**/*.{test,spec}.*',
            '**/e2e/**',
          ],
        },
      ],
      'import-x/order': [
        'warn',
        {
          groups: [
            ['builtin', 'external'],
            ['internal'],
            ['parent', 'sibling', 'index'],
            ['type'], // <- keep type-only imports last
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Kill dead imports fast
      'unused-imports/no-unused-imports': 'error',

      // Don’t reach into package internals; use export maps/subpaths
      'no-restricted-imports': [
        'error',
        {
          patterns: ['**/packages/*/src/*'],
        },
      ],
    },
    settings: { react: { version: 'detect' } },
  },

  // A11y recommended
  jsxA11y.flatConfigs.recommended,

  // Testing: Vitest + RTL
  {
    files: ['**/__tests__/**/*.{ts,tsx}', '**/*.{test,spec}.{ts,tsx}'],
    plugins: { 'testing-library': testingLibrary, vitest },
    languageOptions: {
      ...vitest.configs.recommended?.languageOptions,
      globals: { vi: 'readonly' },
    },
    rules: {
      ...testingLibrary.configs.dom?.rules,
      ...vitest.configs.recommended?.rules,
      'testing-library/no-node-access': 'warn',
      'testing-library/no-container': 'warn',
    },
  },

  // E2E: Playwright
  {
    files: ['**/e2e/**/*.{ts,tsx}'],
    ...playwright.configs['flat/recommended'],
  },

  // Storybook
  {
    files: ['**/*.stories.{ts,tsx}', '**/.storybook/**/*.{ts,tsx}'],
    ...storybook.configs['flat/recommended'],
    rules: {
      'import-x/no-extraneous-dependencies': 'off',
    },
  },

  // Node / config files
  {
    files: ['**/*.{c,m}?js', '**/*.config.{ts,cts,mts,js,cjs,mjs}'],
    languageOptions: {
      sourceType: 'module',
      globals: { process: 'readonly', __dirname: 'readonly' },
    },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },

  // Prettier last to disable stylistic conflicts
  prettier,
];
