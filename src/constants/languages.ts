export enum LanguageCodes {
  'en-us' = 'en-us',
  'en-gb' = 'en-gb',
  es = 'es',
  ja = 'ja',
  'pt-br' = 'pt-br',
  'zh-cn' = 'zh-cn',
  'zh-tw' = 'zh-tw',
}

type LanguageType = {
  code: string;
  sourceLanguageCode: string | null;
  targetLanguageCode: string | null;
};

export const languages: readonly LanguageType[] = [
  { code: LanguageCodes['en-gb'], sourceLanguageCode: 'en', targetLanguageCode: 'en-gb' },
  { code: LanguageCodes['en-us'], sourceLanguageCode: 'en', targetLanguageCode: 'en-us' },
  { code: LanguageCodes.es, sourceLanguageCode: 'es', targetLanguageCode: 'es' },
  { code: LanguageCodes.ja, sourceLanguageCode: 'ja', targetLanguageCode: 'ja' },
  { code: LanguageCodes['pt-br'], sourceLanguageCode: 'pt', targetLanguageCode: 'pt-br' },
  { code: LanguageCodes['zh-cn'], sourceLanguageCode: 'zh', targetLanguageCode: 'zh' },
  { code: LanguageCodes['zh-tw'], sourceLanguageCode: null, targetLanguageCode: null },
];
