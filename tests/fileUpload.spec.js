import { test, expect } from '@playwright/test';
import path from 'path';

test('File Upload & Logout', async ({ page }) => {

  const email = 'qrtest00@gmail.com';
  const password = 'adobetesting';

  // const fileName = 'audiofile.mp3';
  const fileName = 'test25.pdf'
  const filePath = path.resolve(__dirname, 'UploadFiles', fileName);

  // ---------- LOGIN ----------
 
  await page.goto('https://app.quickreviewer.com/#/auth/login', { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveURL(/login/);

  await page.locator('#loginEmail').fill(email);
  await page.locator('input[type="password"]').fill(password);

  const loginBtn = page.getByRole('button', { name: /login/i });
  await expect(loginBtn).toBeEnabled();

  await Promise.all([
    page.waitForNavigation(),
    loginBtn.click()
  ]);
  // wait for API-storage 
await page.waitForLoadState('networkidle');
await page.waitForTimeout(3000);

  // Dashboard
  const newBtn = page.getByRole('button', { name: /new/i });
  await expect(newBtn).toBeVisible({ timeout: 120000 });

  // ---------- GO TO FILE UPLOAD ----------
  await newBtn.click();
  await expect(page.getByText(/file upload/i)).toBeVisible({ timeout: 20000 });

  // ---------- FILE UPLOAD ----------
  const fileInput = page.locator('#fileUpload');

  // Ensure input exists
  await expect(fileInput).toBeAttached({ timeout: 20000 });

  // Upload file (works even if hidden)
  await fileInput.setInputFiles(filePath);

  //  upload validation
  await expect(page.locator(`text=${fileName}`).first()).toBeVisible({ timeout: 20000 });

  // ---------- LOGOUT ----------

// Step 1: Click profile avatar (A icon)
const profileIcon = page.locator('.fCharImage'); // exact class from your DOM

await expect(profileIcon).toBeVisible({ timeout: 30000 });
await profileIcon.click();

// Step 2: Click Logout from dropdown
const logoutBtn = page.getByText('Logout');

await expect(logoutBtn).toBeVisible({ timeout: 10000 });
await logoutBtn.click();

// Step 3: Verify logout
await expect(page).toHaveURL(/login/, { timeout: 20000 });

});