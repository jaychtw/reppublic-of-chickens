import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { MEALS, SAVE_KEY } from '../../src/core';
import { en, zh, local, treatments } from '../../src/i18n';

async function home(page: Page, copy = en as Record<keyof typeof en, string>) {
  await page.getByRole('button', { name: copy.back, exact: true }).last().click();
  await expect(page.getByTestId('hall-checks')).toBeVisible();
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
async function solveMeal(page: Page, copy: Record<keyof typeof en, string>, round = 0) {
  const food = [copy.grain, copy.vegetables, copy.protein];
  const groups = [copy.group0, copy.group1, copy.group2];
  for (let g = 0; g < 3; g++)
    for (let f = 0; f < 3; f++)
      for (let n = 0; n < MEALS[round].solution[g][f]; n++) {
        await page
          .getByRole('button', { name: `${copy.add} ${food[f]} · ${groups[g]}`, exact: true })
          .click();
      }
  await page.getByRole('button', { name: copy.serve, exact: true }).click();
  await expect(page.getByTestId('round-result')).toContainText('100');
}
async function solveMemory(page: Page, copy: Record<keyof typeof en, string>) {
  await page.getByRole('button', { name: copy.start, exact: true }).click();
  const deck = await page
    .locator('.memory-card')
    .evaluateAll((cards) => cards.map((c) => Number(c.getAttribute('data-citizen'))));
  expect(deck).toHaveLength(16);
  for (let i = 0; i < 8; i++) expect(deck.filter((x) => x === i)).toHaveLength(2);
  await expect(page.getByTestId('card-0')).toBeEnabled({ timeout: 6000 });
  const first = 0,
    second = deck.findIndex((x) => x !== deck[first]);
  await page.getByTestId(`card-${first}`).click();
  await page.getByTestId(`card-${second}`).click();
  const third = [0, 1, 2, 3].find((i) => i !== first && i !== second)!;
  await expect(page.getByTestId(`card-${third}`)).toBeDisabled();
  await expect(page.getByTestId(`card-${third}`)).toBeEnabled();
  for (let citizen = 0; citizen < 8; citizen++) {
    const indices = deck.flatMap((x, i) => (x === citizen ? [i] : []));
    await page.getByTestId(`card-${indices[0]}`).click();
    await page.getByTestId(`card-${indices[1]}`).click();
  }
  await expect(page.getByTestId('round-result')).toContainText('100');
  await expect(page.getByTestId('attempt-count')).toHaveText('9');
}

for (const language of ['en', 'zh-TW'] as const) {
  test(`Complete republic journey in ${language}: five real activities, unlock, both endings, continued play`, async ({
    page,
  }, info) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const copy = language === 'en' ? en : zh;
    await page.goto('/');
    if (language === 'zh-TW')
      await page.getByRole('button', { name: '繁體中文', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page.getByTestId('enter-ending')).toBeDisabled();
    await page.getByTestId('enter-town').click();
    await page.getByRole('button', { name: copy.transcript, exact: true }).click();
    await page.getByRole('region', { name: copy.transcript, exact: true }).evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await expect(page.locator('.completion-note').first()).toBeVisible();
    await home(page, copy);
    await expect(page.getByTestId('hall-checks')).toHaveText('1/5');
    await page.getByTestId('enter-mess').click();
    await solveMeal(page, copy);
    await page.screenshot({ path: info.outputPath('mess-completed.png'), fullPage: true });
    await home(page, copy);
    await expect(page.getByTestId('satisfaction')).toHaveText('25%');
    await page.getByTestId('enter-social').click();
    await solveMemory(page, copy);
    await home(page, copy);
    await page.getByTestId('enter-residential').click();
    for (let issue = 0; issue < 8; issue++) {
      await page.getByTestId(`issue-${issue}`).click();
      await page.getByTestId('repair-action').click();
      await page.getByTestId('repair-action').click();
    }
    await expect(page.getByTestId('condition-score')).toHaveText('80%');
    await page.reload();
    await expect(page.getByTestId('condition-score')).toHaveText('80%');
    await expect(page.getByTestId('issue-0')).toBeDisabled();
    await expect(page.getByTestId('issue-8')).toBeEnabled();
    await home(page, copy);
    await expect(page.getByTestId('hall-checks')).toHaveText('4/5');
    await page.getByTestId('enter-welfare').click();
    await page.getByTestId('patient-0').click();
    await page.getByTestId('treatment-1').click();
    await expect(page.getByRole('status')).toContainText(copy.wrong);
    await expect(page.getByRole('status')).toContainText(local(treatments[0].detail, language));
    await page.getByTestId('treatment-0').click();
    for (let patient = 1; patient < 5; patient++) {
      await page.getByTestId(`patient-${patient}`).click();
      await page.getByTestId(`treatment-${patient}`).click();
    }
    await expect(page.getByTestId('round-result')).toContainText('80');
    await home(page, copy);
    await expect(page.getByTestId('hall-checks')).toHaveText('5/5');
    await expect(page.getByTestId('satisfaction')).toHaveText('90%');
    await page.getByTestId('enter-ending').click();
    await expect(page.getByRole('heading', { name: copy.prompt, exact: true })).toBeVisible();
    await expect(page.locator('.ending-choices button')).toHaveCount(2);
    await expect(page.getByTestId('governor-line')).toHaveCount(0);
    await page.getByRole('button', { name: copy.keep, exact: true }).click();
    await expect(page.getByTestId('governor-line')).toHaveText(`“${copy.keepLine}”`);
    await expect(page.getByText(copy.epilogue, { exact: true })).toBeVisible();
    await page
      .locator('.ending-scene')
      .getByRole('button', { name: copy.continue, exact: true })
      .click();
    await expect(page.getByTestId('hall-checks')).toHaveText('5/5');
    await page.getByTestId('enter-ending').click();
    await page.getByRole('button', { name: copy.road, exact: true }).click();
    await expect(page.getByTestId('governor-line')).toHaveText(`“${copy.roadLine}”`);
    await page
      .locator('.ending-scene')
      .getByRole('button', { name: copy.continue, exact: true })
      .click();
    await page.reload();
    await expect(page.getByTestId('hall-checks')).toHaveText('5/5');
    const persisted = await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!),
      SAVE_KEY,
    );
    expect(persisted.ending).toEqual({ choice: 'road', seen: true });
    await page.getByTestId('enter-mess').click();
    await page.getByRole('button', { name: copy.serve, exact: true }).click();
    await expect(page.getByTestId('round-result')).toContainText('0');
    await home(page, copy);
    await expect(page.getByTestId('satisfaction')).toHaveText('65%');
    await expect(page.getByTestId('hall-checks')).toHaveText('5/5');
    await noOverflow(page);
    expect(errors).toEqual([]);
  });
}

test('Town Hall keeps exact position, supports resume, pause, replay, previous and skip', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('/#/town');
  for (let n = 0; n < 4; n++)
    await page.getByRole('button', { name: en.next, exact: true }).click();
  const line = await page.getByTestId('debate-line').textContent();
  await home(page);
  await page.getByTestId('enter-town').click();
  await expect(page.getByTestId('debate-line')).toHaveText(line!);
  await page.reload();
  await page.getByRole('button', { name: en.resume, exact: true }).click();
  await expect(page.getByTestId('debate-line')).toHaveText(line!);
  await page.getByRole('button', { name: en.auto, exact: true }).click();
  await page.clock.runFor(15000);
  expect(await page.getByTestId('debate-line').textContent()).not.toEqual(line);
  await page.getByRole('button', { name: en.pause, exact: true }).click();
  const paused = await page.getByTestId('debate-line').textContent();
  await page.clock.runFor(30000);
  await expect(page.getByTestId('debate-line')).toHaveText(paused!);
  await page.getByRole('button', { name: en.previous, exact: true }).click();
  await page.getByRole('button', { name: en.replay, exact: true }).click();
  await expect(page.getByRole('button', { name: en.previous, exact: true })).toBeDisabled();
  await page.getByRole('button', { name: en.skip, exact: true }).click();
  await home(page);
  await expect(page.getByTestId('hall-checks')).toHaveText('1/5');
  await page.getByTestId('enter-town').click();
  await page.getByRole('button', { name: en.replay, exact: true }).click();
  await home(page);
  await expect(page.getByTestId('hall-checks')).toHaveText('1/5');
});

test('Memory preview is player-triggered, exactly three active seconds, and fairly paused', async ({
  page,
}) => {
  const now = new Date('2026-10-26T08:00:00Z');
  await page.clock.install({ time: now });
  await page.clock.pauseAt(new Date(now.getTime() + 1000));
  await page.goto('/#/social');
  await page.clock.runFor(10000);
  await expect(page.locator('.memory-card.face-up')).toHaveCount(0);
  await page.getByRole('button', { name: en.start, exact: true }).click();
  await expect(page.locator('.memory-card.face-up')).toHaveCount(16);
  await page.clock.runFor(1000);
  await page.getByRole('button', { name: en.pause, exact: true }).click();
  await expect(page.locator('.memory-card.face-up')).toHaveCount(0);
  await page.clock.runFor(60000);
  await page.getByRole('button', { name: en.resumeGame, exact: true }).click();
  await page.clock.runFor(1900);
  await expect(page.locator('.memory-card.face-up')).toHaveCount(16);
  await page.clock.runFor(110);
  await expect(page.locator('.memory-card.face-up')).toHaveCount(0);
  await page.getByRole('button', { name: en.newRound, exact: true }).click();
  await page.getByRole('button', { name: en.start, exact: true }).click();
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.getByRole('button', { name: en.resumeGame, exact: true })).toBeVisible();
  await page.clock.runFor(10000);
  await expect(page.locator('.memory-card.face-up')).toHaveCount(0);
});

test('Food tokens are finite, can be redistributed, and new layouts remain solvable', async ({
  page,
}) => {
  await page.goto('/#/mess');
  const add = page.getByRole('button', { name: 'Add Grain · Garden crew', exact: true });
  for (let n = 0; n < 3; n++) await add.click();
  await expect(add).toBeDisabled();
  await page.getByRole('button', { name: 'Return Grain · Garden crew', exact: true }).click();
  await expect(add).toBeEnabled();
  await page.getByRole('button', { name: en.resetAllocation, exact: true }).click();
  await solveMeal(page, en);
  await page.getByRole('button', { name: en.newRound, exact: true }).click();
  await solveMeal(page, en, 1);
});

test('Welfare has full keyboard and desktop drag alternatives, with honest first-try scoring', async ({
  page,
}, info) => {
  await page.goto('/#/welfare');
  if (info.project.name === 'desktop')
    await page.getByTestId('patient-0').dragTo(page.getByTestId('treatment-0'));
  else {
    await page.getByTestId('patient-0').tap();
    await page.getByTestId('treatment-0').tap();
  }
  await expect(page.getByTestId('patient-0')).toBeDisabled();
  for (let n = 1; n < 5; n++) {
    await page.getByTestId(`patient-${n}`).focus();
    await page.keyboard.press('Space');
    await page.getByTestId(`treatment-${n}`).focus();
    await page.keyboard.press('Enter');
  }
  await expect(page.getByTestId('round-result')).toContainText('100');
});

test('Backup export/import requires confirmation and rejects invalid files without data loss', async ({
  page,
}) => {
  await page.goto('/#/town');
  await page.getByRole('button', { name: en.next, exact: true }).click();
  await home(page);
  await page.getByRole('button', { name: en.save, exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: en.export, exact: true }).click();
  const download = await downloadPromise;
  const exported = await readFile((await download.path())!, 'utf8');
  expect(JSON.parse(exported).town.position).toBe(1);
  const backup = JSON.parse(exported);
  backup.language = 'zh-TW';
  backup.town.position = 7;
  await page.locator('input[type=file]').setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(backup)),
  });
  await expect(page.getByRole('heading', { name: en.confirmImport, exact: true })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: en.cancel, exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.locator('input[type=file]').setInputFiles({
    name: 'broken.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{broken'),
  });
  await expect(page.getByRole('status')).toHaveText(en.importError);
  await page.locator('input[type=file]').setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(backup)),
  });
  await page.getByRole('button', { name: en.replace, exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
  await page.getByRole('button', { name: zh.close, exact: true }).click();
  await page.getByTestId('enter-town').click();
  await expect(page.locator('.dialogue-top')).toContainText('8/42');
});

test('Corrupt browser data is recoverable and cannot unlock the ending', async ({ page }) => {
  await page.goto('/');
  await page.evaluate((key) => localStorage.setItem(key, '{broken'), SAVE_KEY);
  await page.reload();
  await expect(page.getByRole('alert')).toContainText(en.recovered);
  await expect(page.getByTestId('enter-ending')).toBeDisabled();
  expect(await page.evaluate((key) => localStorage.getItem(key), SAVE_KEY)).toBe('{broken');
  await page.goto('/#/ending');
  await expect(page.getByTestId('enter-ending')).toBeDisabled();
});

test('Localization, reduced motion, mute and repairs survive reload without overflow', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: '繁體中文', exact: true }).click();
  await page.getByRole('button', { name: zh.soundOff, exact: true }).click();
  await page.getByRole('button', { name: zh.motionOn, exact: true }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.getByRole('button', { name: zh.soundOn, exact: true })).toBeVisible();
  for (const hall of ['town', 'mess', 'social', 'residential', 'welfare'] as const) {
    await page.getByTestId(`enter-${hall}`).click();
    await noOverflow(page);
    await expect(page.getByRole('heading', { level: 1 })).not.toContainText(/[a-zA-Z]/);
    await home(page, zh);
  }
  await page.setViewportSize({ width: 320, height: 740 });
  await noOverflow(page);
  for (const hall of ['mess', 'social', 'residential', 'welfare'] as const) {
    await page.getByTestId(`enter-${hall}`).click();
    await noOverflow(page);
    await home(page, zh);
  }
});

test('All five screens load entirely from local assets with accessible controls', async ({
  page,
}) => {
  const external: string[] = [];
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/*', (route) => {
    if (new URL(route.request().url()).hostname !== '127.0.0.1') {
      external.push(route.request().url());
      return route.abort();
    }
    return route.continue();
  });
  await page.goto('/');
  const violations = [];
  for (const hall of ['overview', 'town', 'mess', 'social', 'residential', 'welfare'] as const) {
    if (hall !== 'overview') await page.getByTestId(`enter-${hall}`).click();
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    violations.push(
      ...result.violations.map((v) => ({ hall, id: v.id, nodes: v.nodes.map((n) => n.target) })),
    );
    if (hall !== 'overview') await home(page);
  }
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
  expect(violations).toEqual([]);
});
