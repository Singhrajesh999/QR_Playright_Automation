import { test, expect } from '@playwright/test';

test('Template Create → Delete → Logout', async ({ page }) => {

  const email = 'qrtest00@gmail.com';
  const password = 'adobetesting';

  const templateName = `Template_${Date.now()}`;

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

  // ---------- NAVIGATION ----------
  const mailSettings = page.getByRole('listitem').filter({ hasText: 'Mail Settings' });
  await expect(mailSettings).toBeVisible();
  await mailSettings.click();

  const templatesTab = page.getByRole('tab', { name: 'Templates' });
  await expect(templatesTab).toBeVisible();
  await templatesTab.click();

  // ---------- CREATE TEMPLATE ----------
  const newTemplateBtn = page.getByRole('button', { name: 'New Template' });
  await expect(newTemplateBtn).toBeVisible();
  await newTemplateBtn.click();

  // Dropdown (Email functionality)
  const functionalityDropdown = page.locator('nz-select-top-control').filter({ hasText: 'Email functionality' });
  await expect(functionalityDropdown).toBeVisible();
  await functionalityDropdown.click();

  await page.getByText('File share', { exact: true }).click();

  // Template Name
  const nameInput = page.getByRole('textbox', { name: /Name for your template/i });
  await expect(nameInput).toBeVisible();
  await nameInput.fill(templateName);

  // Subject
  const subjectInput = page.getByRole('textbox', { name: /Subject/i });
  await subjectInput.click();

  // Insert dynamic fields
  await page.getByText('Document Title').click();
  await page.getByText('Share By').click();

  // ---------- IFRAME CONTENT ----------
  const editorFrame = page.frameLocator('iframe').nth(2);

  const notesSection = editorFrame.locator('#iylek table');
  await expect(notesSection).toBeVisible();

  await notesSection.click();

  // ---------- SAVE ----------
  const saveBtn = page.getByRole('button', { name: 'Save' });
  await expect(saveBtn).toBeEnabled();
  await saveBtn.click();

  // ---------- VERIFY CREATED ----------
  const row = page.locator('tbody tr').filter({ hasText: templateName });
  await expect(row).toBeVisible({ timeout: 10000 });

  // ---------- DELETE ----------
  await row.hover();

  const deleteBtn = row.locator('[class*="trash"]');
  await expect(deleteBtn).toBeVisible();
  await deleteBtn.click();

  const confirmBtn = page.getByRole('button', { name: 'OK' });
  await expect(confirmBtn).toBeVisible();
  await confirmBtn.click();

  await expect(row).toHaveCount(0);

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