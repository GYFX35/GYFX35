const { test, expect } = require('@playwright/test');

test('homepage has United Nations Data section', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Wait for the specific text to appear in the element, indicating data has loaded.
  const unDataSection = page.locator('#un-data');
  await expect(unDataSection).toContainText('Refugees:', { timeout: 15000 });

  // Take a screenshot with a new name to avoid caching issues.
  await page.screenshot({ path: 'test-results/un-api-integration-verified.png' });
});
