import { test, expect } from '@playwright/test';

test('Login → Update Subdomain → Logout', async ({ page }) => {

  // Test Data
  const email = 'qrtest00@gmail.com';
  const password = 'adobetesting';
   // 🔥 Dynamic subdomain (unique every run)
   const subdomain = `lekhu${Date.now()}`;
  // Navigate to Login Page
  await page.goto('https://app.quickreviewer.com/#/auth/login');

  // Verify login page loaded
  await expect(page).toHaveURL(/login/);

  // Fill login credentials
  const emailInput = page.locator('#loginEmail');
  const passwordInput = page.locator('input[type="password"]');

  await expect(emailInput).toBeVisible();
  await emailInput.fill(email);

  await expect(passwordInput).toBeVisible();
  await passwordInput.fill(password);

  // Click Login
  const loginButton = page.getByRole('button', { name: 'Login' });
  await expect(loginButton).toBeEnabled();
  await loginButton.click();

  // Wait for dashboard to load
  await expect(page.getByRole('listitem').filter({ hasText: 'Team' })).toBeVisible();

  // Open Team section
  const teamMenu = page.getByRole('listitem').filter({ hasText: 'Team' });
  await teamMenu.click();

  // Click Update Subdomain
  const updateSubdomainBtn = page.getByRole('button', { name: 'Update Subdomain' });
  await expect(updateSubdomainBtn).toBeVisible();
  await updateSubdomainBtn.click();

  // Update subdomain
  const subdomainInput = page.getByRole('textbox', { name: 'mycompany' });
  await expect(subdomainInput).toBeVisible();
  await subdomainInput.fill(subdomain);

  // Click Update
  const updateButton = page.getByRole('button', { name: 'Update', exact: true });
  await expect(updateButton).toBeEnabled();
  await updateButton.click();

  // Open profile menu
  const profileIcon = page.getByText('A', { exact: true });
  await expect(profileIcon).toBeVisible();
  await profileIcon.click();

  // Logout
  const logoutLink = page.getByRole('link', { name: /logout/i });
  await expect(logoutLink).toBeVisible();
  await logoutLink.click();

  // Verify redirected to login page
  await expect(page).toHaveURL(/login/);

});