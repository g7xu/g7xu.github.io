import { expect, test } from '@playwright/test';

let failures: string[];

// Third-party responses are ignored so a font CDN hiccup can't fail a build.
test.beforeEach(({ page, baseURL }) => {
  failures = [];
  page.on('pageerror', (error) => failures.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400 && response.url().startsWith(baseURL!)) {
      failures.push(`${response.status()} ${response.url()}`);
    }
  });
});

test.afterEach(() => {
  expect(failures).toEqual([]);
});

test.describe('home', () => {
  test('a returning visitor sees the page without the tour', async ({
    page,
  }) => {
    await page.addInitScript(() => localStorage.setItem('swarm-seen', '1'));
    await page.goto('/');
    await expect(page.locator('.sidebar-avatar')).toBeVisible();
    await expect(page.locator('.swarm-skip')).toBeHidden();
  });

  test('a first-time visitor can skip the tour', async ({ page }) => {
    await page.goto('/');
    await page.locator('.swarm-skip').click();
    await expect(page.locator('.swarm-skip')).toHaveCount(0);
    await expect(page.locator('.sidebar-avatar')).toBeVisible();
  });
});

test('blog lists its posts', async ({ page }) => {
  await page.goto('/blog/');
  await expect(page.locator('.blog-list__item').first()).toBeVisible();
});

test('learning wiki draws the graph and opens a note', async ({ page }) => {
  await page.goto('/learning-wiki/');
  await expect(page.locator('#graph-svg circle').first()).toBeAttached();

  const id = await page.evaluate(() => {
    const notes = window.__WIKI_NOTES__;
    const withImage = notes.find((n) => /!\[\[[^\]]+\.svg/.test(n.content));
    return (withImage ?? notes[0]).id;
  });
  await page.evaluate((noteId) => {
    location.hash = encodeURIComponent(noteId);
  }, id);

  await expect(page.locator('#note-title')).toHaveText(id);
  await expect(page.locator('#note-body')).not.toBeEmpty();
});

test('travel draws the map', async ({ page }) => {
  await page.goto('/travel/');
  await expect(page.locator('#us-map path').first()).toBeAttached();
});

test('quotes fills the cloud', async ({ page }) => {
  await page.goto('/quotes/');
  await expect(page.locator('#qc-world figure').first()).toBeAttached();
});
