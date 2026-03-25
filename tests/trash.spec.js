import { test, expect } from '@playwright/test';
import path from 'path';

test('File Upload → Delete → Empty Trash → Logout', async ({ page }) => {

  const email = 'qrtest00@gmail.com';
  const password = 'adobetesting';
  const filePath = path.resolve('tests/UploadFiles/logo.jpg');

  // ---------- LOGIN ----------
  await page.goto('https://app.quickreviewer.com/#/auth/login', { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveURL(/login/);

  await page.fill('#loginEmail', email);
  await page.fill('input[type="password"]', password);

  await Promise.all([
    page.waitForNavigation(),
    page.getByRole('button', { name: /login/i }).click()
  ]);

  // ---------- NEW → FILE UPLOAD ----------
  const newBtn = page.getByRole('button', { name: /new/i });
  await expect(newBtn).toBeVisible();
  await newBtn.click();

  await page.getByText('File Upload', { exact: true }).click();

  // ---------- FILE UPLOAD (FIXED) ----------
  const fileInput = page.locator('#sidebar-file'); // ✅ unique locator
  //await expect(fileInput).toBeAttached();

  await fileInput.setInputFiles(filePath);

  // ---------- VERIFY FILE UPLOADED ----------
  const thumbnail = page.locator('[id^="thumb_"]').first();
  await expect(thumbnail).toBeVisible({ timeout: 15000 });

  // ---------- DELETE FILE ----------
  await thumbnail.click({ button: 'right' });

  const removeOption = page.getByText('Remove', { exact: true });
  await expect(removeOption).toBeVisible();
  await removeOption.click();

  const confirmDelete = page.getByRole('button', { name: 'OK' });
  await expect(confirmDelete).toBeVisible();
  await confirmDelete.click();

  // ---------- OPEN TRASH ----------
  const trashMenu = page.getByRole('listitem').filter({ hasText: 'Trash' });
  await expect(trashMenu).toBeVisible();
  await trashMenu.click();

  // ---------- VERIFY ITEM IN TRASH ----------
  const trashItem = page.locator('[id^="thumb_"]').first();
  await expect(trashItem).toBeVisible({ timeout: 10000 });

  // ---------- EMPTY TRASH (FIXED) ----------
  const emptyBtn = page
    .getByRole('listitem')
    .filter({ hasText: 'Trash' })
    .getByRole('button', { name: 'Empty' });

  await expect(emptyBtn).toBeVisible();
  await expect(emptyBtn).toBeEnabled();
  await emptyBtn.click();

  const confirmEmpty = page.getByRole('button', { name: 'OK' });
  await expect(confirmEmpty).toBeVisible();
  await confirmEmpty.click();

  // ---------- VERIFY TRASH EMPTY ----------
  await expect(page.locator('[id^="thumb_"]')).toHaveCount(0);

  /*// ---------- BACK TO MY DOCUMENTS (FIXED) ----------
  const myDocs = page
    .getByRole('listitem')
    .filter({ hasText: 'My Documents' });

  await expect(myDocs).toBeVisible();
  await myDocs.click();

  */// ---------- LOGOUT ----------
  const profileIcon = page.getByText('A', { exact: true });
  await expect(profileIcon).toBeVisible();
  await profileIcon.click();

  await Promise.all([
    page.waitForURL(/login/),
    page.getByRole('link', { name: /logout/i }).click()
  ]);

  await expect(page).toHaveURL(/login/);
});