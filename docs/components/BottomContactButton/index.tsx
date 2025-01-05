/* eslint-disable max-len */
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export const BottomContactButton: React.FC = () => {
  const { locale } = useRouter();
  const title = locale === 'ja' ? 'お問い合わせ' : 'Contact';
  const url =
    locale === 'ja'
      ? 'https://collectionscms.notion.site/15728b1165c68127a17adea12818b022'
      : 'https://collectionscms.notion.site/15728b1165c681d3a3bafd0fb0b9edb8';

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 2) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed right-0 bottom-0 py-4 px-5 sm:px-6 pointer-events-none flex duration-300 justify-end sm:justify-end ${isScrolled ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex justify-center items-center rounded-full py-4 px-5 sm:px-10 leading-none sm:leading-snug bg-white text-black border-black border hover:bg-white/80"
      >
        <div className="flex flex-row items-center">
          <div className="text-md">{title}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 28 7"
            className="ml-4 w-[28px]"
          >
            <path stroke="currentColor" strokeWidth="2" d="M0 6h24"></path>
            <path fill="currentColor" d="M28 7h-9V0z"></path>
          </svg>
        </div>
      </Link>
    </div>
  );
};
