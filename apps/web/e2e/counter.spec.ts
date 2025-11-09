import { test, expect } from '@playwright/test'

test('increments and shows count', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('inc').click()
  await expect(page.getByTestId('count')).toHaveText('1')
})

