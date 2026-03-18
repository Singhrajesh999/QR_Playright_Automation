export async function fillIfDifferent(locator, value) {
    const currentValue = await locator.inputValue();
    if (currentValue !== value) {
      await locator.fill('');
      await locator.fill(value);
    }
  }
  
  export async function checkIfNotChecked(locator) {
    if (!(await locator.isChecked())) {
      await locator.check();
    }
  }