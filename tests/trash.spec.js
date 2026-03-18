import { test, expect } from '@playwright/test';

test.describe('Trash Section Tests', () => {

  const email = 'qrtest00@gmail.com';
  const password = 'adobetesting';

  const files = ['sample.jpg', 'sample.png', 'sample.pdf', 'sample.zip'];

  // ---------- COMMON HELPERS ----------
  async function login(page) {
    await page.goto('https://app.quickreviewer.com/#/auth/login');
    await expect(page).toHaveURL(/login/);

    await page.fill('#loginEmail', email);
    await page.fill('input[type="password"]', password);

    const loginBtn = page.getByRole('button', { name: 'Login' });
    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();

    await expect(page.getByText('A')).toBeVisible();
  }

  async function goToMenu(page, menuName) {
    const menu = page.getByRole('menuitem', { name: menuName });
    await expect(menu).toBeVisible();
    await menu.click();
  }

  async function uploadFiles(page, fileList) {
    await page.getByRole('button', { name: 'New' }).click();

    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();

    await fileInput.setInputFiles(
      fileList.map(file => `./bulkData/${file}`)
    );
  }

  async function deleteFile(page, fileName) {
    const fileRow = page.locator(`text=${fileName}`).first();
    await expect(fileRow).toBeVisible();

    await fileRow.click({ button: 'right' });

    const removeOption = page.getByRole('menuitem', { name: 'Remove' });
    await expect(removeOption).toBeVisible();
    await removeOption.click();
  }

  async function openTrash(page) {
    await goToMenu(page, 'Trash');
    await expect(page.getByText(/trash/i)).toBeVisible();
  }

  // ---------- BEFORE EACH ----------
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  // ✅ 1. Verify Deleted Files in Trash
  test('Verify all deleted files in Trash', async ({ page }) => {

    await goToMenu(page, 'My Documents');

    await uploadFiles(page, files);

    // Delete all files
    for (const file of files) {
      await deleteFile(page, file);
    }

    await openTrash(page);

    const rows = page.locator('.file-row'); // update if needed
    await expect(rows).toHaveCount(files.length);
  });

  // ✅ 2. Restore File
  test('Restore file from Trash', async ({ page }) => {

    const file = 'sample.pdf';

    await goToMenu(page, 'My Documents');
    await uploadFiles(page, [file]);

    await deleteFile(page, file);

    await openTrash(page);

    const fileRow = page.locator(`text=${file}`);
    await fileRow.click({ button: 'right' });

    const restoreBtn = page.getByRole('menuitem', { name: 'Restore' });
    await expect(restoreBtn).toBeVisible();
    await restoreBtn.click();

    // Assert toast/message
    await expect(page.getByText(/restored/i)).toBeVisible();
  });

  // ✅ 3. Delete Forever
  test('Delete file forever from Trash', async ({ page }) => {

    const file = 'sample.pdf';

    await goToMenu(page, 'My Documents');
    await uploadFiles(page, [file]);

    await deleteFile(page, file);

    await openTrash(page);

    const fileRow = page.locator(`text=${file}`);
    await fileRow.click({ button: 'right' });

    const deleteForever = page.getByRole('menuitem', { name: 'Delete Forever' });
    await expect(deleteForever).toBeVisible();
    await deleteForever.click();

    const confirmBtn = page.getByRole('button', { name: 'OK' });
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click();

    await expect(page.getByText(file)).not.toBeVisible();
  });

  // ✅ 4. Empty Trash
  test('Delete all files from Trash', async ({ page }) => {

    const file = 'sample.pdf';

    await goToMenu(page, 'My Documents');
    await uploadFiles(page, [file]);

    await deleteFile(page, file);

    await openTrash(page);

    const emptyBtn = page.getByRole('button', { name: /empty/i });
    await expect(emptyBtn).toBeVisible();
    await emptyBtn.click();

    const confirmBtn = page.getByRole('button', { name: 'OK' });
    await confirmBtn.click();

    await expect(page.getByText(/no trash/i)).toBeVisible();
  });

});