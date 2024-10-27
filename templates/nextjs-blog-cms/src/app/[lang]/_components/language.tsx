import React from 'react';
import { i18n, Locale } from '@/i18n-config';
import cn from 'classnames';
import Container from './container';

type Props = {
  currentLng: Locale;
};

const Language = ({ currentLng }: Props) => {
  const languageComponent = (currentLng: string) => {
    return i18n.locales.map((locale) => {
      return locale === currentLng ? (
        <p className="font-bold">{locale.toUpperCase()}</p>
      ) : (
        <>
          <div key={locale}>
            <a
              href={`/${locale}`}
              className={cn(
                'text-sm underline hover:text-blue-600 duration-200 transition-colors',
                {
                  'font-bold': currentLng === locale,
                }
              )}
            >
              {locale.toUpperCase()}
            </a>
          </div>
        </>
      );
    });
  };

  return (
    <div className={cn('border-b dark:bg-slate-800 bg-neutral-50 border-neutral-200')}>
      <Container>
        <div className="py-2 text-center text-sm">
          <div className="flex flex-row align-middle justify-center gap-4">
            {languageComponent(currentLng)}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Language;
