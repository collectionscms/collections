module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/test/**/*test.ts'],
  globalSetup: './test/setups/setup.ts',
  globalTeardown: './test/setups/teardown.ts',
  transform: {
    '.ts': 'ts-jest',
  },
};
