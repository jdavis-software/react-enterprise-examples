import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  snapshotPathTemplate: '.vrt-snapshots/{testFilePath}/{arg}{ext}',
  webServer: {
    command: 'npx http-server ./storybook-static -p 6006',
    port: 6006,
    reuseExistingServer: !process.env.CI
  }
});
