import { test, expect } from '@playwright/test';

test('should log manual page break insertion and height calculation', async ({ page }) => {
  const consoleMessages: string[] = [];

  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error' || type === 'warning') {
      console.error(`[${type.toUpperCase()}] ${text}`);
    } else {
      console.log(`[${type.toUpperCase()}] ${text}`);
    }

    if (type === 'log') {
      consoleMessages.push(text);
    }
  });

  page.on('pageerror', (err) => {
    console.error('PAGE ERROR (uncaught):', err.message);
    if (err.stack) {
      const stackLines = err.stack.split('\n');
      const partialStack = stackLines.slice(0, 3).join('\n');
      console.error('Partial stack:', partialStack);
    }
  });

  await page.goto('/');

  // Wait for toolbar to load
  await page.waitForSelector('[title="Toggle Manual Page Break (Ctrl+Enter)"]');

  // Click the manual page break button to insert it

  await page.getByText('The standard chunk of Lorem').click();
  await page.locator('#editor div').filter({ hasText: 'Page Made with ❤️ by RomikHeader LeftHeader RightPage Made with ❤️ by' }).first().press('ControlOrMeta+End');
  await page.getByRole('button', { name: 'Toggle Manual Page Break (' }).click();
  await page.locator('.manual-page-break-node').click();
  await page.locator('#editor div').filter({ hasText: 'Page Made with ❤️ by RomikHeader LeftHeader RightPage Made with ❤️ by' }).first().press('ArrowRight');
  await page.locator('#editor div').filter({ hasText: 'Page Made with ❤️ by RomikHeader LeftHeader RightPage Made with ❤️ by' }).first().press('ArrowRight');
  await page.locator('#editor div').filter({ hasText: 'Page Made with ❤️ by RomikHeader LeftHeader RightPage Made with ❤️ by' }).first().press('ArrowDown');
  await page.locator('#editor div').filter({ hasText: 'Page Made with ❤️ by RomikHeader LeftHeader RightPage Made with ❤️ by' }).first().press('ArrowRight');
  await page.locator('#editor div').filter({ hasText: 'Page Made with ❤️ by RomikHeader LeftHeader RightPage Made with ❤️ by' }).first().press('ArrowDown');


  // Wait for reflow and logs to process
  await page.waitForTimeout(1000);

  // Assert specific logs from manual-page-break.ts
  expect(consoleMessages.some(msg => msg.includes('🔄 [ManualPageBreak] Trigger reflow for all manual breaks...'))).toBe(true);
  expect(consoleMessages.some(msg => msg.includes('🔍 [ManualPageBreak] Starting height calculation (per-element)...'))).toBe(true);
  expect(consoleMessages.some(msg => msg.includes('✅ [ManualPageBreak] Final calculated height:'))).toBe(true);
});