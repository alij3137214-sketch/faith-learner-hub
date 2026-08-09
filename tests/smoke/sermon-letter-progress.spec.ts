import { test, expect, Page } from '@playwright/test';

const email = process.env.TEST_EMAIL_1;
const password = process.env.TEST_PASSWORD_1;
const letterTitle = 'Leadership Through Responsibility';

test.describe('Faith Learner sermon and letter reading smoke', () => {
  test('authenticated learner can attribute, read, complete, and reopen a letter with persisted progress', async ({ page }) => {
    test.skip(!email || !password, 'Authenticated test secrets are not configured');
    await login(page, email!, password!);

    await page.goto('/library');
    const search = page.getByPlaceholder('Search titles and summaries');
    await expect(search).toBeVisible();
    await search.fill(letterTitle);

    const letter = page.getByRole('link', { name: `Open ${letterTitle}` });
    await expect(letter).toBeVisible({ timeout: 15000 });
    await letter.click();
    await expect(page).toHaveURL(/\/library\/[0-9a-f-]+/);

    const attribution = page.getByRole('region', { name: 'Attribution' });
    await expect(attribution).toBeVisible();
    await expect(attribution).toContainText(/Type:\s*letter/i);
    await expect(attribution).toContainText(/Source:/i);

    const article = page.locator('article');
    await expect(article).toBeVisible();
    await expect(article).toContainText(letterTitle);
    expect((await article.innerText()).trim().length).toBeGreaterThan(120);

    const markComplete = page.getByRole('button', { name: /Mark as complete/i });
    if (await markComplete.isVisible()) {
      await markComplete.click();
      await expect(page.getByRole('button', { name: /Completed/i })).toBeVisible({ timeout: 15000 });
    } else {
      await expect(page.getByRole('button', { name: /Completed/i })).toBeVisible();
    }

    await page.reload();
    await expect(page.getByRole('button', { name: /Completed/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('region', { name: 'Attribution' })).toContainText(/Type:\s*letter/i);
    await expect(page.locator('article')).toContainText(letterTitle);
  });

  test('authenticated learner can attribute, read, complete, and reopen a speech with persisted progress', async ({ page }) => {
    test.skip(!email || !password, 'Authenticated test secrets are not configured');
    await login(page, email!, password!);

    await page.goto('/library');
    const search = page.getByPlaceholder('Search titles and summaries');
    await search.fill('Karbala and Moral Courage');

    const speech = page.getByRole('link', { name: 'Open Karbala and Moral Courage' });
    await expect(speech).toBeVisible({ timeout: 15000 });
    await speech.click();
    await expect(page).toHaveURL(/\/library\/[0-9a-f-]+/);

    const attribution = page.getByRole('region', { name: 'Attribution' });
    await expect(attribution).toBeVisible();
    await expect(attribution).toContainText(/Type:\s*speech/i);
    await expect(attribution).toContainText(/Source:/i);

    const article = page.locator('article');
    await expect(article).toBeVisible();
    await expect(article).toContainText('Karbala and Moral Courage');
    expect((await article.innerText()).trim().length).toBeGreaterThan(120);

    const markComplete = page.getByRole('button', { name: /Mark as complete/i });
    if (await markComplete.isVisible()) {
      await markComplete.click();
      await expect(page.getByRole('button', { name: /Completed/i })).toBeVisible({ timeout: 15000 });
    } else {
      await expect(page.getByRole('button', { name: /Completed/i })).toBeVisible();
    }

    await page.reload();
    await expect(page.getByRole('button', { name: /Completed/i })).toBeVisible({ timeout: 15000 });
  });
});

async function login(page: Page, userEmail: string, userPassword: string) {
  await page.goto('/auth');
  await page.getByLabel('Email').fill(userEmail);
  await page.getByLabel('Password').fill(userPassword);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('/', { timeout: 20000 });
}
