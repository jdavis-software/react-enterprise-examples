import { test, expect } from '@playwright/test';

test.describe.configure({ retries: 2, timeout: 30000 });

test('search filters and sort toggles', async ({ page }) => {
  await page.goto('/large-data-sets');
  await page.getByPlaceholder('Search devices').fill('Device 1');
  await expect(page.getByText(/Showing 1 of/)).toBeVisible();
  const nameHeader = page.getByRole('columnheader', { name: 'Name' });
  await nameHeader.click();
  await expect(page.getByRole('row', { name: /Device 1/ })).toBeVisible();
});
