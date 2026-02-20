const { chromium } = require('playwright');

(async () => {

  // Launch Chrome browser
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome'
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Open QuickReviewer login page
  await page.goto('https://app.quickreviewer.com/#/auth/login');

  console.log("Step 1 → Blank login attempt");

  // ✅ STEP 1: Click login with blank fields
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  console.log("Step 2 → Wrong password login attempt");

  // ✅ STEP 2: Enter email + wrong password
  await page.fill('input[type="email"]', 'qrtest00@gmail.com');
  await page.fill('input[type="password"]', 'wrongpassword123');

  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  console.log("Step 3 → Correct login attempt");

  // Clear password field
  await page.fill('input[type="password"]', '');

  // ✅ STEP 3: Enter correct password
  await page.fill('input[type="password"]', 'adobetesting');

  await page.click('button[type="submit"]');

  // Wait for login success / dashboard load
  await page.waitForTimeout(5000);

  console.log("Login successful → Closing tab");

  // Close tab (page)
  await page.close();

  // Close browser
  await browser.close();

})();