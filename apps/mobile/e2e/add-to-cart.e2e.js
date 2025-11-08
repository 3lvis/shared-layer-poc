/* eslint-disable no-undef */
describe('Add to cart flow', () => {
  beforeAll(async () => {
    await device.launchApp({ delete: true, newInstance: true })
  })

  it('adds a product and updates total', async () => {
    // Ensure app UI is ready before interacting (esp. on Android)
    await waitFor(element(by.id('cart-total'))).toBeVisible().withTimeout(30000)
    await element(by.id('add-button-apl')).tap()
    await expect(element(by.id('cart-total'))).toHaveText('Total: 6 NOK')
  })
})
