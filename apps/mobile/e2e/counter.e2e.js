/* eslint-disable no-undef */
describe('Counter flow', () => {
  beforeAll(async () => {
    await device.launchApp({ delete: true, newInstance: true })
  })

  it('increments and shows count', async () => {
    await waitFor(element(by.id('count'))).toBeVisible().withTimeout(30000)
    await element(by.id('inc')).tap()
    await expect(element(by.id('count'))).toHaveText('1')
  })
})

