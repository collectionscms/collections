import { Link } from 'nextra-theme-docs';
import React, { ReactElement, ReactNode } from 'react';

const FooterHeader = ({ children }: { children: ReactNode }) => {
  return <h3>{children}</h3>;
};

const FooterLink = ({ href, children }: { href: string; children: ReactNode }) => {
  const classes =
    // eslint-disable-next-line max-len
    'text-sm text-[#666666] hover:underline no-underline betterhover:hover:text-gray-700 betterhover:hover:dark:text-white transition';
  if (href.startsWith('http')) {
    return (
      <a className={classes} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link className={classes} href={href}>
      {children}
    </Link>
  );
};

const navigation = {
  general: [
    { name: 'Docs', href: '/docs/home' },
    {
      name: 'API',
      href: '/reference/api',
    },
    { name: 'Demo', href: 'https://app.collectionsdemo.live/admin/' },
  ],
  resource: [
    { name: 'Blog', href: 'https://blog.collections.dev/' },
    { name: 'Releases', href: 'https://github.com/collectionscms/collections/releases' },
  ],
  support: [
    {
      name: 'GitHub',
      href: 'https://github.com/collectionscms/collections',
    },
    {
      name: 'Discord',
      href: 'https://discord.gg/a6FYDkV3Vk',
    },
  ],
  company: [{ name: 'X', href: 'https://x.com/collectionscms' }],
};

export const Footer = (): ReactElement => {
  return (
    <footer className="w-full">
      <div className="mx-auto flex">
        <div aria-labelledby="footer-heading" className="w-full">
          <div className="w-full py-8 mx-auto">
            <div className="xl:grid xl:grid-cols-3 xl:gap-8">
              <div className="grid grid-cols-1 gap-8 xl:col-span-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 md:gap-8">
                  <div className="mt-12 md:!mt-0">
                    <FooterHeader>General</FooterHeader>
                    <ul className="mt-4 space-y-1.5 list-none ml-0" role="list">
                      {navigation.general.map((item) => (
                        <li key={item.name}>
                          <FooterLink href={item.href}>{item.name}</FooterLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-12 md:!mt-0">
                    <FooterHeader>Resources</FooterHeader>
                    <ul className="mt-4 space-y-1.5 list-none ml-0" role="list">
                      {navigation.resource.map((item) => (
                        <li key={item.name}>
                          <FooterLink href={item.href}>{item.name}</FooterLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-12 md:!mt-0">
                    <FooterHeader>Company</FooterHeader>
                    <ul className="mt-4 space-y-1.5 list-none ml-0" role="list">
                      {navigation.company.map((item) => (
                        <li key={item.name}>
                          <FooterLink href={item.href}>{item.name}</FooterLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-12 md:!mt-0">
                    <FooterHeader>Support</FooterHeader>
                    <ul className="mt-4 space-y-1.5 list-none ml-0" role="list">
                      {navigation.support.map((item) => (
                        <li key={item.name}>
                          <FooterLink href={item.href}>{item.name}</FooterLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-16">
              <p className="text-xs">
                &copy; {new Date().getFullYear()} Rocketa, Inc. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
