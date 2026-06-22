import { test, expect } from '@playwright/test';

/**
 * Critical path: a visitor completes the estimator and submits a lead.
 * Runs against demo mode (no DB needed) — the lead persists in memory and the
 * thank-you page shows the computed range.
 */
test('completes the estimator funnel and lands on thank-you with an estimate', async ({ page }) => {
  await page.goto('/estimate');

  // Anchor with ^ so "Pickleball" doesn't also match "Multi-sport Pickleball + hoops".
  await page.getByRole('button', { name: /^Pickleball/ }).click();
  await page.getByRole('button', { name: /30 × 60/ }).click();
  await page.getByRole('button', { name: /Existing concrete/ }).click();

  // Now on the details step; the estimate band should be visible.
  await expect(page.getByText(/Your estimated range/i)).toBeVisible();

  await page.getByLabel('Full name').fill('Test Homeowner');
  await page.getByLabel('Phone').fill('801-555-0142');

  await page.getByRole('button', { name: /Get my estimate/i }).click();

  await expect(page).toHaveURL(/\/thank-you/);
  await expect(page.getByText(/Thanks, Test/i)).toBeVisible();
  await expect(page.getByText(/Your estimated range/i)).toBeVisible();
});

test('shows validation errors when contact details are missing', async ({ page }) => {
  await page.goto('/estimate');
  await page.getByRole('button', { name: /Multi-sport/ }).click();
  await page.getByRole('button', { name: /44 × 88/ }).click();
  await page.getByRole('button', { name: /Grass or dirt/ }).click();

  await page.getByRole('button', { name: /Get my estimate/i }).click();
  await expect(page.getByText(/Please enter your name/i)).toBeVisible();
});
