import { test, expect } from '@playwright/test';

/**
 * Critical path: a visitor opens the "Free estimate" modal from the header and
 * submits a lead. Runs in demo mode (no DB needed); the modal shows success.
 */
test('header free-estimate modal captures a lead', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Get a Quote Here!' }).first().click();

  const dialog = page.getByRole('dialog', { name: /quote/i });
  await expect(dialog).toBeVisible();

  await dialog.getByLabel('Full name').fill('Test Homeowner');
  await dialog.getByLabel('Phone').fill('801-555-0142');
  await dialog.getByRole('button', { name: /Request my free quote/i }).click();

  await expect(page.getByText(/Your request is in/i)).toBeVisible();
});

test('validation blocks an empty estimate submission', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Get a Quote Here!' }).first().click();
  const dialog = page.getByRole('dialog', { name: /quote/i });
  await dialog.getByRole('button', { name: /Request my free quote/i }).click();
  await expect(dialog.getByText(/add your name and a phone number or email/i)).toBeVisible();
});
