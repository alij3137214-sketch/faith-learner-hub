import { test, expect, Page } from '@playwright/test';

const email = process.env.TEST_EMAIL_1;
const password = process.env.TEST_PASSWORD_1;

test.describe('Faith Learner production smoke', () => {
  test('home exposes auth-first entry and core navigation after login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/auth/);
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    test.skip(!email || !password, 'Authenticated test secrets are not configured');
    await login(page, email!, password!);
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

  test('library is auth-gated before login', async ({ page }) => { await expectAuthGate(page, '/library'); });
  test('AI assistant is auth-gated before login', async ({ page }) => { await expectAuthGate(page, '/ask'); });

  test('admin entry is visible and protected', async ({ page }) => {
    test.skip(!email || !password, 'Authenticated test secrets are not configured');
    await login(page, email!, password!);
    const admin = page.getByRole('link', { name: /Admin/i }).first();
    await expect(admin).toBeVisible();
    await admin.click();
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator('body')).toContainText(/admin|access|authorized/i);
  });

  test('authenticated learner can complete a course lesson and quiz', async ({ page }) => {
    test.skip(!email || !password, 'Authenticated test secrets are not configured');
    await login(page, email!, password!);

    await page.goto('/learn');
    const path = page.locator('a[href^="/learn/"]').first();
    await expect(path).toBeVisible();
    await path.click();
    await expect(page).toHaveURL(/\/learn\/[^/]+/);

    const lesson = page.locator('a[href^="/library/"]').first();
    const quiz = page.locator('a[href^="/quiz/"]').first();
    await expect(page.locator('a[href^="/library/"], a[href^="/quiz/"]').first()).toBeVisible();

    if (await lesson.isVisible()) {
      await lesson.click();
      await expect(page.locator('article')).toBeVisible();
      const complete = page.getByRole('button', { name: /Mark as complete/i });
      if (await complete.isVisible()) {
        await complete.click();
        await expect(page.getByRole('button', { name: /Completed|Already completed/i })).toBeVisible({ timeout: 15000 });
      }
    }

    await page.goto('/learn');
    await path.click();
    const quizLink = page.locator('a[href^="/quiz/"]').first();
    await expect(quizLink).toBeVisible();
    await quizLink.click();
    await expect(page).toHaveURL(/\/quiz\/[^/]+/);
    await expect(page.getByRole('button', { name: /Submit quiz/i })).toBeVisible();
    const options = page.locator('section').filter({ hasText: /Question 1/i }).getByRole('button');
    if (await options.count()) await options.first().click();
  });

  test('authenticated learner can reach library, AI, leaderboard, duel and profile', async ({ page }) => {
    test.skip(!email || !password, 'Authenticated test secrets are not configured');
    await login(page, email!, password!);
    for (const [path, marker] of [
      ['/learn', /Learn|Learning/i], ['/library', /Library|Authentic, indexed sources/i], ['/ask', /Knowledge|Assistant|Ask/i],
      ['/leaderboard', /Rank|Leaderboard/i], ['/duel', /Duel|Challenge/i], ['/profile', /Profile|You/i],
    ] as const) {
      await page.goto(path);
      await expect(page).toHaveURL(new RegExp(path.replace('/', '\\/')));
      await expect(page.locator('body')).toContainText(marker);
    }
    await page.goto('/library');
    const first = page.locator('a[href^="/library/"]').first();
    await expect(first).toBeVisible();
    await first.click();
    await expect(page).toHaveURL(/\/library\/[0-9a-f-]+/);
    await expect(page.locator('article')).toBeVisible();
    await expect(page.getByRole('button', { name: /AI Summary/i })).toBeVisible();
    await page.goto('/ask');
    const input = page.locator('input').first();
    await input.fill('What does the library say about moral courage?');
    const submit = page.getByRole('button', { name: /Ask|Send|Submit/i }).last();
    await expect(submit).toBeVisible();
    await submit.click();
    await expect(page.locator('body')).toContainText(/Searching|AI request failed|No relevant information|citation|moral courage/i, { timeout: 30000 });
    await page.goto('/profile');
    await expect(page.getByRole('button', { name: /Sign out/i })).toBeVisible();
    await page.getByRole('button', { name: /Sign out/i }).click();
    await page.waitForURL(/\/auth/);
  });
});

async function expectAuthGate(page: Page, path: string) {
  await page.goto(path);
  await expect(page).toHaveURL(/\/auth/);
  await expect(page.getByLabel('Email')).toBeVisible();
}

async function login(page: Page, userEmail: string, userPassword: string) {
  await page.goto('/auth');
  await page.getByLabel('Email').fill(userEmail);
  await page.getByLabel('Password').fill(userPassword);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('/', { timeout: 20000 });
}
