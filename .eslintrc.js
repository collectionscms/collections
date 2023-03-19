module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'jest', 'import'],
  extends: ['eslint:recommended', 'prettier'],
  ignorePatterns: ['project/*', 'misc/*', 'dist/*', 'superfast/*', '**/*.js'],
  overrides: [
    {
      files: ['test/**/*.test.ts'],
      rules: {
        'no-restricted-syntax': ['error', 'ForInStatement'],
        'no-await-in-loop': 0,
        'jest/prefer-strict-equal': 'off',
      },
    },
  ],
  env: {
    'jest/globals': true,
  },
  rules: {
    'max-len': ['error', { code: 120 }],
    // It's recommended to turn off this rule on TypeScript projects.
    'no-undef': 'off',
    // Allow unused arguments and variables when they begin with an underscore.
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
  },
};
