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

  console.log("Step 1 → Logging in");

  // Enter credentials (same as login.js)
  await page.fill('input[type="email"]', 'qrtest00@gmail.com');
  await page.fill('input[type="password"]', 'adobetesting');

  await page.click('button[type="submit"]');

  // Wait for dashboard to load
  await page.waitForTimeout(5000);

  console.log("Step 2 → Attempting logout");

  // Try common logout text first, then fall back to other attempts
  try {
    await page.locator('text=Logout').first().click({ timeout: 3000 });
    console.log("Clicked 'Logout'");
  } catch (err1) {
    try {
      await page.locator('text=Sign out').first().click({ timeout: 3000 });
      console.log("Clicked 'Sign out'");
    } catch (err2) {
      // Try opening a profile/menu button and searching again
      try {
        const menuSelectors = [
          'button[aria-label="Account"]',
          'button[aria-label="User menu"]',
          'button[aria-label="Profile"]',
          'button:has(svg)'
        ];
        let clicked = false;
        for (const sel of menuSelectors) {
          try {
            await page.click(sel, { timeout: 2000 });
            await page.waitForTimeout(500);
            const logout = page.locator('text=Logout').first();
            if (await logout.count() > 0) {
              await logout.click();
              clicked = true;
              break;
            }
            const signout = page.locator('text=Sign out').first();
            if (await signout.count() > 0) {
              await signout.click();
              clicked = true;
              break;
            }
          } catch (__) {
            // ignore and continue
          }
        }
        if (!clicked) {
          // Final fallback: navigate to a common logout route
          await page.goto('https://app.quickreviewer.com/#/auth/logout');
          console.log('Navigated to logout route fallback');
        }
      } catch (err3) {
        console.error('Logout attempts failed:', err3);
      }
    }
  }

  await page.waitForTimeout(3000);

  console.log("Logout finished — closing browser");

  await browser.close();

})();
