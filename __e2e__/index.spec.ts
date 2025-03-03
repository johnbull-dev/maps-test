import { test, expect } from '@playwright/test';

test.describe('Mortgage Calculator page tests ', () => {
    const baseUrl = 'http://localhost:3000';
  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
  });

  test('should display the correct default values', async ({ page }) => {
    await expect(page.locator('#price')).toHaveValue('');
    await expect(page.locator('#deposit')).toHaveValue('');
    await expect(page.locator('#term')).toHaveValue('');
    await expect(page.locator('#interest-rate')).toHaveValue('5.25');
  });

  test('should calculate mortgage correctly', async ({ page }) => {
    await page.fill('#price', '200000');
    await page.fill('#deposit', '20000');
    await page.fill('#term', '30');
    await page.fill('#interest-rate', '3.5');
    await page.click('button[type="submit"]');

    // Add assertions for the results
    await expect(page.locator('text=Monthly Payment')).toBeVisible();
    await expect(page.locator('text=Total Repayment')).toBeVisible();
    await expect(page.locator('text=Capital')).toBeVisible();
    await expect(page.locator('text="Interest"')).toBeVisible();
    await expect(page.locator('text=Affordability Check')).toBeVisible();

    // Check that the results are correct
    await expect(page.locator('tr:has-text("Monthly Payment") td:last-child')).toHaveText('£808.28');
    await expect(page.locator('tr:has-text("Total Repayment") td:last-child')).toHaveText('£290,980.96');
    await expect(page.locator('tr:has-text("Capital") td:last-child')).toHaveText('£180,000.00');
    await expect(page.locator('tr:has-text("Interest") td:last-child')).toHaveText('£110,980.96');
    await expect(page.locator('tr:has-text("Affordability Check") td:last-child')).toHaveText('£1,137.72');
  });
}); 
