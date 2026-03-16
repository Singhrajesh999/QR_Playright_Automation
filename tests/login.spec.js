import { test, expect } from '@playwright/test';

test('Login validation scenarios', async ({ page }) => {

  // Open QuickReviewer login page
  await page.goto('https://app.quickreviewer.com/#/auth/login');

  console.log("Step 1 → Blank login attempt");

  // STEP 1: Blank login
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(2000);

  console.log("Step 2 → Wrong password login attempt");

  // STEP 2: Wrong password
  await page.locator('input[type="email"]').fill('qrtest00@gmail.com');
  await page.locator('input[type="password"]').fill('wrongpassword123');

  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(2000);

  console.log("Step 3 → Correct login attempt");

  // Clear password
  await page.locator('input[type="password"]').fill('');

  // Correct password
  await page.locator('input[type="password"]').fill('adobetesting');

  await page.locator('button[type="submit"]').click();

  // Wait for dashboard or successful login
  await page.waitForLoadState('networkidle');

});