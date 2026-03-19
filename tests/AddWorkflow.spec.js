import { test, expect } from '@playwright/test';

test('Workflow Create → Edit → Delete → Logout', async ({ page }) => {

  const email = 'qrtest00@gmail.com';
  const password = 'adobetesting';

  const workflowName = 'Workflow_' + Date.now();
  const stepName = 'Level-1';
  const reviewer1 = 'test@yopmail.com';
  const reviewer2 = 'test1@yopmail.com';

  // ---------- LOGIN ----------
  await page.goto('https://app.quickreviewer.com/#/auth/login');

  await page.fill('#loginEmail', email);
  await page.fill('input[type="password"]', password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/dashboard|projects/i);

  // ---------- NAVIGATE ----------
  await page.getByRole('listitem').filter({ hasText: 'Workflow' }).click();

  const addWorkflowBtn = page.getByRole('button', { name: 'Add New Workflow' });
  await expect(addWorkflowBtn).toBeVisible();

  // ---------- CREATE ----------
  await addWorkflowBtn.click();

  await page.getByRole('textbox', { name: 'Workflow Name' }).fill(workflowName);
  await page.getByRole('textbox', { name: 'Step Name' }).fill(stepName);

  const reviewerBox = page.getByRole('combobox', { name: /Enter names/i });
  await reviewerBox.click();
  await reviewerBox.fill(reviewer1);
  await reviewerBox.press('Enter');

  await page.getByRole('button', { name: 'Save Workflow' }).click();

  const workflowRow = page.locator('tr', { hasText: workflowName });
  await expect(workflowRow).toBeVisible();

  // ---------- EDIT ----------
  await workflowRow.locator('.fe-edit-2').click();

  await reviewerBox.click();
  await reviewerBox.fill(reviewer2);
  await reviewerBox.press('Enter');

  await page.getByRole('button', { name: 'Save Workflow' }).click();

  await expect(workflowRow).toBeVisible();

  // ---------- DELETE ----------
  await workflowRow.locator('.fe-trash').click();
  await page.getByRole('button', { name: 'OK' }).click();

  await expect(workflowRow).not.toBeVisible();

});