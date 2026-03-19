import { test, expect } from '@playwright/test';

test('Email Group Create → Edit → Delete → Logout', async ({ page }) => {

  const email = 'qrtest00@gmail.com';
  const password = 'adobetesting';

  const groupName = `Test_${Date.now()}`;
  const updatedEmail = 'test2@yopmail.com';
  const description = 'Clavis Group';
  const emails = ['test@yopmail.com', 'test1@yopmail.com'];

  // ---------- LOGIN ----------
  await page.goto('https://app.quickreviewer.com/#/auth/login');

  await page.fill('#loginEmail', email);
  await page.fill('input[type="password"]', password);

  await Promise.all([
    page.waitForNavigation(),
    page.getByRole('button', { name: /login/i }).click()
  ]);

  const profileIcon = page.locator('//span[text()="A"]');
  await expect(profileIcon).toBeVisible({ timeout: 10000 });

  // ---------- NAVIGATION ----------
  const mailSettings = page.locator('text=Mail Settings');
  await expect(mailSettings).toBeVisible({ timeout: 10000 });
  await mailSettings.click();

  const emailGroupsTab = page.locator('text=Email Groups');
  await expect(emailGroupsTab).toBeVisible({ timeout: 10000 });
  await emailGroupsTab.click();

  // ---------- CREATE GROUP ----------
  await page.getByRole('button', { name: /new group/i }).click();

  const nameInput = page.getByRole('textbox', { name: /name/i });
  const descInput = page.getByRole('textbox', { name: /description/i });
  const emailInput = page.getByRole('combobox', { name: /enter email/i });

  await nameInput.fill(groupName);
  await descInput.fill(description);

  for (const mail of emails) {
    await emailInput.fill(mail);
    await emailInput.press('Enter');
  }

  await page.getByRole('button', { name: /save/i }).click();

  // ---------- VERIFY CREATED ----------
  const groupRow = page.locator('tbody tr').filter({
    hasText: groupName
  });

  await expect(groupRow).toBeVisible({ timeout: 15000 });
  await expect(groupRow).toContainText(description);

  // ---------- EDIT GROUP ----------
  await groupRow.locator('[class*="edit"]').first().click();

  const emailInputEdit = page.getByRole('combobox', { name: /enter email/i });
  await expect(emailInputEdit).toBeVisible();

  await emailInputEdit.fill(updatedEmail);
  await emailInputEdit.press('Enter');

  await page.getByRole('button', { name: /save/i }).click();

  // ✅ Correct validation (email not visible in table)
  await expect(groupRow).toBeVisible();

  // 🔥 Strong validation → reopen & verify email
  await groupRow.locator('[class*="edit"]').first().click();
  await expect(page.getByText(updatedEmail)).toBeVisible();

  // Close modal (if needed)
  await page.keyboard.press('Escape');

  // ---------- DELETE GROUP ----------
  await groupRow.locator('[class*="trash"]').first().click();

  const confirmBtn = page.getByRole('button', { name: /ok/i });
  await expect(confirmBtn).toBeVisible();
  await confirmBtn.click();

  // ---------- VERIFY DELETE ----------
  await expect(groupRow).toHaveCount(0, { timeout: 10000 });

  // ---------- LOGOUT ----------
  await profileIcon.click();

  await Promise.all([
    page.waitForURL(/login/),
    page.getByRole('link', { name: /logout/i }).click()
  ]);

  await expect(page).toHaveURL(/login/);
});