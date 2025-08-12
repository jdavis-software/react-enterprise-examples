import { test, expect } from '@playwright/test';

test('large data page shows summary', async ({ page }) => {
  await page.goto('http://localhost:5173/large-data-sets');
  await expect(page.getByText(/Showing/)).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();
});
