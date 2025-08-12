import { test, expect } from '@playwright/test';

test('homepage has welcome text', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page.getByText('Welcome to the demo app.')).toBeVisible();
});
