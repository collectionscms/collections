const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

const nextConfig = withNextra({
  reactStrictMode: true,
});

module.exports = nextConfig;
