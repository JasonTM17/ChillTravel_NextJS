import { test, expect } from '@playwright/test';

/**
 * E2E: Authentication Flow — Register → Login
 * Validates: Requirement 3.8 (critical flow 1)
 */
test.describe('Auth Flow: Register → Login', () => {
  const uniqueEmail = `e2e-auth-${Date.now()}@test.com`;
  const password = 'TestPassword@123';
  const fullName = 'E2E Auth Flow User';

  test('user can register a new account', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveTitle(/WanderViet|WanderViet/);

    // Fill registration form
    await page.fill('[name="fullName"]', fullName);
    await page.fill('[name="email"]', uniqueEmail);
    await page.fill('[name="password"]', password);

    // Submit registration
    await page.click('[type="submit"]');

    // Should redirect to home or login after successful registration
    await expect(page).toHaveURL(/\/(login)?$/);
  });

  test('user can login with existing credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill login form with demo credentials
    await page.fill('[name="email"]', 'user@wanderviet.com');
    await page.fill('[name="password"]', 'User@123456');

    // Submit login
    await page.click('[type="submit"]');

    // Should redirect to home after successful login
    await expect(page).toHaveURL('/');
  });

  test('register then login with new account', async ({ page }) => {
    const newEmail = `e2e-reglogin-${Date.now()}@test.com`;

    // Step 1: Register
    await page.goto('/register');
    await page.fill('[name="fullName"]', 'Register Login User');
    await page.fill('[name="email"]', newEmail);
    await page.fill('[name="password"]', password);
    await page.click('[type="submit"]');

    // Wait for registration to complete
    await page.waitForURL(/\/(login)?$/);

    // Step 2: Login with the newly registered account
    await page.goto('/login');
    await page.fill('[name="email"]', newEmail);
    await page.fill('[name="password"]', password);
    await page.click('[type="submit"]');

    // Should be logged in and on home page
    await expect(page).toHaveURL('/');
  });

  test('login fails with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'invalid@test.com');
    await page.fill('[name="password"]', 'WrongPassword123');
    await page.click('[type="submit"]');

    // Should remain on login page or show error
    await expect(page).toHaveURL(/\/login/);
  });

  test('protected route redirects unauthenticated user to login', async ({ page }) => {
    await page.goto('/my-bookings');
    await expect(page).toHaveURL(/\/login/);
  });
});
