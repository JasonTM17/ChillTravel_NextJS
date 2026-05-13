import { test, expect } from '@playwright/test';

test.describe('Admin flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin before each test
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@wanderviet.com');
    await page.fill('[name="password"]', 'Admin@123456');
    await page.click('[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('admin can access dashboard', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('admin can view bookings list', async ({ page }) => {
    await page.goto('/admin/bookings');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('admin can view reviews moderation', async ({ page }) => {
    await page.goto('/admin/reviews');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('non-admin user cannot access admin pages', async ({ page }) => {
    // Logout first
    await page.goto('/');
    // Login as regular user
    await page.goto('/login');
    await page.fill('[name="email"]', 'user@wanderviet.com');
    await page.fill('[name="password"]', 'User@123456');
    await page.click('[type="submit"]');

    // Try to access admin
    await page.goto('/admin');
    // Should be redirected away from admin
    await expect(page).not.toHaveURL('/admin');
  });
});
