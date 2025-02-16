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
    const isRootPath = asPath === '/' || asPath.startsWith('/?');
    const titleTemplate = isRootPath ? topTitle : `%s – ${defaultTitle}`;
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
            url: getOgImage(locale),
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
  gitTimestamp: function GitTimestamp({ timestamp }) {
    const { locale } = useRouter();
    return (
      <span>
        {locale === 'ja' ? '最終更新日:' : 'Last updated on:'}{' '}
        <time dateTime={timestamp.toISOString()}>
          {timestamp.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </time>
      </span>
    );
  },
  darkMode: false,
  nextThemes: {
    defaultTheme: 'light',
    forcedTheme: 'light',
  },
};

const getOgImage = (locale: string) => {
  switch (locale) {
    case 'ja':
      return 'https://cdn.collections.dev/logo/og-ja.png';
    default:
      return 'https://cdn.collections.dev/logo/og-en.png';
  }
};

const getTopTitle = (locale: string) => {
  switch (locale) {
    case 'ja':
      return 'Collections - AI検索向けに設計されたヘッドレスCMS';
    default:
      return 'Collections - Headless CMS designed for AI searches';
  }
};

const getDefaultDescription = (locale: string) => {
  switch (locale) {
    case 'ja':
      return 'Collectionsは、AI Overviews、ChatGPT、Perplexity などのAI検索に設計されたヘッドレスCMSです。SEO対策（Google E-E-A-T、構造化データ）、多言語対応、AIによる添削を活用し、最適化されたコンテンツを作成できます。';
    default:
      return 'Collections is a headless CMS designed for AI searches such as AI Overviews, ChatGPT, Perplexity. It helps you create optimized content with SEO, multilingual support, and AI editing.';
  }
};

export default config;
