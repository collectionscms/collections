import jestBaseConfig from './jest.config.mjs';

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  ...jestBaseConfig,
  testMatch: ['**/api/**/*.int-test.ts'],
  testPathIgnorePatterns: [],
};
