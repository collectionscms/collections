import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <span>Collections</span>,
  useNextSeoProps: function SEO() {
    const defaultTitle = 'Collections';

    return {
      defaultTitle,
      titleTemplate: `%s – ${defaultTitle}`,
    };
  },
  project: {
    link: 'https://github.com/collectionscms/collections',
  },
  chat: {
    link: 'https://discord.gg/a6FYDkV3Vk',
  },
  search: {
    placeholder: 'Search',
  },
  docsRepositoryBase: 'https://github.com/collectionscms/collections',
  footer: {
    text: 'Collections',
  },
  gitTimestamp: '',
  i18n: [
    { locale: 'en', text: 'English' },
    { locale: 'ja', text: '日本語' },
  ],
  primaryHue: {
    dark: 192,
    light: 199,
  },
  primarySaturation: {
    dark: 83,
    light: 89,
  },
};

export default config;
