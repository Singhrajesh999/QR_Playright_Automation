const { chromium } = require('playwright');

(async () => {

  // Launch Chrome
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome'
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Open QuickReviewer login
  await page.goto('https://app.quickreviewer.com/#/auth/login');

  console.log("Logging in...");

  // Login
  await page.fill('input[type="email"]', 'qrtest00@gmail.com');
  await page.fill('input[type="password"]', 'adobetesting');
  await page.click('button[type="submit"]');

  // Wait dashboard load
  await page.waitForTimeout(2000);

  console.log("Opening Support / Feedback");

  // ---- Open Support / Feedback from sidebar ----
  await page.click('text=Support / Feedback');

  await page.waitForTimeout(3000);

  // ---- STEP 1: Fill both fields ----
  console.log("Filling subject and comment");

  await page.fill('input[placeholder="Subject"]', 'QuickReviewer Test QA');

  await page.fill('textarea', 'QuickReviewer Test QA QuickReviewer Test QA QuickReviewer Test QA');

  await page.waitForTimeout(3000);

  // ---- Click Reset ----
  console.log("Clicking Reset");

  // Wait for Reset button and ensure it's visible and clickable
  const resetButton = page.locator('button:has-text("Reset")').first();
  await resetButton.scrollIntoViewIfNeeded();
  await resetButton.waitFor({ state: 'visible' });
  await resetButton.click();

  await page.waitForTimeout(3000);

  // ---- STEP 2: Fill again ----
  console.log("Filling again and sending");

  await page.fill('input[placeholder="Subject"]', 'QuickReviewer Test QA');

  await page.fill('textarea', 'QuickReviewer Test QA QuickReviewer Test QA QuickReviewer Test QA ');

  // ---- Click Send ----
  const sendButton = page.locator('button:has-text("Send")').first();
  await sendButton.scrollIntoViewIfNeeded();
  await sendButton.waitFor({ state: 'visible' });
  await sendButton.click();

  console.log("Support request sent");

  await page.waitForTimeout(5000);

  await browser.close();

})();