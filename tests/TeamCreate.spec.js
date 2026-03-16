import { test, expect } from '@playwright/test';

test('Team Member Add → Edit → Delete → Logout', async ({ page }) => {

  const email = 'qrtest00@gmail.com';
  const password = 'adobetesting';
  const teamEmail = 'test@yopmail.com';

  // Open Login Page
  await page.goto('https://app.quickreviewer.com/#/auth/login');
  await expect(page).toHaveURL(/login/);

  // Login
  const emailInput = page.locator('#loginEmail');
  const passwordInput = page.locator('input[type="password"]');
  const loginBtn = page.getByRole('button', { name: 'Login' });

  await expect(emailInput).toBeVisible();
  await emailInput.fill(email);

  await expect(passwordInput).toBeVisible();
  await passwordInput.fill(password);

  await loginBtn.click();

  // Verify dashboard loaded
  const teamMenu = page.getByRole('listitem').filter({ hasText: 'Team' });
  await expect(teamMenu).toBeVisible();
  await teamMenu.click();

  // Add new team member
  const addNewBtn = page.getByRole('button', { name: 'Add New' });
  await expect(addNewBtn).toBeVisible();
  await addNewBtn.click();

  const emailTextbox = page.getByRole('textbox', { name: 'Email' });
  await emailTextbox.fill(teamEmail);
  await emailTextbox.press('Enter');

  // Select role
  const roleDropdown = page.locator('.ant-select-selection-search-input').first();
  await roleDropdown.click();

  await page.getByText('Reviewer', { exact: true }).click();

  // Save
  const saveBtn = page.getByRole('button', { name: 'Save' });
  await expect(saveBtn).toBeEnabled();
  await saveBtn.click();

  // Search created user
  const searchBox = page.getByRole('textbox', { name: 'Search' });
  await expect(searchBox).toBeVisible();
  await searchBox.fill(teamEmail);
  await searchBox.press('Enter');

  await page.getByRole('button', { name: 'Search' }).click();

  // Verify user exists
  await expect(page.getByText(teamEmail)).toBeVisible();

  // Edit team member
  const editBtn = page.locator('.fe-edit-2');
  await expect(editBtn).toBeVisible();
  await editBtn.click();

  // Change role
  const roleDropdownEdit = page.locator('.ant-select-selection-search-input').first();
  await roleDropdownEdit.click();

  await page.getByText('Team member', { exact: true }).click();

  await saveBtn.click();

  // Delete team member
  const deleteBtn = page.locator('.ant-table-cell .fe').nth(1);
  await expect(deleteBtn).toBeVisible();
  await deleteBtn.click();

  const confirmDelete = page.getByRole('button', { name: 'OK' });
  await confirmDelete.click();

  // Logout
  const profileIcon = page.getByText('A', { exact: true });
  await expect(profileIcon).toBeVisible();
  await profileIcon.click();

  const logoutBtn = page.getByRole('link', { name: /logout/i });
  await logoutBtn.click();

  // Verify logout success
  await expect(page).toHaveURL(/login/);

});