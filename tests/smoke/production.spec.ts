import { test, expect } from '@playwright/test';

test.describe('Faith Learner production smoke', () => {
  test('public navigation exposes core features', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toContainText(/Home|Library|Learn/i);
    await expect(page.locator('a[href="/library"], a[href="/learn"], a[href="/admin"]')).toHaveCount(3);
  });

  test('library cards open reading material', async ({ page }) => {
    await page.goto('/library');
    const first = page.locator('a[href^="/library/"]').first();
    await expect(first).toBeVisible();
    await first.click();
    await expect(page).toHaveURL(/\/library\//);
    await expect(page.locator('article')).toBeVisible();
  });

  test('AI assistant is reachable', async ({ page }) => {
    await page.goto('/ask');
    await expect(page.locator('input')).toBeVisible();
    await expect(page.getByRole('button')).toBeVisible();
  });

  test('admin entry is visible but protected', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[href="/admin"]').click();
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator('body')).toContainText(/admin|access|sign in|authorized/i);
  });
});
