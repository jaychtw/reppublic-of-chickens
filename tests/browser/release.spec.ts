import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

test('Static build works below a GitHub Pages repository path and survives hash-route reloads', async ({
  page,
}) => {
  const root = resolve('dist');
  const prefix = '/reppublic-of-chickens/';
  const types: Record<string, string> = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
  };
  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url!, 'http://local').pathname;
    if (!pathname.startsWith(prefix)) {
      response.writeHead(404).end();
      return;
    }
    const file = resolve(root, decodeURIComponent(pathname.slice(prefix.length)) || 'index.html');
    if (!file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    try {
      response
        .writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' })
        .end(await readFile(file));
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Static server did not start');
  const failed: string[] = [];
  page.on('response', (response) => {
    if (response.status() >= 400) failed.push(response.url());
  });
  try {
    await page.goto(`http://127.0.0.1:${address.port}${prefix}`);
    await expect(page.getByTestId('enter-welfare')).toBeVisible();
    await page.getByTestId('enter-welfare').click();
    await page.reload();
    await expect(page.getByTestId('patient-0')).toBeVisible();
    await page.getByRole('button', { name: 'Return to republic', exact: true }).last().click();
    await page.getByTestId('enter-residential').click();
    await expect(page.getByTestId('issue-0')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.locator('.residence-scene').evaluate((el) => getComputedStyle(el).backgroundImage),
    ).toContain(`${prefix}art/residence.png`);
    expect(failed).toEqual([]);
  } finally {
    await new Promise<void>((done, reject) =>
      server.close((error) => (error ? reject(error) : done())),
    );
  }
});
