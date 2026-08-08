import { test, expect, Page } from '@playwright/test';

const email = process.env.TEST_EMAIL_1;
const password = process.env.TEST_PASSWORD_1;

test.describe('Faith Learner production smoke', () => {
  test('home exposes auth-first entry and core navigation after login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/auth/);
    await expect(page.getByLabel('Email')).to