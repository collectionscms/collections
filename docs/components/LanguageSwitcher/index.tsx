import * as Tabs from '@radix-ui/react-tabs';
import { useRouter } from 'next/router';
import React from 'react';

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
      className="language-switch"
      defaultValue={locale}
      onValueChange={handleLanguageChange}
    >
      <Tabs.List className="language-switch__list">
        <Tabs.Trigger className="language-switch__trigger" value="en">
          EN
        </Tabs.Trigger>
        <Tabs.Trigger className="language-switch__trigger" value="ja">
          JP
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
};
