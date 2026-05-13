import { test, expect } from '@playwright/test';

test.describe('Booking flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[name="email"]', 'user@wanderviet.com');
    await page.fill('[name="password"]', 'User@123456');
    await page.click('[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('browse tours and view tour detail', async ({ page }) => {
    await page.goto('/tours');
    await expect(page.locator('h1')).toBeVisible();

    // Click first tour
    const firstTour = page.locator('article').first();
    await firstTour.locator('a').first().click();

    // Should be on tour detail page
    await expect(page.url()).toContain('/tours/');
  });

  test('view my bookings page', async ({ page }) => {
    await page.goto('/my-bookings');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('view wishlist page', async ({ page }) => {
    await page.goto('/wishlist');
    await expect(page.locator('h1')).toBeVisible();
  });
});
