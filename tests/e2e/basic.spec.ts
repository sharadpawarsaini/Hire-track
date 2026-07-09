import { test, expect } from '@playwright/test';

test('has title and start text', async ({ page }) => {
  await page.goto('/');

  // Expect h1 to contain the start message
  await expect(page.locator('h1')).toContainText('To get started, edit');
});
