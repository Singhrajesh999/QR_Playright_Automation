import { test, expect } from '@playwright/test';

test('Add to Starred → Remove from Starred → Logout', async ({ page }) => {

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

  // ---------- SELECT FIRST THUMBNAIL ----------
  const thumbnail = page.locator('[id^="thumb_"]').first();
  await expect(thumbnail).toBeVisible({ timeout: 10000 });

  // ---------- ADD TO STARRED ----------
  await thumbnail.click({ button: 'right' });

  const addToStarred = page.getByText('Add to Starred', { exact: true });
  await expect(addToStarred).toBeVisible();
  await addToStarred.click();

  // ---------- NAVIGATE TO STARRED ----------
  const starredMenu = page.getByRole('listitem').filter({ hasText: 'Starred' });
  await expect(starredMenu).toBeVisible();
  await starredMenu.click();

  // verify item present in starred
  const starredItem = page.locator('[id^="thumb_"]').first();
  await expect(starredItem).toBeVisible();

  // ---------- REMOVE FROM STARRED ----------
  await starredItem.click({ button: 'right' });

  const removeFromStarred = page.getByText('Remove from Starred', { exact: true });
  await expect(removeFromStarred).toBeVisible();
  await removeFromStarred.click();

  // optional: verify removed (if UI updates immediately)
  // await expect(starredItem).toHaveCount(0);

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