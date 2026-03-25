import { test, expect } from '@playwright/test';

test('Create Webproof → Delete → Logout', async ({ page }) => {

  const email = 'qrtest00@gmail.com';
  const password = 'adobetesting';
  const websiteURL = 'https://www.quickreviewer.com';

  // ---------- LOGIN ----------
  await page.goto('https://app.quickreviewer.com/#/auth/login', { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveURL(/login/);

  await page.fill('#loginEmail', email);
  await page.fill('input[type="password"]', password);

  const loginBtn = page.getByRole('button', { name: /login/i });
  await expect(loginBtn).toBeEnabled();

  await Promise.all([
    page.waitForNavigation(),
    loginBtn.click()
  ]);

  // ---------- CREATE NEW ----------
  const newBtn = page.getByRole('button', { name: /new/i });
  await expect(newBtn).toBeVisible();
  await newBtn.click();

  // Select Webproof (avoid dynamic overlay id)
  const webproofOption = page.getByText('Webproof', { exact: true });
  await expect(webproofOption).toBeVisible();
  await webproofOption.click();

  // ---------- ENTER URL ----------
  const urlInput = page.getByRole('textbox', { name: /enter website url/i });
  await expect(urlInput).toBeVisible();
  await urlInput.fill(websiteURL);

  // Test URL
  const testBtn = page.getByRole('button', { name: 'Test' });
  await expect(testBtn).toBeEnabled();
  await testBtn.click();

  // Create proof
  const createBtn = page.getByRole('button', { name: 'Create' });
  await expect(createBtn).toBeEnabled();
  await createBtn.click();

  // ---------- VERIFY PROOF CREATED ----------
  const thumbnail = page.locator('[id^="thumb_"]').first();
  await expect(thumbnail).toBeVisible({ timeout: 10000 });

  // ---------- DELETE PROOF ----------
  await thumbnail.click({ button: 'right' });

  const removeOption = page.getByText('Remove', { exact: true });
  await expect(removeOption).toBeVisible();
  await removeOption.click();

  const confirmBtn = page.getByRole('button', { name: 'OK' });
  await expect(confirmBtn).toBeVisible();
  await confirmBtn.click();

  // Verify removed
  await expect(thumbnail).toHaveCount(0);

  // ---------- LOGOUT ----------
  const profileIcon = page.getByText('A', { exact: true });
  await expect(profileIcon).toBeVisible();
  await profileIcon.click();

  const logoutBtn = page.getByRole('link', { name: /logout/i });

  await Promise.all([
    page.waitForURL(/login/),
    logoutBtn.click()
  ]);

  await expect(page).toHaveURL(/login/);
});