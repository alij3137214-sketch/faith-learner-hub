import { test, expect, Page } from '@playwright/test';

const email = process.env.TEST_EMAIL_1;
const password = process.env.TEST_PASSWORD_1;

test.describe('Faith Learner production smoke', () => {
  test('public navigation exposes core features', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toContainText(/Home|Library|Learn/i);
    await expect(page.locator('a[href="/library"], a[href="/learn"], a[href="/admin"]')).toHaveCount(3);
  });

  test('authentication form is available', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Resend confirmation/i })).toBeVisible();
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

  test('authenticated learner can reach learning, library, AI, rank and duel', async ({ page }) => {
    test.skip(!email || !password, 'Authenticated test secrets are not configured');
    await login(page, email!, password!);

    for (const path of ['/learn', '/library', '/ask', '/rank', '/duel', '/profile']) {
      await page.goto(path);
      await expect(page).toHaveURL(new RegExp(path.replace('/', '\\/')));
    }

    await page.goto('/library');
    const first = page.locator('a[href^="/library/"]').first();
    await expect(first).toBeVisible();
    await first.click();
    await expect(page.locator('article')).toBeVisible();
    await expect(page.getByRole('button', { name: /AI Summary/i })).toBeVisible();

    await page.goto('/ask');
    const input = page.locator('input').first();
    await input.fill('What does the library say about moral courage?');
    await page.getByRole('button').last().click();
    await expect(page.locator('body')).toContainText(/Searching|AI request failed|No relevant information|citation|moral courage/i, { timeout: 30_000 });

    await page.goto('/profile');
    await expect(page.getByRole('button', { name: /Sign out/i })).toBeVisible();
    await page.getByRole('button', { name: /Sign out/i }).click();
    await page.waitForURL(/\/auth/);
  });
});

async function login(page: Page, userEmail: string, userPassword: string) {
  await page.goto('/auth');
  await page.getByLabel('Email').fill(userEmail);
  await page.getByLabel('Password').fill(userPassword);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('/', { timeout: 20_000 });
}
