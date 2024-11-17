/* eslint-disable max-len */
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import logo from '../../assets/images/logo.svg';

type Props = {
  title: string;
  isWide: boolean;
};

export const RegisterButton: React.FC<Props> = ({ title, isWide }) => {
  return (
    <Link
      href="https://app.collections.dev/"
      target="_blank"
      rel="noopener noreferrer"
      className={`bg-primary hover:bg-primary-hover inline-block text-white py-5 rounded-full ${isWide ? 'px-6 md:px-40' : 'px-6 md:px-8'}`}
    >
      <div className="flex flex-row items-center gap-3">
        <Image src={logo} alt="logo" className="h-6 md:h-8 w-auto" />
        <div className="text-md md:text-xl">{title}</div>
      </div>
    </Link>
  );
};
