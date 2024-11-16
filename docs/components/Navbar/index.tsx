/* eslint-disable max-len */
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import logo from '../../assets/images/logo.svg';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { NavbarMenu } from './NavbarMenu';

export const Navbar: React.FC = () => {
  const { locale } = useRouter();
  const demoTitle = locale === 'ja' ? 'デモ' : 'Demo';
  const signUpTitle = locale === 'ja' ? '利用登録' : 'Try for free';

  return (
    <div className="sticky top-0 z-10 flex bg-black text-white py-4 pl-5 lg:pl-8 2xl:pl-14 pr-4 md:pr-6 border-b-neutral-400 border-b-[0.5px]">
      <div className="rayContainer">
        <div className="lightRay" />
      </div>
      <div className="flex flex-row items-center gap-12 flex-grow">
        <Link href="/">
          <Image src={logo} alt="logo" className="w-36 logo" />
        </Link>
        <NavbarMenu href="https://app.collectionsdemo.live/admin/" title={demoTitle} />
        <NavbarMenu href="https://app.collections.dev/" title={signUpTitle} variant="primary" />
      </div>
      <div>
        <LanguageSwitcher />
      </div>
    </div>
  );
};
