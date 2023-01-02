module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*test.ts'],
  transform: {
    '.ts': 'ts-jest',
  },
};
