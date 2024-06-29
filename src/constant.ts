export const Locale = {
  ja: 'ja',
  en: 'en',
} as const;

export type LocaleType = keyof typeof Locale;
