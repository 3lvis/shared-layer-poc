// ESM config to match type: module
import { defineConfig, devices } from '@playwright/test'
import { fileURLToPath } from 'url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  reporter: [
    ['list'],
    ['junit', { outputFile: '../../artifacts/playwright/results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'node scripts/dev.mjs',
    cwd: __dirname,
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 60_000
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ]
})
