export enum LanguageCodes {
  en = 'en',
  es = 'es',
  ja = 'ja',
  pt = 'pt',
  zh = 'zh',
}

export type LanguageType = {
  code: string;
  isSourceLanguage: boolean;
  isTargetLanguage: boolean;
};

export const languages: readonly LanguageType[] = [
  { code: LanguageCodes.en, isSourceLanguage: true, isTargetLanguage: true },
  { code: LanguageCodes.es, isSourceLanguage: true, isTargetLanguage: true },
  { code: LanguageCodes.ja, isSourceLanguage: true, isTargetLanguage: true },
  { code: LanguageCodes.pt, isSourceLanguage: true, isTargetLanguage: true },
  { code: LanguageCodes.zh, isSourceLanguage: true, isTargetLanguage: true },
];
