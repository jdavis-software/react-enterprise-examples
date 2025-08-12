import { test, expect } from '@playwright/test';

test('a11y i18n interactions', async ({ page }) => {
  await page.goto('/a11y-i18n');
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to content')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.focus('[data-row="0"][data-col="0"]');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-row="0"][data-col="1"]')).toBeFocused();
  const trigger = page.getByRole('button', { name: 'Open Modal' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.getByRole('button', { name: /rtl/i }).click();
  await expect(page.evaluate(() => document.documentElement.dir)).resolves.toBe('rtl');
});
