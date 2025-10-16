import { expect, test } from '@playwright/test';

test.describe('Flappy Bird gameplay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('starts the game when the flap control is used', async ({ page }) => {
    await page.getByRole('button', { name: /tap \/ flap/i }).click();

    await expect(page.getByRole('button', { name: /pause/i })).toBeVisible();
    await expect(page.getByText(/Score 0/)).toBeVisible();
  });

  test('detects collisions and offers a restart option', async ({ page }) => {
    await page.getByRole('button', { name: /^start$/i }).click();

    await page.waitForSelector('text=Restart run', { timeout: 10000 });
    await expect(page.getByText(/Game over/i)).toBeVisible();
  });

  test('increments the score after clearing pipes', async ({ page }) => {
    await page.getByRole('button', { name: /tap \/ flap/i }).click();

    await page.waitForTimeout(500);
    for (let i = 0; i < 40; i += 1) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(150);
    }

    await page.waitForFunction(() => {
      const scoreBadge = Array.from(document.querySelectorAll('span')).find((element) =>
        element.textContent?.trim().startsWith('Score')
      );
      if (!scoreBadge) return false;
      const digits = scoreBadge.textContent?.replace(/[^0-9]/g, '') ?? '';
      return Number(digits) >= 1;
    }, { timeout: 20000 });

    const scoreText = await page.locator('span', { hasText: 'Score' }).first().textContent();
    expect(scoreText).toBeTruthy();
  });
});
