import { useRouter } from 'next/router';
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs';
import React from 'react';

const defaultTitle = 'Collections';

const config: DocsThemeConfig = {
  logo: <span>{defaultTitle}</span>,
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap"
        rel="stylesheet"
      />
    </>
  ),
  useNextSeoProps: function SEO() {
    const { asPath, locale } = useRouter();
    const { frontMatter } = useConfig();
    const titleTemplate = asPath !== '/' ? `%s – ${defaultTitle}` : defaultTitle;
    const defaultDescription = getDefaultDescription(locale);

    return {
      defaultTitle: frontMatter.title || titleTemplate,
      description: frontMatter.description || defaultDescription,
      titleTemplate,
      openGraph: {
        type: 'website',
        title: frontMatter.title ? `${frontMatter.title} - ${defaultTitle}` : defaultTitle,
        description: frontMatter.description || defaultDescription,
        url: 'https://collections.dev',
        siteName: defaultTitle,
        images: [
          {
            url: 'https://cdn.collections.dev/docs/og-image.png',
            width: 1200,
            height: 630,
            alt: 'collections og image',
            type: 'png',
          },
        ],
      },
      twitter: {
        handle: '@collectionscms',
        site: '@collectionscms',
        cardType: 'summary_large_image',
      },
      additionalLinkTags: [
        {
          rel: 'icon',
          href: '/images/favicon.svg',
        },
        {
          rel: 'apple-touch-icon',
          href: '/images/apple-icon.png',
          sizes: '180x180',
        },
      ],
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

const getDefaultDescription = (locale: string) => {
  switch (locale) {
    case 'ja':
      return 'あなたのWordPressをAPIに変えるヘッドレスCMS。使い始めるのに、もう昔の記事をコピペする必要はありません。';
    default:
      return 'A headless CMS that transforms your WordPress into an API. No need to copy and paste old posts anymore.';
  }
};

export default config;
