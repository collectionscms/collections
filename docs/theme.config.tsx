/* eslint-disable react/no-unknown-property */
/* eslint-disable max-len */
import { useRouter } from 'next/router';
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs';
import React from 'react';
import { Footer } from './components/Footer';

const defaultTitle = 'Collections';
const logo = (
  <svg
    height="30"
    viewBox="0 0 145 30"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    fill="currentColor"
  >
    <g transform="matrix(0.285714,0,0,0.285714,-70.8571,-128)">
      <path
        d="M750.508,494.922L745.708,500.602C743.388,498.442 741.068,498.282 740.028,498.282C737.708,498.282 736.268,499.402 736.268,501.082C736.268,501.962 736.668,503.322 739.388,504.202L741.708,504.922C744.428,505.802 748.508,507.162 750.508,509.882C751.548,511.322 752.268,513.402 752.268,515.642C752.268,518.762 751.228,521.882 748.428,524.442C745.628,527.002 742.268,528.122 738.028,528.122C730.828,528.122 726.748,524.682 724.588,522.362L729.708,516.442C731.628,518.682 734.508,520.442 737.388,520.442C740.108,520.442 742.188,519.082 742.188,516.682C742.188,514.522 740.428,513.642 739.148,513.162L736.908,512.362C734.428,511.482 731.548,510.362 729.468,508.202C727.868,506.522 726.828,504.362 726.828,501.562C726.828,498.202 728.428,495.402 730.428,493.722C733.148,491.562 736.668,491.242 739.468,491.242C742.028,491.242 746.108,491.562 750.508,494.922Z"
        fill="currentColor"
      />
    </g>
    <g transform="matrix(0.285714,0,0,0.285714,-70.8571,-128)">
      <path
        d="M680.093,527.002L680.093,492.362L689.853,492.362L689.853,496.842C691.693,494.282 694.973,491.242 700.573,491.242C703.613,491.242 708.093,492.122 710.813,495.482C713.213,498.442 713.533,501.882 713.533,505.242L713.533,527.002L703.773,527.002L703.773,508.122C703.773,506.202 703.693,503.162 701.933,501.322C700.413,499.722 698.333,499.562 697.373,499.562C694.813,499.562 692.813,500.442 691.373,502.602C689.933,504.842 689.853,507.322 689.853,509.322L689.853,527.002L680.093,527.002Z"
        fill="currentColor"
      />
    </g>
    <g transform="matrix(0.285714,0,0,0.285714,-70.8571,-128)">
      <path
        d="M648.704,491.242C655.264,491.242 659.744,493.402 662.704,496.122C666.144,499.242 668.544,504.042 668.544,509.722C668.544,515.322 666.144,520.122 662.704,523.242C659.744,525.962 655.264,528.122 648.704,528.122C642.144,528.122 637.664,525.962 634.704,523.242C631.264,520.122 628.865,515.322 628.865,509.722C628.865,504.042 631.264,499.242 634.704,496.122C637.664,493.402 642.144,491.242 648.704,491.242ZM648.704,519.482C654.384,519.482 658.465,515.002 658.465,509.722C658.465,504.282 654.304,499.882 648.704,499.882C643.104,499.882 638.944,504.282 638.944,509.722C638.944,515.002 643.024,519.482 648.704,519.482Z"
        fill="currentColor"
      />
    </g>
    <g transform="matrix(0.285714,0,0,0.285714,-70.8571,-128)">
      <path
        d="M607.562,492.363L617.322,492.363L617.322,527.003L607.562,527.003L607.562,492.363ZM606.602,477.723C606.602,474.523 609.242,471.883 612.442,471.883C615.642,471.883 618.282,474.523 618.282,477.723C618.282,480.923 615.642,483.563 612.442,483.563C609.242,483.563 606.602,480.923 606.602,477.723Z"
        fill="currentColor"
      />
    </g>
    <g transform="matrix(0.285714,0,0,0.285714,-70.8571,-128)">
      <path
        d="M598.479,500.683L591.759,500.683L591.759,527.003L581.999,527.003L581.999,500.683L578.159,500.683L578.159,492.363L581.999,492.363L581.999,480.523L591.759,480.523L591.759,492.363L598.479,492.363L598.479,500.683Z"
        fill="currentColor"
      />
    </g>
    <g transform="matrix(0.285714,0,0,0.285714,-70.8571,-128)">
      <path
        d="M569.861,493.322L569.861,502.922C567.781,501.002 565.221,499.882 561.861,499.882C555.381,499.882 552.101,504.602 552.101,509.642C552.101,515.322 556.341,519.482 562.181,519.482C564.341,519.482 567.221,518.842 569.861,516.442L569.861,525.962C567.941,526.922 564.901,528.122 560.901,528.122C555.461,528.122 550.661,526.042 547.541,523.082C544.901,520.602 542.021,516.282 542.021,509.802C542.021,503.722 544.501,498.842 548.021,495.722C552.261,491.962 557.141,491.242 560.501,491.242C564.101,491.242 567.061,491.962 569.861,493.322Z"
        fill="currentColor"
      />
    </g>
    <g transform="matrix(0.285714,0,0,0.285714,-70.8571,-128)">
      <path
        d="M523.024,515.882L531.984,517.322C530.944,519.882 527.024,528.122 514.944,528.122C509.344,528.122 505.104,526.522 501.664,523.242C497.824,519.642 496.224,515.162 496.224,509.722C496.224,502.842 499.024,498.602 501.504,496.122C505.584,492.122 510.384,491.242 514.544,491.242C521.584,491.242 525.664,494.042 528.064,496.922C531.744,501.322 532.224,506.762 532.224,510.522L532.224,511.322L506.304,511.322C506.304,513.402 506.864,515.642 507.984,517.162C509.024,518.602 511.184,520.442 514.944,520.442C518.624,520.442 521.424,518.682 523.024,515.882ZM506.624,505.082L523.024,505.082C522.224,500.362 518.384,498.122 514.784,498.122C511.184,498.122 507.424,500.442 506.624,505.082Z"
        fill="currentColor"
      />
    </g>
    <g transform="matrix(0.285714,0,0,0.285714,-70.8571,-128)">
      <rect x="474.921" y="468.68" width="9.76" height="58.32" fill="currentColor" />
    </g>
    <g transform="matrix(0.285714,0,0,0.285714,-70.8571,-128)">
      <rect x="451.859" y="468.68" width="9.76" height="58.32" fill="currentColor" />
    </g>
    <g transform="matrix(0.285714,0,0,0.285714,-70.8571,-128)">
      <path
        d="M420.47,491.242C427.03,491.242 431.51,493.402 434.47,496.122C437.91,499.242 440.31,504.042 440.31,509.722C440.31,515.322 437.91,520.122 434.47,523.242C431.51,525.962 427.03,528.122 420.47,528.122C413.91,528.122 409.43,525.962 406.47,523.242C403.03,520.122 400.63,515.322 400.63,509.722C400.63,504.042 403.03,499.242 406.47,496.122C409.43,493.402 413.91,491.242 420.47,491.242ZM420.47,519.482C426.15,519.482 430.23,515.002 430.23,509.722C430.23,504.282 426.07,499.882 420.47,499.882C414.87,499.882 410.71,504.282 410.71,509.722C410.71,515.002 414.79,519.482 420.47,519.482Z"
        fill="currentColor"
      />
    </g>
    <g transform="matrix(0.285714,0,0,0.285714,-70.8571,-128)">
      <path
        d="M390.269,512.918L390.269,525.078C387.069,526.758 382.829,528.198 377.069,528.198C367.709,528.198 362.029,524.998 357.549,520.758C351.389,514.838 348.989,508.198 348.989,500.358C348.989,490.678 352.989,483.718 357.549,479.478C362.909,474.438 369.549,472.438 377.149,472.438C380.909,472.438 385.389,473.078 390.269,475.718L390.269,487.878C385.389,482.278 379.309,481.878 377.389,481.878C366.669,481.878 359.709,490.678 359.709,500.518C359.709,512.358 368.829,518.758 377.789,518.758C382.749,518.758 387.149,516.598 390.269,512.918Z"
        fill="currentColor"
      />
    </g>
    <g transform="matrix(0.285714,0,0,0.285714,-70.8571,-128)">
      <path d="M279.5,478L275,472.5L288.5,448L315,480L313.5,482.5L279.5,478Z" fill="currentColor" />
    </g>
    <g transform="matrix(0.285714,0,0,0.285714,-70.8571,-128)">
      <path d="M312,486L270.5,481L257.5,505.5L298.5,511L312,486Z" fill="currentColor" />
    </g>
    <g transform="matrix(0.285714,0,0,0.285714,-70.8571,-128)">
      <path d="M254.5,509.5L248,521L274.5,553L288.5,528L275,512L254.5,509.5Z" fill="currentColor" />
    </g>
    <style jsx>{`
      svg {
        mask-image: linear-gradient(60deg, black 25%, rgba(0, 0, 0, 0.2) 50%, black 75%);
        mask-size: 400%;
        mask-position: 0%;
      }
      svg:hover {
        mask-position: 100%;
        transition:
          mask-position 1s ease,
          -webkit-mask-position 1s ease;
      }
    `}</style>
  </svg>
);

const config: DocsThemeConfig = {
  logo,
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
  project: {
    link: 'https://github.com/collectionscms/collections',
  },
  chat: {
    link: 'https://x.com/collectionscms',
    icon: (
      <svg
        width="25"
        height="24"
        viewBox="0 0 25 24"
        version="1.1"
        style={{
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          strokeLinejoin: 'round',
          strokeMiterlimit: 2,
        }}
      >
        <g transform="matrix(0.0207347,0,0,0.01957,0,0)">
          <path
            d="M714.163,519.284L1160.89,0L1055.03,0L667.137,450.887L357.328,0L0,0L468.492,681.821L0,1226.37L105.866,1226.37L515.491,750.218L842.672,1226.37L1200,1226.37L714.137,519.284L714.163,519.284ZM569.165,687.828L521.697,619.934L144.011,79.694L306.615,79.694L611.412,515.685L658.88,583.579L1055.08,1150.3L892.476,1150.3L569.165,687.854L569.165,687.828Z"
            style={{ fill: 'currentColor', fillRule: 'nonzero' }}
          />
        </g>
      </svg>
    ),
  },
  search: {
    placeholder: 'Search',
  },
  docsRepositoryBase: 'https://github.com/collectionscms/collections',
  footer: {
    text: <Footer />,
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
  banner: {
    key: 'launch-to-product-hunt',
    text: (
      <a
        href="https://www.producthunt.com/products/collections-dev"
        target="_blank"
        rel="noreferrer"
      >
        Launching soon on Product Hunt. Follow me!😻
      </a>
    ),
  },
};

const getDefaultDescription = (locale: string) => {
  switch (locale) {
    case 'ja':
      return 'Collections は、ブログ・お知らせ・通知など、Webサイトに動的な多言語コンテンツを組み込めるヘッドレスCMSです。自動翻訳やSEO対策など、コンテンツの生成もAIがアシストします。';
    default:
      return 'Collections is a headless CMS that allows you to embed dynamic multilingual content—such as blogs, announcements, and notifications—into your website.';
  }
};

export default config;
