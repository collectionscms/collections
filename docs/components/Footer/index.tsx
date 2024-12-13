import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import discord from '../../assets/images/discord.svg';
import github from '../../assets/images/github.svg';
import logo from '../../assets/images/logo.svg';
import rocketa from '../../assets/images/rocketa.svg';
import x from '../../assets/images/x.svg';
import { FooterMenu } from './FooterMenu';

export const Footer: React.FC = () => {
  const { locale } = useRouter();
  const demoTitle = locale === 'ja' ? 'デモ' : 'Demo';
  const signUpTitle = locale === 'ja' ? '利用開始' : 'Try for free';
  const terms = locale === 'ja' ? '利用規約' : 'Terms of Service';
  const privacy = locale === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy';

  return (
    <footer className="flex justify-center bg-footer text-white pt-10 md:pt-16 pb-20 sm:pb-9">
      <div className="w-[90rem] px-5 lg:px-8">
        <Image src={logo} alt="logo" className="w-52" />
        <div className="flex flex-row mt-5 gap-x-10 gap-y-4 flex-wrap">
          <FooterMenu href="/about" title="About" target="_self" />
          <FooterMenu href="/terms" title={terms} target="_self" />
          <FooterMenu href="/privacy" title={privacy} target="_self" />
          <FooterMenu
            href="https://app.collectionsdemo.live/admin/"
            title={demoTitle}
            target="_blank"
          />
          <FooterMenu
            href="https://app.collections.dev/"
            title={signUpTitle}
            target="_blank"
            variant="primary"
          />
        </div>
        <div className="mt-14">
          <div className="font-bold text-footer-heading text-xl">SNS／SUPPORT</div>
          <div className="flex flex-col md:flex-row mt-5 gap-6">
            <div className="flex flex-row gap-x-10 gap-y-4 items-center flex-grow flex-wrap">
              <Link
                href="https://x.com/collectionscms"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline after:-bottom-2"
              >
                <Image src={x} alt="x" className="h-5 w-fit" />
              </Link>
              <Link
                href="https://discord.gg/a6FYDkV3Vk"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline after:-bottom-2"
              >
                <Image src={discord} alt="discord" className="h-5 w-fit" />
              </Link>
              <Link
                href="https://blog.collections.dev/"
                className="link-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Blog
              </Link>
              <Link
                href="https://github.com/collectionscms/collections"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline after:-bottom-2"
              >
                <Image src={github} alt="discord" className="h-6 w-fit" />
              </Link>
              <Link href="/docs/home" className="link-underline">
                Docs
              </Link>
              <Link href="/reference/api" className="link-underline">
                API
              </Link>
            </div>
            <Link
              href="https://rocketa.co.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block"
            >
              <Image src={rocketa} alt="company" className="w-36 md:w-48 opacity-30 logo" />
            </Link>
          </div>
        </div>
        <div className="mt-20 md:mt-16 text-center">
          <Link
            href="https://rocketa.co.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="align-center inline-block md:hidden mb-5"
          >
            <Image src={rocketa} alt="company" className="w-36 md:w-48 opacity-30 logo" />
          </Link>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Rocketa, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
