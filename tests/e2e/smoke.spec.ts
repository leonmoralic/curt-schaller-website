import { test, expect } from '@playwright/test';

const SECTIONS = ['hero', 'about', 'inventions', 'awards', 'filmography', 'workshops', 'contact'];

for (const lang of ['de', 'en'] as const) {
  test(`${lang}: all sections render`, async ({ page }) => {
    await page.goto(`/${lang}/`);
    for (const id of SECTIONS) {
      const el = page.locator(`#${id}`);
      await expect(el).toBeVisible();
    }
  });

  test(`${lang}: mailto link present`, async ({ page }) => {
    await page.goto(`/${lang}/`);
    const mailto = page.locator('a[href^="mailto:curt@"]');
    await expect(mailto).toBeVisible();
  });
}

test('language toggle switches', async ({ page }) => {
  await page.goto('/de/');
  await page.locator('.lang-toggle a[data-lang="en"]').click();
  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('robots.txt served', async ({ request }) => {
  const r = await request.get('/robots.txt');
  expect(r.status()).toBe(200);
  expect(await r.text()).toContain('Sitemap');
});

test('impressum page renders', async ({ page }) => {
  await page.goto('/impressum/');
  await expect(page.locator('h1')).toContainText('Impressum');
});

test('datenschutz page renders', async ({ page }) => {
  await page.goto('/datenschutz/');
  await expect(page.locator('h1')).toContainText('Datenschutz');
});
