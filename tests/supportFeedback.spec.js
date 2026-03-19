import { test, expect } from '@playwright/test';

test('Support Feedback Test', async ({ page }) => {

  await page.goto('https://app.quickreviewer.com/#/auth/login');

  console.log("Logging in...");

  // Login
  await page.fill('input[type="email"]', 'qrtest00@gmail.com');
  await page.fill('input[type="password"]', 'adobetesting');
  await page.click('button[type="submit"]');

  await page.waitForTimeout(2000);

  console.log("Opening Support / Feedback");

  // Open Support / Feedback
  await page.click('text=Support / Feedback');

  await page.waitForTimeout(3000);

  console.log("Filling subject and comment");

  await page.fill('input[placeholder="Subject"]', 'QuickReviewer Test QA');

  await page.fill(
    'textarea',
    'QuickReviewer Test QA QuickReviewer Test QA QuickReviewer Test QA'
  );

  await page.waitForTimeout(2000);

  console.log("Clicking Reset");

  const resetButton = page.locator('button:has-text("Reset")').first();
  await resetButton.scrollIntoViewIfNeeded();
  await resetButton.click();

  await page.waitForTimeout(2000);

  console.log("Filling again and sending");

  await page.fill('input[placeholder="Subject"]', 'QuickReviewer Test QA');

  await page.fill(
    'textarea',
    'QuickReviewer Test QA QuickReviewer Test QA QuickReviewer Test QA'
  );

  const sendButton = page.locator('button:has-text("Send")').first();
  await sendButton.scrollIntoViewIfNeeded();
  await sendButton.click();

  console.log("Support request sent");

  await page.waitForTimeout(5000);
});