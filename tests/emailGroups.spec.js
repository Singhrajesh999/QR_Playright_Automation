import { test, expect } from '@playwright/test';

test('Email Group Create → Edit → Delete → Logout', async ({ page }) => {

  const email = 'qrtest00@gmail.com';
  const password = 'adobetesting';

  // 🔥 Dynamic name to avoid duplicate error
  const groupName = `Test_${Date.now()}`;
  const description = 'Clavis Group';
  const emails = ['test@yopmail.com', 'test1@yopmail.com'];

  // ---------- LOGIN ----------
  await page.goto('https://app.quickreviewer.com/#/auth/login');
  await expect(page).toHaveURL(/login/);

  await page.fill('#loginEmail', email);
  await page.fill('input[type="password"]', password);

  const loginBtn = page.getByRole('button', { name: 'Login' });
  await expect(loginBtn).toBeEnabled();
  await loginBtn.click();

  const profileIcon = page.getByText('A', { exact: true });
  await expect(profileIcon).toBeVisible();

  // ---------- NAVIGATION ----------
  const mailSettings = page.getByRole('listitem').filter({ hasText: 'Mail Settings' });
  await mailSettings.click();

  const emailGroupsTab = page.getByRole('tab', { name: 'Email Groups' });
  await expect(emailGroupsTab).toBeVisible();
  await emailGroupsTab.click();

  // ---------- CREATE GROUP ----------
  const newGroupBtn = page.getByRole('button', { name: 'New Group' });
  await newGroupBtn.click();

  const nameInput = page.getByRole('textbox', { name: /Name/i });
  const descInput = page.getByRole('textbox', { name: /Description/i });
  const emailInput = page.getByRole('combobox', { name: /Enter email address/i });

  await expect(nameInput).toBeVisible();

  await nameInput.fill(groupName);
  await descInput.fill(description);

  // Add emails
  for (const mail of emails) {
    await emailInput.fill(mail);
    await emailInput.press('Enter');
  }

  const saveBtn = page.getByRole('button', { name: 'Save' });
  await saveBtn.click();

  // ✅ Wait for table refresh
  const groupRow = page.locator('tr', { hasText: groupName }).first();
  await expect(groupRow).toBeVisible();

  // ---------- EDIT GROUP ----------
  const editBtn = groupRow.locator('.fe-edit-2');
  await expect(editBtn).toBeVisible();
  await editBtn.click();

  const emailInputEdit = page.getByRole('combobox', { name: /Enter email address/i });
  await expect(emailInputEdit).toBeVisible();

  await emailInputEdit.fill('test2@yopmail.com');
  await emailInputEdit.press('Enter');

  await saveBtn.click();

  // ✅ Assert updated email visible
  await expect(groupRow).toContainText('test2@yopmail.com');

  // ---------- DELETE GROUP ----------
  const deleteBtn = groupRow.locator('.fe-trash');
  await deleteBtn.click();

  const confirmBtn = page.getByRole('button', { name: 'OK' });
  await expect(confirmBtn).toBeVisible();
  await confirmBtn.click();

  // ✅ Wait for row to disappear
  await expect(groupRow).toBeHidden();

  // ---------- LOGOUT ----------
  await profileIcon.click();

  const logoutBtn = page.getByRole('link', { name: /logout/i });
  await logoutBtn.click();

  await expect(page).toHaveURL(/login/);

});