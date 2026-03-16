import { test, expect } from '@playwright/test';

test('Login and Logout', async ({ page }) => {

  const email = 'qrtest00@gmail.com';
  const password = 'adobetesting';

  // Navigate to login page
  await page.goto('https://app.quickreviewer.com/#/auth/login');
  await expect(page).toHaveURL(/login/);

  // Fill login credentials
  const emailInput = page.locator('#loginEmail');
  const passwordInput = page.locator('input[type="password"]');

  await expect(emailInput).toBeVisible();
  await emailInput.fill(email);

  await expect(passwordInput).toBeVisible();
  await passwordInput.fill(password);

  // Login
  const loginButton = page.getByRole('button', { name: 'Login' });
  await expect(loginButton).toBeEnabled();
  await loginButton.click();

  // Verify dashboard loaded
  const profileIcon = page.getByText('A', { exact: true });
  await expect(profileIcon).toBeVisible();

  // Logout
  await profileIcon.click();

  const logoutLink = page.getByRole('link', { name: /logout/i });
  await expect(logoutLink).toBeVisible();
  await logoutLink.click();

  // Verify logout success
  await expect(page).toHaveURL(/login/);

});