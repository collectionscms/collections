export enum LanguageCodes {
  'en-us' = 'en-us',
  'en-gb' = 'en-gb',
  es = 'es',
  ja = 'ja',
  'pt-br' = 'pt-br',
  'zh-cn' = 'zh-cn',
}

export type LanguageType = {
  code: string;
  isSourceLanguage: boolean;
  isTargetLanguage: boolean;
};

export const languages: readonly LanguageType[] = [
  { code: LanguageCodes['en-gb'], isSourceLanguage: true, isTargetLanguage: true },
  { code: LanguageCodes['en-us'], isSourceLanguage: true, isTargetLanguage: true },
  { code: LanguageCodes.es, isSourceLanguage: true, isTargetLanguage: true },
  { code: LanguageCodes.ja, isSourceLanguage: true, isTargetLanguage: true },
  { code: LanguageCodes['pt-br'], isSourceLanguage: true, isTargetLanguage: true },
  { code: LanguageCodes['zh-cn'], isSourceLanguage: true, isTargetLanguage: true },
];
