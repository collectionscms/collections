export const Locale = {
  en: 'en',
  ja: 'ja',
} as const;

export type LocaleType = keyof typeof Locale;
