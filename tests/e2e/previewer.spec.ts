import { test, expect } from '@playwright/test';
import { makePng } from './_fixtures';

/**
 * Critical path: a visitor uploads a yard photo, the previewer renders a court
 * (demo/mock provider returns a sample), and the before/after reveal + lead form
 * appear. Then the lead is captured.
 */
test('uploads a photo, renders a court, and captures a lead', async ({ page }) => {
  await page.goto('/preview');

  // Pick a court type.
  await page.getByRole('button', { name: /Basketball/ }).click();

  // Upload a real, decodable PNG via the hidden file input.
  await page.locator('input[type="file"]').setInputFiles({
    name: 'yard.png',
    mimeType: 'image/png',
    buffer: makePng(64),
  });

  // The "Generate" button appears once the image is processed client-side.
  const generate = page.getByRole('button', { name: /Generate my court preview/i });
  await expect(generate).toBeVisible({ timeout: 15_000 });
  await generate.click();

  // Rendering state, then the reveal slider + lead form.
  await expect(page.getByText(/Love it\?|hand-rendered/i)).toBeVisible({ timeout: 60_000 });

  // Capture the lead from whichever form rendered (success or fallback).
  await page.getByLabel('Full name').fill('Preview Tester');
  await page.getByLabel('Phone').fill('801-555-0199');
  await page.getByRole('button', { name: /Send me my design|Send/i }).click();

  await expect(page).toHaveURL(/\/thank-you/);
});
