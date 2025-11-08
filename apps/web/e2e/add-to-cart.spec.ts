import { test, expect } from '@playwright/test'

test('adds a product and updates cart total', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('add-button-apl').click()
  await expect(page.getByTestId('cart-total')).toContainText('Total: 6 NOK')
})

