import { test, expect } from '@playwright/test';

test('Team Member Add → Edit → Delete → Logout', async ({ page }) => {

  const email = 'qrtest00@gmail.com';
  const password = 'adobetesting';

  // Team email-id
    const teamEmail = `test@yopmail.com`;

  // ---------- LOGIN ----------
  await page.goto('https://app.quickreviewer.com/#/auth/login');

  await page.fill('#loginEmail', email);
  await page.fill('input[type="password"]', password);

  await Promise.all([
    page.waitForNavigation(),
    page.getByRole('button', { name: /login/i }).click()
  ]);

  // ---------- NAVIGATE ----------
  await page.locator('span.title', { hasText: 'Team' }).click();

  // ---------- ADD MEMBER ----------
  await page.getByRole('button', { name: 'Add New' }).click();

  const modal = page.locator('.ant-modal-content');
  await expect(modal).toBeVisible();

  // ---------- EMAIL ----------
  const emailInput = modal.getByRole('textbox', { name: /email/i });
  await emailInput.fill(teamEmail);

  // remove focus
  await modal.click({ position: { x: 5, y: 5 } });

  // ---------- SELECT ROLE (FINAL FIX) ----------
  const roleField = modal.locator('[formcontrolname="role"]');

  await expect(roleField).toBeVisible();

  // 🔥 double click ensures dropdown opens
  await roleField.click({ force: true });
  await roleField.click({ force: true });

  // select Reviewer (Playwright auto-waits)
  await page.getByText('Reviewer', { exact: true }).click();

  // ---------- SAVE ----------
  await modal.getByRole('button', { name: 'Save' }).click();

  // ---------- SEARCH ----------
  const searchBox = page.locator('input[name="searchItem"]');
  await expect(searchBox).toBeVisible();

  await searchBox.fill(teamEmail);
  await page.getByRole('button', { name: 'Search' }).click();

  const row = page.locator('tbody tr').filter({ hasText: teamEmail });
  await expect(row).toBeVisible();

  // ---------- EDIT ----------
  await row.hover();
  await row.locator('[class*="edit"]').first().click();

  const modalEdit = page.locator('.ant-modal-content');
  await expect(modalEdit).toBeVisible();

  await modalEdit.click({ position: { x: 5, y: 5 } });

  const roleFieldEdit = modalEdit.locator('[formcontrolname="role"]');

  await roleFieldEdit.click({ force: true });
  await roleFieldEdit.click({ force: true });

  await page.getByText('Team member', { exact: true }).click();

  await modalEdit.getByRole('button', { name: 'Save' }).click();

  await expect(row).toBeVisible();

  // ---------- DELETE ----------
  await row.hover();
  await row.locator('[class*="trash"]').first().click();

  await page.getByRole('button', { name: 'OK' }).click();

  await expect(row).toHaveCount(0);

  // ---------- LOGOUT ----------
  await page.getByText('A', { exact: true }).click();

  await Promise.all([
    page.waitForURL(/login/),
    page.getByRole('link', { name: /logout/i }).click()
  ]);

});