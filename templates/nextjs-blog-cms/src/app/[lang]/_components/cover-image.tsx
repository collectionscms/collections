import React from 'react';
import cn from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/i18n-config';

type Props = {
  title: string;
  src: string;
  slug?: string;
  lang: Locale;
};

const CoverImage = ({ title, src, slug, lang }: Props) => {
  const image = (
    <Image
      src={src}
      alt={`Cover Image for ${title}`}
      className={cn('shadow-sm w-full', {
        'hover:shadow-lg transition-shadow duration-200': slug,
      })}
      width={1300}
      height={630}
    />
  );
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`${lang}/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
};

export default CoverImage;
