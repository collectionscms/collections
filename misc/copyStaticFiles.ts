import cpy from 'cpy';

// This helper copies all static files (such as .d.ts, .json, ...etc) after compilation to dist
await cpy(['./prepare.mjs', './package.json', './README.md', './LICENSE'], 'dist');
await cpy(
  ['src/**/*.d.ts', 'src/**/*.json', 'src/**/*.md', 'src/**/*.html', 'src/**/*.css'],
  'dist/src'
);
