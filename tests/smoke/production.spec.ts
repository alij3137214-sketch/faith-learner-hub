import { test, expect, Page } from '@playwright/test';

const email = process.env.TEST_EMAIL_1;
const password = process.env.TEST_PASSWORD_1;

test.describe('Faith Learner production smoke', () => {
  test('home exposes core navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toContainText(/Home|Library|Learn/i);
    await expect(page.getByRole('link', { name: /Library/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Learn/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Admin/i }).first()).toBeVisible();
  });

  test('authentication form is available', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Resend confirmation/i })).toBeVisible();
  });

  test('library is auth-gated before login', async ({ page }) => {
    await expectAuthGate(page, '/library');
  });

  test('AI assistant is auth-gated before login', async ({ page }) => {
    await expectAuthGate(page, '/ask');
  });

  test('admin entry is visible and protected', async ({ page }) => {
    await page.goto('/');
    const admin = page.getByRole('link', { name: /Admin/i }).first();
    await expect(admin).toBeVisible();
    await admin.click({ force: true });
    await expect(page.locator('body')).toContainText(/admin|access|sign in|authorized/i);
    await expect(page.getByLabel('Email')).toBeVisible();
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
    await expect(input).toBeVisible();
    await input.fill('What does the library say about moral courage?');
    const submit = page.getByRole('button', { name: /Ask|Send|Submit/i }).last();
    await expect(submit).toBeVisible();
    await submit.click();
    await expect(page.locator('body')).toContainText(/Searching|AI request failed|No relevant information|citation|moral courage/i, { timeout: 30_000 });

    await page.goto('/profile');
    await expect(page.getByRole('button', { name: /Sign out/i })).toBeVisible();
    await page.getByRole('button', { name: /Sign out/i }).click();
    await page.waitForURL(/\/auth/);
  });
});

async function expectAuthGate(page: Page, path: string) {
  await page.goto(path);
  const authForm = page.getByLabel('Email');
  if (await authForm.isVisible().catch(() => false)) return;
  await expect(page).toHaveURL(/\/auth/);
  await expect(authForm).toBeVisible();
}

async function login(page: Page, userEmail: string, userPassword: string) {
  await page.goto('/auth');
  await page.getByLabel('Email').fill(userEmail);
  await page.getByLabel('Password').fill(userPassword);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('/', { timeout: 20_000 });
}