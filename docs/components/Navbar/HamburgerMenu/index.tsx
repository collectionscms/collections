import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import discord from '../../../assets/images/discord.svg';
import github from '../../../assets/images/github.svg';
import logo from '../../../assets/images/logo.svg';
import rocketa from '../../../assets/images/rocketa.svg';
import x from '../../../assets/images/x.svg';
import { LanguageSwitcher } from '../../LanguageSwitcher';
import { NavbarMenu } from '../NavbarMenu';
import styles from './index.module.css';

type Props = {
  open: boolean;
  close: () => void;
};

export const HamburgerMenu: React.FC<Props> = ({ open, close }) => {
  const { locale } = useRouter();
  const demoTitle = locale === 'ja' ? 'デモ' : 'Demo';
  const signUpTitle = locale === 'ja' ? '無料ではじめる' : 'Try for free';

  return (
    <>
      <div
        className={`${styles.hamburgerMenuBg} ${open ? styles.open : styles.close}`}
        onClick={close}
      />
      <div className={`${styles.hamburgerMenu} ${open ? styles.open : styles.close}`}>
        <div className="p-5 flex flex-col gap-5">
          <Image src={logo} alt="logo" className="w-36 logo" />
          <LanguageSwitcher />
          <hr />
          <Link href="/about" onClick={close}>
            About
          </Link>
          <hr />
          <NavbarMenu href="https://app.collectionsdemo.live/admin/" title={demoTitle} />
          <hr />
          <NavbarMenu
            href="https://app.collections.dev/admin/auth/login"
            title={signUpTitle}
            variant="primary"
          />
          <hr />
          <div>
            <div className="font-bold text-footer-heading text-xl">SNS／SUPPORT</div>
            <div className="flex flex-col md:flex-row mt-5 gap-6">
              <div className="flex flex-row gap-10 items-center flex-grow flex-wrap">
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
        </div>
      </div>
    </>
  );
};
