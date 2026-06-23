import { test, expect } from '@playwright/test';

/**
 * Critical path: a visitor uses the Backyard Previewer on a sample yard, the 3D
 * court is placed into the photo, and they send the design to GRIT as a lead.
 */
test('previewer places a court on the sample yard and captures a lead', async ({ page }) => {
  await page.goto('/preview');

  // Use the built-in sample yard (no upload / consent needed for the sample).
  await page.getByRole('button', { name: /Try it on a sample yard/i }).click();

  // After the placement animation, the result controls + estimate appear.
  const send = page.getByRole('button', { name: /Send this to GRIT/i });
  await expect(send).toBeVisible({ timeout: 15_000 });
  await send.click();

  const dialog = page.getByRole('dialog', { name: /estimate/i });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('Full name').fill('Preview Tester');
  await dialog.getByLabel('Phone').fill('801-555-0199');
  await dialog.getByRole('button', { name: /Send me this estimate/i }).click();

  await expect(page.getByText(/Your estimate is on its way/i)).toBeVisible();
});
