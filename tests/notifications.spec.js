import { test, expect } from '@playwright/test';

test('Notifications Open → Interact → Logout', async ({ page }) => {

  const email = 'qrtest00@gmail.com';
  const password = 'adobetesting';

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

  // ---------- OPEN NOTIFICATIONS ----------
  const bellIcon = page.locator('.icon.fe.fe-bell');
  await expect(bellIcon).toBeVisible({ timeout: 10000 });
  await bellIcon.click();

  // ---------- VERIFY PANEL OPEN ----------
  const notificationPanel = page.locator('[class*="notification"], [class*="panel"]');
  await expect(notificationPanel.first()).toBeVisible();

  // ---------- CLICK FIRST ACTION ICON (STABLE WAY) ----------
  const actionIcon = notificationPanel.locator('i.fe, .fe').first();

  if (await actionIcon.isVisible()) {
    await actionIcon.click();
  }

  // ---------- CLOSE PANEL ----------
  await bellIcon.click();

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