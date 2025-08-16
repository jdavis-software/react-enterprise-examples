// eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importX from 'eslint-plugin-import-x';
import unusedImports from 'eslint-plugin-unused-imports';
import testingLibrary from 'eslint-plugin-testing-library';
import vitest from 'eslint-plugin-vitest';
import playwright from 'eslint-plugin-playwright';
import storybook from 'eslint-plugin-storybook';
import prettier from 'eslint-config-prettier';

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
        { prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',

      // Imports
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
            ['type'],
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', disallowTypeAnnotations: true },
      ],

      // Kill dead imports fast
      'unused-imports/no-unused-imports': 'error',

      // Block reaching into package internals; use export maps/subpaths
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
