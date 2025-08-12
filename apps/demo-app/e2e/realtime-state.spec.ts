import { test, expect } from '@playwright/test';

test.describe.configure({ retries: 2, timeout: 30000 });

test('realtime page reconnects', async ({ page }) => {
  await page.goto('/realtime-state');
  await expect(page.getByText('OPEN')).toBeVisible();
  await page.getByRole('button', { name: 'Simulate Error' }).click();
  await expect(page.getByText('CONNECTING')).toBeVisible();
  await expect(page.getByText('OPEN')).toBeVisible();
});
