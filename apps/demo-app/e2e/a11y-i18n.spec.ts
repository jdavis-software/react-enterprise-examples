import { test, expect } from '@playwright/test';

test.describe.configure({ retries: 2, timeout: 30000 });

test('a11y i18n interactions', async ({ page }) => {
  await page.goto('/a11y-i18n');
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to content')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  const trigger = page.getByRole('button', { name: 'Open Modal' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.getByRole('button', { name: 'es' }).click();
  await expect(page.getByText('Cerrar')).toBeVisible();
});
