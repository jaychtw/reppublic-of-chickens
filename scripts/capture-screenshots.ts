import { chromium, devices, expect, type Page } from '@playwright/test';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { MEALS, SAVE_KEY } from '../src/core';
import { en, zh } from '../src/i18n';

// Capture the running game through actual play, including a genuine earned unlock.
// Run against npm run preview after building; this does not deploy anything.
const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH ||
    (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
  args: ['--no-sandbox'],
});
await mkdir('docs/screenshots', { recursive: true });
const desktop = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: 'reduce',
});
const page = await desktop.newPage();
const url = process.env.GAME_URL || 'http://127.0.0.1:4173';
const shot = async (page: Page, file: string) => {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: `docs/screenshots/${file}.png`, fullPage: true });
};
const home = async (page: Page, label: string) => {
  await page.getByRole('button', { name: label, exact: true }).last().click();
};
try {
  await page.goto(url);
  await shot(page, 'overview-desktop');
  await page.getByTestId('enter-town').click();
  await shot(page, 'town-desktop');
  await page.getByRole('button', { name: en.skip, exact: true }).click();
  await home(page, en.back);
  await page.getByTestId('enter-mess').click();
  const foods = [en.grain, en.vegetables, en.protein],
    groups = [en.group0, en.group1, en.group2];
  for (let g = 0; g < 3; g++)
    for (let f = 0; f < 3; f++)
      for (let n = 0; n < MEALS[0].solution[g][f]; n++)
        await page
          .getByRole('button', { name: `${en.add} ${foods[f]} · ${groups[g]}`, exact: true })
          .click();
  await page.getByRole('button', { name: en.serve, exact: true }).click();
  await shot(page, 'mess-desktop');
  await home(page, en.back);
  await page.getByTestId('enter-social').click();
  await page.getByRole('button', { name: en.start, exact: true }).click();
  const deck = await page
    .locator('.memory-card')
    .evaluateAll((cards) => cards.map((c) => Number(c.getAttribute('data-citizen'))));
  await shot(page, 'social-desktop');
  await expect(page.getByTestId('card-0')).toBeEnabled();
  for (let c = 0; c < 8; c++) {
    const pair = deck.flatMap((id, i) => (id === c ? [i] : []));
    for (const i of pair) await page.getByTestId(`card-${i}`).click();
  }
  await home(page, en.back);
  await page.getByTestId('enter-residential').click();
  for (let i = 0; i < 8; i++) {
    await page.getByTestId(`issue-${i}`).click();
    await page.getByTestId('repair-action').click();
    await page.getByTestId('repair-action').click();
  }
  await shot(page, 'residential-desktop');
  await home(page, en.back);
  await page.getByTestId('enter-welfare').click();
  await page.getByTestId('patient-0').click();
  await shot(page, 'welfare-desktop');
  for (let i = 0; i < 5; i++) {
    await page.getByTestId(`patient-${i}`).click();
    await page.getByTestId(`treatment-${i}`).click();
  }
  await home(page, en.back);
  await expect(page.getByTestId('hall-checks')).toHaveText('5/5');
  await shot(page, 'republic-complete-desktop');
  await page.getByTestId('enter-ending').click();
  await shot(page, 'crossroads-desktop');
  await page.getByRole('button', { name: en.keep, exact: true }).click();
  await shot(page, 'epilogue-desktop');
  await page
    .locator('.ending-scene')
    .getByRole('button', { name: en.continue, exact: true })
    .click();
  await page.getByRole('button', { name: '繁體中文', exact: true }).click();
  const backup = await page.evaluate((key) => localStorage.getItem(key)!, SAVE_KEY);
  const mobile = await browser.newContext({ ...devices['Pixel 5'], reducedMotion: 'reduce' });
  const phone = await mobile.newPage();
  await phone.goto(url);
  await phone.getByRole('button', { name: en.save, exact: true }).click();
  await phone
    .locator('input[type=file]')
    .setInputFiles({
      name: 'earned-progress.json',
      mimeType: 'application/json',
      buffer: Buffer.from(backup),
    });
  await phone.getByRole('button', { name: en.replace, exact: true }).click();
  await phone.getByRole('button', { name: zh.close, exact: true }).click();
  await shot(phone, 'overview-phone-zh-TW');
  for (const hall of ['town', 'mess', 'social', 'residential', 'welfare'] as const) {
    await phone.getByTestId(`enter-${hall}`).click();
    if (hall === 'town') await phone.getByRole('button', { name: zh.replay, exact: true }).click();
    if (hall === 'social') await phone.getByRole('button', { name: zh.start, exact: true }).click();
    await shot(phone, `${hall}-phone-zh-TW`);
    await home(phone, zh.back);
  }
  await phone.getByTestId('enter-ending').click();
  await shot(phone, 'crossroads-phone-zh-TW');
  console.log(
    'Captured 16 actual gameplay screenshots; the crossroads was unlocked through real play.',
  );
} finally {
  await browser.close();
}
