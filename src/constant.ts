export const Language = {
  en: 'en',
  ja: 'ja',
} as const;

export type LanguageType = keyof typeof Language;
