const config = {
  siteUrl: 'https://collections.dev',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  sitemapBaseFileName: 'sitemap',
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['https://app.collections.dev', 'https://blog.collections.dev'],
      },
    ],
  },
};

export default config;
