/* eslint-disable max-len */
import React from 'react';
import { useRouter } from 'next/router';
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs';
import { Footer } from './components/Footer/index';
import { Navbar } from './components/Navbar/index';

const defaultTitle = 'Collections';

const config: DocsThemeConfig = {
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap"
        rel="stylesheet"
      />
    </>
  ),
  useNextSeoProps: function SEO() {
    const { asPath, locale } = useRouter();
    const { frontMatter } = useConfig();
    const topTitle = getTopTitle(locale);
    const titleTemplate = asPath !== '/' ? `%s – ${defaultTitle}` : topTitle;
    const defaultDescription = getDefaultDescription(locale);

    return {
      defaultTitle: frontMatter.title || titleTemplate,
      description: frontMatter.description || defaultDescription,
      titleTemplate,
      openGraph: {
        type: 'website',
        title: frontMatter.title ? `${frontMatter.title} - ${defaultTitle}` : topTitle,
        description: frontMatter.description || defaultDescription,
        url: 'https://collections.dev',
        siteName: defaultTitle,
        images: [
          {
            url: 'https://cdn.collections.dev/og-image.png',
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
          href: 'https://cdn.collections.dev/favicon.svg',
        },
        {
          rel: 'apple-touch-icon',
          href: 'https://cdn.collections.dev/apple-icon.png',
          sizes: '180x180',
        },
      ],
    };
  },
  navbar: {
    component: Navbar,
  },
  search: {
    component: null,
  },
  docsRepositoryBase: 'https://github.com/collectionscms/collections',
  footer: {
    component: Footer,
  },
  gitTimestamp: '',
  darkMode: false,
  nextThemes: {
    defaultTheme: 'light',
    forcedTheme: 'light',
  },
  banner: {
    key: 'launch-to-product-hunt',
    text: (
      <a
        href="https://www.producthunt.com/products/collections-dev"
        target="_blank"
        rel="noreferrer"
      >
        Launching soon on Product Hunt 🚀
      </a>
    ),
  },
};

const getTopTitle = (locale: string) => {
  switch (locale) {
    case 'ja':
      return 'Collections - 翻訳内蔵の多言語ヘッドレスCMS';
    default:
      return 'Collections - Multilingual headless CMS with built-in translation';
  }
};

const getDefaultDescription = (locale: string) => {
  switch (locale) {
    case 'ja':
      return 'Collections は、ブログ・お知らせ・通知など、Webサイトに動的な多言語コンテンツを組み込めるヘッドレスCMSです。多言語のSEO対策もAIがアシストします。';
    default:
      return 'Collections is a headless CMS that enables you to add multilingual content like blogs, announcements to your website. AI assists in optimizing multilingual SEO.';
  }
};

export default config;
