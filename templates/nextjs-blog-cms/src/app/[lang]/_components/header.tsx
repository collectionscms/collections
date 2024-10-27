/* eslint-disable max-len */
import React from 'react';
import { Locale } from '@/i18n-config';
import Link from 'next/link';

type Props = {
  lang: Locale;
};

const Header = ({ lang }: Props) => {
  return (
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8 flex items-center">
      <Link href={`/${lang}`} className="hover:underline">
        Blog
      </Link>
      .
    </h2>
  );
};

export default Header;
