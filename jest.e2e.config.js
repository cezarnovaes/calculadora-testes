module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/e2e/**/*.test.js'],
  globalSetup: './tests/e2e/setup.js',
  globalTeardown: './tests/e2e/teardown.js',
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true
};