const { chromium } = require('playwright');

(async () => {

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300
  });

  const page = await browser.newPage();

  // Login
  await page.goto('https://app.quickreviewer.com/#/auth/login');

  await page.fill('input[type="email"]', 'qrtest00@gmail.com');
  await page.fill('input[type="password"]', 'adobetesting');
  await page.click('button[type="submit"]');

  await page.waitForSelector('text=Status', { timeout: 15000 });

  // Open Status
  await page.click('text=Status');

  // Click New Status
  await page.locator('button:has-text("New Status")').click();

  // ⭐ WAIT FOR MODAL (IMPORTANT FIX)
  const modal = page.locator('text=Add Status').locator('..');
  await modal.waitFor({ state: 'visible' });

  console.log("Modal opened — filling form");

  // -------- NAME FIELD --------
  const nameField = page.getByPlaceholder('Name (maximum length 20)');
  await nameField.waitFor();
  await nameField.click();
  await nameField.fill('Rajesh QR Test');

  // -------- DESCRIPTION FIELD --------
  const descField = page.getByPlaceholder('Description (maximum length 100)');
  await descField.click();
  await descField.fill('Clavis Teach');

  // -------- RADIO BUTTON --------
  // label click (radio hidden hota hai normally)
  await page.getByText('Set as this status in proofing window').click();

  // -------- SAVE --------
  const saveBtn = page.locator('button:has-text("Save")');

  await saveBtn.waitFor({ state: 'visible' });

  // wait until enabled
  await page.waitForFunction(
    btn => !btn.disabled,
    await saveBtn.elementHandle()
  );

  await saveBtn.click();

  // success wait
  await page.waitForTimeout(4000);

  console.log("Status created successfully ✅");

  await browser.close();

})();