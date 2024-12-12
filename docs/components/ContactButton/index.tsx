/* eslint-disable max-len */
import Link from 'next/link';
import React from 'react';

type Props = {
  title: string;
  url: string;
};

export const ContactButton: React.FC<Props> = ({ title, url }) => {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute inline-flex justify-center items-center rounded-full py-4 px-5 sm:px-10 leading-none sm:leading-snug bg-white text-black top-20 sm:top-24 right-4 sm:right-6 z-10 hover:bg-white/80"
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
  );
};
