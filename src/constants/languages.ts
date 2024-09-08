import { SourceLanguageCode, TargetLanguageCode } from 'deepl-node';

export const IsoLanguageCode = {
  'en-us': 'en-us',
  'en-gb': 'en-gb',
  es: 'es',
  ja: 'ja',
  'pt-br': 'pt-br',
  'zh-cn': 'zh-cn',
  'zh-tw': 'zh-tw',
} as const;
export type IsoLanguageCodeType = (typeof IsoLanguageCode)[keyof typeof IsoLanguageCode];

export type LanguageCode = {
  code: IsoLanguageCodeType;
  sourceLanguageCode: SourceLanguageCode | null;
  targetLanguageCode: TargetLanguageCode | null;
};

export const languages: readonly LanguageCode[] = [
  { code: 'en-gb', sourceLanguageCode: 'en', targetLanguageCode: 'en-GB' },
  { code: 'en-us', sourceLanguageCode: 'en', targetLanguageCode: 'en-US' },
  { code: 'es', sourceLanguageCode: 'es', targetLanguageCode: 'es' },
  { code: 'ja', sourceLanguageCode: 'ja', targetLanguageCode: 'ja' },
  { code: 'pt-br', sourceLanguageCode: 'pt', targetLanguageCode: 'pt-BR' },
  { code: 'zh-cn', sourceLanguageCode: 'zh', targetLanguageCode: 'zh' },
  { code: 'zh-tw', sourceLanguageCode: null, targetLanguageCode: null },
];

export const getLanguageCodeType = (language: string): LanguageCode | null => {
  return languages.find((l) => l.code === language) ?? null;
};
