import { defineConfig } from '@playwright/test';

export default defineConfig({
  retries: 2,
  timeout: 30000,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI
  },
  testDir: './e2e'
});
