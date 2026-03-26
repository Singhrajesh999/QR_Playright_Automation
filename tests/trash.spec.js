import { test, expect } from '@playwright/test';
import path from 'path';

test('File Upload & Preview', async ({ page }) => {

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

  /// ---------- FILE UPLOAD ----------
  const fileInput = page.locator('#fileUpload');
  await expect(fileInput).toBeAttached();

  //  Wait for upload API
  const uploadResponse = page.waitForResponse(res =>
    res.url().includes('/upload') && res.status() === 200
  );

  await fileInput.setInputFiles(filePath);

  // Wait until upload finishes
  await uploadResponse;

  // Validate file visible
  await expect(page.locator(`text=${fileName}`).first()).toBeVisible();

  // ---------- SELECT FILE & RIGHT CLICK ----------
  const firstFile = page.locator(`text=${fileName}`).filter({
    hasText: fileName
  }).first();
  
  await expect(firstFile).toBeVisible();

// Right click on file
await firstFile.click({ button: 'right' });

  // ---------- CLICK REMOVE ----------
  const removeOption = page.locator('li:has-text("Remove")').first();

  await expect(removeOption).toBeVisible();
  await removeOption.click();

  // ---------- CONFIRM DELETE ----------
  const confirmBtn = page.getByRole('button', { name: /ok/i });
  await expect(confirmBtn).toBeVisible();

  await confirmBtn.click();


  // ---------- LOGOUT ----------
  const profileIcon = page.locator('.fCharImage');
  await expect(profileIcon).toBeVisible();
  await profileIcon.click();

  const logoutBtn = page.getByText('Logout');
  await expect(logoutBtn).toBeVisible();
  await logoutBtn.click();

  await expect(page).toHaveURL(/login/);

});