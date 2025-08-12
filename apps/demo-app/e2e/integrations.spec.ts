import { test, expect } from '@playwright/test';

test.describe.configure({ retries: 2, timeout: 30000 });

test('connect provider and toggle disabled', async ({ page }) => {
  await page.goto('/integrations');
  await page.getByRole('button', { name: 'Connect' }).first().click();
  await page.getByLabel(/terms/i).check();
  await page.getByRole('button', { name: /next/i }).click();
  await page.getByLabel(/api key/i).fill('123');
  await page.getByRole('button', { name: /next/i }).click();
  await page.getByRole('button', { name: 'Connect' }).click();
  await expect(page.getByText(/connected/i).first()).toBeVisible();

  await page.getByRole('switch', { name: 'Show Disabled' }).click();
  await expect(page.getByText(/Secure Co/)).toBeVisible();
});
