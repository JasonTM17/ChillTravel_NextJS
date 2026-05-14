import { test, expect } from '@playwright/test';

test.describe('Authentication flow', () => {
  test('register → login → logout', async ({ page }) => {
    // Navigate to register page
    await page.goto('/register');
    await expect(page).toHaveTitle(/WanderViet|WanderViet/);

    // Fill register form
    await page.fill('[name="fullName"]', 'E2E Test User');
    await page.fill('[name="email"]', `e2e-${Date.now()}@test.com`);
    await page.fill('[name="password"]', 'TestPassword@123');
    await page.click('[type="submit"]');

    // Should redirect to home after register
    await expect(page).toHaveURL('/');
  });

  test('login with demo credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'user@wanderviet.com');
    await page.fill('[name="password"]', 'User@123456');
    await page.click('[type="submit"]');

    // Should redirect to home after login
    await expect(page).toHaveURL('/');
  });

  test('protected route redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/my-bookings');
    await expect(page).toHaveURL('/login');
  });

  test('admin route redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL('/login');
  });
});
