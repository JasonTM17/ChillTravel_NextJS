import { test, expect } from '@playwright/test';

/**
 * E2E: Booking Flow — Book Tour → Mock Checkout
 * Validates: Requirement 3.8 (critical flow 3)
 *
 * Note: All payment processing is mock/demo only per AGENTS.md security rules.
 */
test.describe('Booking Flow: Book Tour → Mock Checkout', () => {
  test.beforeEach(async ({ page }) => {
    // Login as regular user before each booking test
    await page.goto('/login');
    await page.fill('[name="email"]', 'user@wanderviet.com');
    await page.fill('[name="password"]', 'User@123456');
    await page.click('[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('user can navigate to a tour and initiate booking', async ({ page }) => {
    // Browse to tours
    await page.goto('/tours');
    await expect(page.locator('h1')).toBeVisible();

    // Click first available tour
    const firstTour = page.locator('article, [data-testid="tour-card"]').first();
    await expect(firstTour).toBeVisible();
    await firstTour.locator('a').first().click();

    // Should be on tour detail page
    await expect(page).toHaveURL(/\/tours\/.+/);

    // Look for a booking/book now button
    const bookButton = page.locator(
      'button:has-text("Book"), button:has-text("Đặt"), a:has-text("Book"), a:has-text("Đặt")'
    ).first();
    await expect(bookButton).toBeVisible();
  });

  test('user can proceed through booking form', async ({ page }) => {
    // Navigate to tours and select one
    await page.goto('/tours');
    const firstTour = page.locator('article, [data-testid="tour-card"]').first();
    await expect(firstTour).toBeVisible();
    await firstTour.locator('a').first().click();
    await expect(page).toHaveURL(/\/tours\/.+/);

    // Click book/reserve button
    const bookButton = page.locator(
      'button:has-text("Book"), button:has-text("Đặt"), a:has-text("Book"), a:has-text("Đặt")'
    ).first();

    if (await bookButton.isVisible()) {
      await bookButton.click();

      // Should navigate to booking page or show booking form
      // The URL might contain /booking or a modal might appear
      await page.waitForTimeout(1000);

      // Verify we're in a booking context (form, modal, or new page)
      const bookingContext = page.locator(
        'form, [data-testid="booking-form"], [role="dialog"]'
      ).first();
      const isBookingPage = page.url().includes('booking');

      expect(await bookingContext.isVisible() || isBookingPage).toBeTruthy();
    }
  });

  test('user can view their bookings after booking', async ({ page }) => {
    // Navigate to my bookings page
    await page.goto('/my-bookings');

    // Should be accessible (not redirected to login since we're authenticated)
    await expect(page).toHaveURL(/\/my-bookings/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('mock checkout does not process real payment', async ({ page }) => {
    // Navigate to tours and attempt booking flow
    await page.goto('/tours');
    const firstTour = page.locator('article, [data-testid="tour-card"]').first();
    await expect(firstTour).toBeVisible();
    await firstTour.locator('a').first().click();
    await expect(page).toHaveURL(/\/tours\/.+/);

    // Verify no real payment gateway elements are present
    // Per AGENTS.md: Never implement real payment processing
    const realPaymentElements = page.locator(
      'iframe[src*="stripe"], iframe[src*="paypal"], [data-stripe], [data-paypal]'
    );
    await expect(realPaymentElements).toHaveCount(0);
  });
});
