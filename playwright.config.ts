import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './src/tests/e2e',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:10001',
    headless: true,
    viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:10001',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
})
