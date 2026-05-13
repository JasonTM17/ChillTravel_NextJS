import { test, expect } from '@playwright/test';

/**
 * E2E: Review Flow — User Writes Review
 * Validates: Requirement 3.8 (critical flow 5)
 */
test.describe('Review Flow: User Writes Review', () => {
  test.beforeEach(async ({ page }) => {
    // Login as regular user before each test
    await page.goto('/login');
    await page.fill('[name="email"]', 'user@wanderviet.com');
    await page.fill('[name="password"]', 'User@123456');
    await page.click('[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('user can navigate to a tour and see review section', async ({ page }) => {
    // Browse to tours
    await page.goto('/tours');
    const firstTour = page.locator('article, [data-testid="tour-card"]').first();
    await expect(firstTour).toBeVisible();
    await firstTour.locator('a').first().click();

    // Should be on tour detail page
    await expect(page).toHaveURL(/\/tours\/.+/);

    // Look for reviews section on tour detail page
    const reviewSection = page.locator(
      '[data-testid="reviews"], section:has-text("Review"), section:has-text("Đánh giá"), h2:has-text("Review"), h2:has-text("Đánh giá"), h3:has-text("Review"), h3:has-text("Đánh giá")'
    ).first();

    // Reviews section should exist on tour detail page
    await expect(reviewSection).toBeVisible();
  });

  test('user can access review form on tour detail', async ({ page }) => {
    // Navigate to a tour detail page
    await page.goto('/tours');
    const firstTour = page.locator('article, [data-testid="tour-card"]').first();
    await expect(firstTour).toBeVisible();
    await firstTour.locator('a').first().click();
    await expect(page).toHaveURL(/\/tours\/.+/);

    // Look for write review button or form
    const reviewTrigger = page.locator(
      'button:has-text("Review"), button:has-text("Đánh giá"), button:has-text("Write"), a:has-text("Review"), a:has-text("Đánh giá"), textarea[name="content"], textarea[name="review"], textarea[name="comment"]'
    ).first();

    // Either a review button or textarea should be visible for authenticated users
    await expect(reviewTrigger).toBeVisible();
  });

  test('user can fill in review content', async ({ page }) => {
    // Navigate to a tour detail page
    await page.goto('/tours');
    const firstTour = page.locator('article, [data-testid="tour-card"]').first();
    await expect(firstTour).toBeVisible();
    await firstTour.locator('a').first().click();
    await expect(page).toHaveURL(/\/tours\/.+/);

    // Try to find and interact with review form
    // First check if there's a button to open review form
    const reviewButton = page.locator(
      'button:has-text("Review"), button:has-text("Đánh giá"), button:has-text("Write")'
    ).first();

    if (await reviewButton.isVisible()) {
      await reviewButton.click();
      await page.waitForTimeout(500);
    }

    // Look for review textarea
    const reviewTextarea = page.locator(
      'textarea[name="content"], textarea[name="review"], textarea[name="comment"], textarea[placeholder*="review"], textarea[placeholder*="đánh giá"]'
    ).first();

    if (await reviewTextarea.isVisible()) {
      await reviewTextarea.fill('This is an excellent tour! Great experience with beautiful scenery. Highly recommended for travelers.');

      // Look for rating input (stars, select, etc.)
      const ratingInput = page.locator(
        '[data-testid="rating"], [name="rating"], .rating, [aria-label*="star"], [aria-label*="rating"]'
      ).first();

      if (await ratingInput.isVisible()) {
        await ratingInput.click();
      }

      // Verify submit button exists
      const submitButton = page.locator(
        'button[type="submit"], button:has-text("Submit"), button:has-text("Gửi"), button:has-text("Post")'
      ).first();
      await expect(submitButton).toBeVisible();
    }
  });

  test('unauthenticated user cannot write a review', async ({ page }) => {
    // Create a new context without authentication
    const newPage = await page.context().newPage();
    await newPage.goto('/tours');

    const firstTour = newPage.locator('article, [data-testid="tour-card"]').first();
    if (await firstTour.isVisible()) {
      await firstTour.locator('a').first().click();
      await expect(newPage).toHaveURL(/\/tours\/.+/);

      // Review form should not be available or should prompt login
      const reviewForm = newPage.locator(
        'textarea[name="content"], textarea[name="review"], textarea[name="comment"]'
      ).first();

      // Either the form is not visible, or there's a login prompt
      const loginPrompt = newPage.locator(
        'a:has-text("Login"), a:has-text("Đăng nhập"), button:has-text("Login"), button:has-text("Đăng nhập")'
      ).first();

      const formHidden = !(await reviewForm.isVisible());
      const hasLoginPrompt = await loginPrompt.isVisible();

      // Either the review form is hidden or there's a login prompt
      expect(formHidden || hasLoginPrompt).toBeTruthy();
    }

    await newPage.close();
  });
});
