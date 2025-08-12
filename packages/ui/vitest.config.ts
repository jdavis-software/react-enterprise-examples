import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['@react-enterprise-examples/testing/vitest.setup'],
    exclude: ['e2e/**'],
  },
});
