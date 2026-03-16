import { test, expect } from '@playwright/test';

test('Forgot Password flow', async ({ page }) => {

  // Open Login Page
  await page.goto('https://app.quickreviewer.com/#/auth/login');

  // Verify Login page loaded
  await expect(page).toHaveURL(/login/);

  // Click Forgot Password
  const forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password?' });
  await expect(forgotPasswordLink).toBeVisible();
  await forgotPasswordLink.click();

  // Verify Forgot Password page opened
  const emailInput = page.getByRole('textbox', { name: /email address/i });
  await expect(emailInput).toBeVisible();

  // Enter email
  await emailInput.fill('qrtest00@gmail.com');

  // Click Send button
  const sendButton = page.getByRole('button', { name: 'Send' });
  await expect(sendButton).toBeEnabled();
  await sendButton.click();

  // Assertion (success message or navigation check)
  // Update locator if application shows success message
  // Example:
  // await expect(page.getByText(/email sent/i)).toBeVisible();

  // Click Back to Login
  const backToLoginButton = page.getByRole('button', { name: 'Back to Login' });
  await expect(backToLoginButton).toBeVisible();
  await backToLoginButton.click();

  // Verify redirected to login page
  await expect(page).toHaveURL(/login/);

});