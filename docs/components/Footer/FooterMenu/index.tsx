/* eslint-disable max-len */
import Link from 'next/link';
import React from 'react';

type Props = {
  title: string;
  href?: string;
  target: '_blank' | '_self';
  variant?: 'default' | 'primary';
};

export const FooterMenu: React.FC<Props> = ({ title, href, target, variant = 'default' }) => {
  return (
    <Link
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : ''}
      className={`flex flex-row items-center ${variant === 'primary' ? 'text-navbar-primary' : 'text-white'} link-underline`}
    >
      {title}
    </Link>
  );
};
