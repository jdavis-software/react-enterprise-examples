import { test, expect } from '@playwright/test';

test.describe.configure({ retries: 0 });

test('button variants', async ({ page }) => {
  await page.goto('/iframe.html?id=primitives-button--playground');
  expect(await page.screenshot()).toMatchSnapshot('button.png');
});

test('badge tones', async ({ page }) => {
  await page.goto('/iframe.html?id=primitives-badge--playground');
  expect(await page.screenshot()).toMatchSnapshot('badge.png');
});
