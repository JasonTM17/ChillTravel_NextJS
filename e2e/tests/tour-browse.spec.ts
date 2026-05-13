import { test, expect } from '@playwright/test';

/**
 * E2E: Tour Browse Flow — Find Tour → View Detail
 * Validates: Requirement 3.8 (critical flow 2)
 */
test.describe('Tour Browse Flow: Find Tour → View Detail', () => {
  test('user can browse tours listing page', async ({ page }) => {
    await page.goto('/tours');

    // Tours page should load with a heading
    await expect(page.locator('h1')).toBeVisible();

    // Should display at least one tour card
    const tourCards = page.locator('article, [data-testid="tour-card"]');
    await expect(tourCards.first()).toBeVisible();
  });

  test('user can click a tour to view its detail', async ({ page }) => {
    await page.goto('/tours');

    // Wait for tour cards to load
    const firstTour = page.locator('article, [data-testid="tour-card"]').first();
    await expect(firstTour).toBeVisible();

    // Click the first tour link
    await firstTour.locator('a').first().click();

    // Should navigate to a tour detail page
    await expect(page).toHaveURL(/\/tours\/.+/);

    // Tour detail page should have content
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('tour detail page displays essential information', async ({ page }) => {
    await page.goto('/tours');

    // Navigate to first tour
    const firstTour = page.locator('article, [data-testid="tour-card"]').first();
    await expect(firstTour).toBeVisible();
    await firstTour.locator('a').first().click();

    await expect(page).toHaveURL(/\/tours\/.+/);

    // Tour detail should show key information
    // Title/heading should be visible
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // Page should have some content (description, price, etc.)
    const mainContent = page.locator('main, [role="main"], .container').first();
    await expect(mainContent).toBeVisible();
  });

  test('tours page is accessible without authentication', async ({ page }) => {
    // Tours listing should be public
    await page.goto('/tours');
    await expect(page).toHaveURL(/\/tours/);
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('tour detail page is accessible without authentication', async ({ page }) => {
    // Navigate to tours and get a tour slug
    await page.goto('/tours');
    const firstTour = page.locator('article, [data-testid="tour-card"]').first();
    await expect(firstTour).toBeVisible();
    await firstTour.locator('a').first().click();

    // Should stay on tour detail, not redirect to login
    await expect(page).toHaveURL(/\/tours\/.+/);
    await expect(page).not.toHaveURL(/\/login/);
  });
});
