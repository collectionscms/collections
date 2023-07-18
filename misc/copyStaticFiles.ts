import cpy from 'cpy';

// This helper copies all static files (such as .d.ts, .json, ...etc) after compilation to dist
await cpy(['./prepare.mjs', './package.json'], 'dist');
await cpy(['src/**/*.d.ts', 'src/**/*.json', 'src/**/*.md', 'src/**/*.html'], 'dist/src');
