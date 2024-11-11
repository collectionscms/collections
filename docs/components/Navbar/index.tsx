import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import logo from '../../assets/images/logo.svg';
import { NavbarMenu } from './NavbarMenu';
import { useRouter } from 'next/router';

export const Navbar: React.FC = () => {
  const { locale } = useRouter();
  const demoTitle = locale === 'ja' ? 'デモ' : 'Demo';
  const signUpTitle = locale === 'ja' ? '利用登録' : 'Try for free';

  return (
    <div className="bg-black text-white py-6 px-14 border-b-neutral-400 border-b">
      <div className="flex flex-row items-center gap-12">
        <Link href="/">
          <Image src={logo} alt="logo" className="w-36" />
        </Link>
        <NavbarMenu href="https://app.collectionsdemo.live/admin/" title={demoTitle} />
        <NavbarMenu href="https://app.collections.dev/" title={signUpTitle} variant="primary" />
      </div>
    </div>
  );
};
