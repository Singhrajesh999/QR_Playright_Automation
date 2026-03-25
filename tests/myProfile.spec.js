import { test, expect } from '@playwright/test';
import { fillIfDifferent, checkIfNotChecked } from '../utils/formUtils';

test('Reusable Profile Update Flow', async ({ page }) => {

  const data = {
    firstName: 'Automations',
    lastName: 'Tests',
    designation: 'QAE',
    company: 'Clavis'
  };

  // ---------- LOGIN ----------
  await page.goto('https://app.quickreviewer.com/#/auth/login', {
    waitUntil: 'domcontentloaded'
  });

  await expect(page).toHaveURL(/login/);

  await page.fill('#loginEmail', 'qrtest00@gmail.com');
  await page.fill('input[type="password"]', 'adobetesting');

  await Promise.all([
    page.waitForNavigation(),
    page.getByRole('button', { name: /login/i }).click()
  ]);

  // ---------- NAVIGATE TO PROFILE ----------
  const profileIcon = page.getByText('A', { exact: true });
  await expect(profileIcon).toBeVisible();
  await profileIcon.click();

  const myProfile = page.getByRole('link', { name: 'My Profile' });
  await expect(myProfile).toBeVisible();
  await myProfile.click();

  // ---------- CLICK EDIT (Profile Information) ----------
  const editBtn = page
    .locator('h3:has-text("Profile Information") >> svg')
    .last();

  await expect(editBtn).toBeVisible();
  await editBtn.click();

  // ---------- UPDATE PROFILE ----------
  await fillIfDifferent(page.getByRole('textbox', { name: 'First Name' }), data.firstName);
  await fillIfDifferent(page.getByRole('textbox', { name: 'Last Name' }), data.lastName);
  await fillIfDifferent(page.getByRole('textbox', { name: 'Designation' }), data.designation);
  await fillIfDifferent(page.getByRole('textbox', { name: 'Company Name' }), data.company);

  const saveBtn = page.getByRole('button', { name: 'Save' });
  await expect(saveBtn).toBeEnabled();
  await saveBtn.click();

  // ---------- USER PREFERENCES ----------
  const preferencesTab = page.getByText('User Preferences');
  await expect(preferencesTab).toBeVisible();
  await preferencesTab.click();

  const editPrefBtn = page
    .locator('text=User Preferences')
    .locator('..')
    .locator('svg')
    .last();

  await expect(editPrefBtn).toBeVisible();
  await editPrefBtn.click();

  await checkIfNotChecked(page.getByRole('checkbox', { name: /commenters/i }));
  await checkIfNotChecked(page.getByRole('checkbox', { name: /reviewers to delete/i }));

  const savePrefBtn = page.getByRole('button', { name: 'Save' });
  await expect(savePrefBtn).toBeEnabled();
  await savePrefBtn.click();

  // ---------- LOGOUT ----------
  await profileIcon.click();

  await Promise.all([
    page.waitForURL(/login/),
    page.getByRole('link', { name: /logout/i }).click()
  ]);

  await expect(page).toHaveURL(/login/);

});