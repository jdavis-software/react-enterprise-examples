import { test, expect } from '@playwright/test';

test('realtime page reconnects', async ({ page }) => {
  await page.goto('/realtime-state');
  await page.getByText('OPEN').waitFor();
  await page.getByRole('button', { name: 'Simulate Error' }).click();
  await page.getByText('CONNECTING').waitFor();
  await page.getByText('OPEN').waitFor();
});
