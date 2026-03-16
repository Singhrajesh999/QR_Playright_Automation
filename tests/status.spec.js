import { test, expect } from '@playwright/test';

test('Create, Edit and Delete Status', async ({ page }) => {

  await page.goto('https://app.quickreviewer.com/#/auth/login');

  // Login
  await page.fill('#loginEmail', 'qrtest00@gmail.com');
  await page.fill('input[type="password"]', 'adobetesting');

  await Promise.all([
    page.waitForNavigation(),
    page.getByRole('button', { name: /login/i }).click()
  ]);

  // Verify dashboard
  await expect(page).toHaveURL(/dashboard|home/);

  // -------- Navigate to Status Page --------
  await page.getByText('Status', { exact: true }).click();

  await expect(page.getByRole('button', { name: 'New Status' })).toBeVisible();

  // -------- Create Status --------

  await page.getByRole('button', { name: 'New Status' }).click();

  const nameField = page.locator('input[formcontrolname="name"]');
  const descField = page.locator('textarea[formcontrolname="description"]');

  await nameField.fill('Test Status');
  await descField.fill('Test');

  await page.getByRole('checkbox').check();

  await page.getByRole('button', { name: 'Save' }).click();

  // Verify created
  await expect(page.getByText('Test Status')).toBeVisible();

  // -------- Duplicate Validation --------

  await page.getByRole('button', { name: 'New Status' }).click();

  await nameField.fill('Test Status');
  await descField.fill('Test');

  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText(/taken/i)).toBeVisible();

  await page.getByRole('button', { name: 'Cancel' }).click();

  // -------- Edit Status --------

  await page.locator('.fe-edit-2').first().click();

  await nameField.fill('Test Status2');

  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('Test Status2')).toBeVisible();

  // -------- Delete Status --------

  await page.locator('.fe-trash').first().click();

  await page.getByRole('button', { name: 'OK' }).click();

  await expect(page.getByText('Test Status2')).not.toBeVisible();

});