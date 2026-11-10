import { defineConfig } from '@playwright/test';

const PORT = 4399;

export default defineConfig({
  testDir: 'e2e',
  forbidOnly: !!process.env.CI,
  reporter: 'list',
  use: { baseURL: `http://localhost:${PORT}` },
  // Serves dist/, so `npm run build` has to run first. `--ignore-lock` keeps
  // the server in the foreground, where Playwright can stop it.
  webServer: {
    command: `npm run preview -- --port ${PORT} --ignore-lock`,
    port: PORT,
    reuseExistingServer: false,
  },
});
