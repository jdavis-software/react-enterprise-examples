import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  js.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    ignores: ['**/dist/**', '**/*.ts', '**/*.tsx']
  }
];
