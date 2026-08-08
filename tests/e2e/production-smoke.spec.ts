import { test, expect } from '@playwright/test';

const email = process.env.SMOKE_TEST_EMAIL;
const password = process.env.SMOKE_TEST_PASSWORD;

test.describe('production smoke', () => {
  test('public navigation and key pages load', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Faith Learner/i);
    for (const path of ['/learn', '/library', '/avatar', '/duel', '/ask']) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should return 2xx/3xx`).toBeLessThan(400);
    }
  });

  test('authenticated learner journey', async ({ page }) => {
    test.skip(!email || !password, 'Set SMOKE_TEST_EMAIL and SMOKE_TEST_PASSWORD for authenticated checks');
    await page.goto('/auth');
    await page.getByLabel(/email/i).fill(email!);
    await page.getByLabel(/password/i).fill(password!);
    await page.getByRole('button', { name: /sign in|log in/i }).click();
    await expect(page).not.toHaveURL(/auth/i);

    await page.goto('/learn');
    await expect(page.getByRole('heading', { name: /learn/i })).toBeVisible();

    await page.goto('/ask');
    const askInput = page.getByRole('textbox').first();
    await askInput.fill('What does the source library teach about moral courage?');
    await page.getByRole('button', { name: /ask|send/i }).click();
    await expect(page.locator('body')).not.toContainText(/supabase url is required/i);
    await expect(page.locator('body')).not.toContainText(/configuration is missing/i);
    await expect(page.locator('body')).toContainText(/source/i);

    await page.goto('/avatar');
    await expect(page.locator('body')).toContainText(/avatar/i);

    await page.goto('/duel');
    await expect(page.locator('body')).toContainText(/duel/i);
  });
});
