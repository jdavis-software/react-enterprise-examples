import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['packages/testing/src/vitest.setup.ts'],
    exclude: ['apps/demo-app/e2e/**'],
    include: ['packages/**/*.{test,spec}.{ts,tsx}', 'apps/**/*.{test,spec}.{ts,tsx}']
  }
});
