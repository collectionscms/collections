/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  testMatch: ['**/api/**/?(*.)test.ts', '!**/api/**/?(*.)int.test.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '.*\\.mock\\.ts$', '.*\\.fixture\\.ts$'],
  globalSetup: './test/setups/setup.ts',
  globalTeardown: './test/setups/teardown.ts',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};
