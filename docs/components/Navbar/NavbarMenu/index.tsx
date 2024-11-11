/* eslint-disable max-len */
import Link from 'next/link';
import React from 'react';

type Props = {
  title: string;
  href?: string;
  variant?: 'default' | 'primary';
};

export const NavbarMenu: React.FC<Props> = ({ title, href, variant = 'default' }) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-row items-center ${variant === 'primary' ? 'text-navbar-primary font-bold' : 'text-white'} link-underline`}
    >
      {title}
    </Link>
  );
};
