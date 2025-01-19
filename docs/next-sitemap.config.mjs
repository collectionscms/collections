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
  transform: async (config, path) => {
    if (path.endsWith('.ja')) {
      path = path.replace(/\/?(.*)\.ja$/, '/ja/$1');
    } else if (path.endsWith('.en')) {
      path = path.replace(/\/?(.*)\.en$/, '/$1');
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
  },
};

export default config;
