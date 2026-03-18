import { test, expect } from '@playwright/test';
import { fillIfDifferent, checkIfNotChecked } from '../utils/formUtils';

test('Reusable Profile Update Flow', async ({ page }) => {

  const data = {
    firstName: 'Automations',
    lastName: 'Tests',
    designation: 'QAE',
    company: 'Clavis'
  };

  await page.goto('https://app.quickreviewer.com/#/auth/login');

  await page.fill('#loginEmail', 'qrtest00@gmail.com');
  await page.fill('input[type="password"]', 'adobetesting');
  await page.getByRole('button', { name: 'Login' }).click();

  const profileIcon = page.getByText('A', { exact: true });
  await profileIcon.click();
  await page.getByRole('link', { name: 'My Profile' }).click();

  // ---------- PROFILE ----------
  await page.locator('[class*="pencil"]').first().click();

  await fillIfDifferent(page.getByRole('textbox', { name: 'First Name' }), data.firstName);
  await fillIfDifferent(page.getByRole('textbox', { name: 'Last Name' }), data.lastName);
  await fillIfDifferent(page.getByRole('textbox', { name: 'Designation' }), data.designation);
  await fillIfDifferent(page.getByRole('textbox', { name: 'Company Name' }), data.company);

  await page.getByRole('button', { name: 'Save' }).click();

  // ---------- PREFERENCES ----------
  await page.getByText('User Preferences').click();
  await page.locator('[class*="pencil"]').first().click();

  await checkIfNotChecked(page.getByRole('checkbox', { name: /commenters/i }));
  await checkIfNotChecked(page.getByRole('checkbox', { name: /reviewers to delete/i }));

  await page.getByRole('button', { name: 'Save' }).click();

});