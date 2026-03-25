import { test, expect } from '@playwright/test';

test('Open Announcements → Logout', async ({ page }) => {

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

  // ---------- OPEN ANNOUNCEMENTS ----------
  const announcementsIcon = page.getByRole('img', { name: /announcements/i });

  await expect(announcementsIcon).toBeVisible({ timeout: 10000 });
  await announcementsIcon.click();

  // ✅ verify announcements opened (adjust text if needed)
  await expect(page.getByText(/announcement/i)).toBeVisible();

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