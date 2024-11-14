const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

module.exports = withNextra({
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.collections.dev',
      },
    ],
  },
});
