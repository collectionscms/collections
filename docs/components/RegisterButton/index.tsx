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
      className={`bg-primary hover:bg-primary-hover inline-block text-white py-5 text-xl rounded-full ${isWide ? 'px-10 md:px-40' : 'px-10'}`}
    >
      <div className="flex flex-row items-center gap-2">
        <Image src={logo} alt="logo" className="h-8 w-auto" />
        <div>{title}</div>
      </div>
    </Link>
  );
};
