import * as Tabs from '@radix-ui/react-tabs';
import { useRouter } from 'next/router';
import React from 'react';
import styles from './index.module.css';

export const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const { locale, asPath } = router;

  const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `; expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
  };

  const handleLanguageChange = (value: string) => {
    setCookie('NEXT_LOCALE', value, 365);
    router.push(asPath, asPath, { locale: value });
  };

  return (
    <Tabs.Root
      className={styles.languageSwitch}
      defaultValue={locale}
      onValueChange={handleLanguageChange}
    >
      <Tabs.List className={styles.languageSwitchList}>
        <Tabs.Trigger className={styles.languageSwitchTrigger} value="en">
          EN
        </Tabs.Trigger>
        <Tabs.Trigger className={styles.languageSwitchTrigger} value="ja">
          JP
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
};
