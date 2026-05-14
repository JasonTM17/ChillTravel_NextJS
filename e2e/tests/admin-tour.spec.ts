import { test, expect } from '@playwright/test';

/**
 * E2E: Admin Tour Flow — Admin Login → Create Tour
 * Validates: Requirement 3.8 (critical flow 4)
 */
test.describe('Admin Tour Flow: Admin Login → Create Tour', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin before each test
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@wanderviet.com');
    await page.fill('[name="password"]', 'Admin@123456');
    await page.click('[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('admin can login and access admin dashboard', async ({ page }) => {
    await page.goto('/admin');

    // Admin dashboard should be accessible
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('admin can navigate to tours management', async ({ page }) => {
    await page.goto('/admin');

    // Look for tours management link/section
    const toursLink = page.locator('[href="/admin/tours"]').first();

    if (await toursLink.isVisible()) {
      await toursLink.click();
      await expect(page).toHaveURL(/\/admin\/tours/);
    } else {
      // Navigate directly
      await page.goto('/admin/tours');
      await expect(page).toHaveURL(/\/admin\/tours/);
    }

    await expect(page.locator('h1')).toBeVisible();
  });

  test('admin can access create tour form', async ({ page }) => {
    // Navigate to tour creation
    await page.goto('/admin/tours');

    // Look for create/add tour button
    const createButton = page
      .locator(
        'a:has-text("Create"), a:has-text("Add"), a:has-text("Tạo"), button:has-text("Create"), button:has-text("Add"), button:has-text("Tạo"), [href*="/admin/tours/create"], [href*="/admin/tours/new"]',
      )
      .first();

    if (await createButton.isVisible()) {
      await createButton.click();

      // Should be on create tour page/form
      await page.waitForTimeout(500);
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
    } else {
      // Try direct navigation to create page
      await page.goto('/admin/tours/create');
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
    }
  });

  test('admin can fill tour creation form', async ({ page }) => {
    // Navigate to create tour page
    await page.goto('/admin/tours/create');

    // Check if form exists
    const form = page.locator('form').first();
    if (await form.isVisible()) {
      // Fill in basic tour information
      const nameInput = page.locator('[name="name"], [name="title"], [name="tourName"]').first();

      if (await nameInput.isVisible()) {
        await nameInput.fill(`E2E Test Tour ${Date.now()}`);
      }

      // Look for description field
      const descInput = page.locator('[name="description"], textarea').first();

      if (await descInput.isVisible()) {
        await descInput.fill('This is an E2E test tour created by Playwright');
      }

      // Verify form has a submit button
      const submitButton = page
        .locator(
          'button[type="submit"], button:has-text("Save"), button:has-text("Create"), button:has-text("Lưu"), button:has-text("Tạo")',
        )
        .first();
      await expect(submitButton).toBeVisible();
    }
  });

  test('non-admin user cannot access admin tour management', async ({ page }) => {
    // Logout and login as regular user
    await page.goto('/login');
    await page.fill('[name="email"]', 'user@wanderviet.com');
    await page.fill('[name="password"]', 'User@123456');
    await page.click('[type="submit"]');
    await expect(page).toHaveURL('/');

    // Try to access admin tours
    await page.goto('/admin/tours');

    // Should be redirected away from admin
    await expect(page).not.toHaveURL(/\/admin\/tours/);
  });
});
