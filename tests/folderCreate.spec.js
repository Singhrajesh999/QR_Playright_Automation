import { test, expect } from '@playwright/test';

test('Create & Delete Folder + Logout (Stable)', async ({ page }) => {

  const email = 'qrtest00@gmail.com';
  const password = 'adobetesting';
  const folderName = `Test Folder ${Date.now()}`;

  // ---------- LOGIN ----------
  await page.goto('https://app.quickreviewer.com/#/auth/login');

  const emailInput = page.locator('#loginEmail');
  const passwordInput = page.locator('input[type="password"]');
  const loginBtn = page.getByRole('button', { name: 'Login' });

  await expect(emailInput).toBeVisible();
  await emailInput.fill(email);

  await expect(passwordInput).toBeVisible();
  await passwordInput.fill(password);

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    loginBtn.click()
  ]);

  // ---------- VERIFY LOGIN ----------
  await expect(page.getByRole('button', { name: /New/i })).toBeVisible();

  // ---------- CREATE FOLDER ----------
  const newBtn = page.getByRole('button', { name: /New/i });
  await newBtn.click();

  await page.getByText('Folder', { exact: true }).click();

  const folderInput = page.getByRole('textbox', { name: 'Enter new name' });
  await expect(folderInput).toBeVisible();
  await folderInput.fill(folderName);

  const createBtn = page.getByRole('button', { name: 'Create' });
  await createBtn.click();

  // ---------- VERIFY FOLDER CREATED ----------
  const folderLocator = page.locator('#folder').filter({ hasText: folderName });
  await expect(folderLocator).toBeVisible({ timeout: 10000 });

  // ---------- RIGHT CLICK & DELETE ----------
  await folderLocator.click({ button: 'right' });

  const removeOption = page.getByText('Remove');
  await expect(removeOption).toBeVisible();
  await removeOption.click();

  const confirmBtn = page.getByRole('button', { name: 'OK' });
  await confirmBtn.click();

  // ---------- VERIFY FOLDER DELETED ----------
  await expect(folderLocator).not.toBeVisible();

  // ---------- LOGOUT ----------
  const profileIcon = page.getByText('A', { exact: true });
  await profileIcon.click();

  const logoutLink = page.getByRole('link', { name: /Logout/i });
  await logoutLink.click();

  // ---------- VERIFY LOGOUT ----------
  await expect(emailInput).toBeVisible();
});