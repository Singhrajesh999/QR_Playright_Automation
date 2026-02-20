const { chromium } = require('playwright');

(async () => {
  // Launch Chrome browser
  const browser = await chromium.launch({
    headless: false, // shows browser UI
    channel: 'chrome' // opens Google Chrome instead of default Chromium
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Open QuickReviewer login page
  await page.goto('https://app.quickreviewer.com/#/auth/login');

  // Enter Email
  await page.fill('input[type="email"]', 'qrtest00@gmail.com');

  // Enter Password
  await page.fill('input[type="password"]', 'adobetesting');

  // Click Login button
  await page.click('button[type="submit"]');

  // Wait for dashboard or next page to load
  await page.waitForTimeout(5000);

  console.log("Login attempted successfully!");

  // Close browser (optional)
  // await browser.close();
})();