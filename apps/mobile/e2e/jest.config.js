module.exports = {
  testRunner: 'jest-circus/runner',
  testEnvironment: 'detox/runners/jest/testEnvironment',
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testMatch: ['**/*.e2e.{js,ts}'],
  testTimeout: 300000
}
