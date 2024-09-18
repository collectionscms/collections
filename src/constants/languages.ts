import { SourceLanguageCode, TargetLanguageCode } from '@collectionscms/plugin-translate';

export const IsoLanguageCode = {
  bg: 'bg',
  cs: 'cs',
  da: 'da',
  de: 'de',
  el: 'el',
  'en-gb': 'en-gb',
  'en-us': 'en-us',
  es: 'es',
  et: 'et',
  fi: 'fi',
  fr: 'fr',
  hu: 'hu',
  id: 'id',
  it: 'it',
  ja: 'ja',
  ko: 'ko',
  lt: 'lt',
  lv: 'lv',
  nb: 'nb',
  nl: 'nl',
  pl: 'pl',
  'pt-br': 'pt-br',
  'pt-pt': 'pt-pt',
  ro: 'ro',
  ru: 'ru',
  sk: 'sk',
  sl: 'sl',
  sv: 'sv',
  tr: 'tr',
  uk: 'uk',
  'zh-cn': 'zh-cn',
} as const;
export type IsoLanguageCodeType = (typeof IsoLanguageCode)[keyof typeof IsoLanguageCode];

export type LanguageCode = {
  code: IsoLanguageCodeType;
  sourceLanguageCode: SourceLanguageCode | null;
  targetLanguageCode: TargetLanguageCode | null;
};

export const languages: readonly LanguageCode[] = [
  { code: 'bg', sourceLanguageCode: 'bg', targetLanguageCode: 'bg' },
  { code: 'cs', sourceLanguageCode: 'cs', targetLanguageCode: 'cs' },
  { code: 'da', sourceLanguageCode: 'da', targetLanguageCode: 'da' },
  { code: 'de', sourceLanguageCode: 'de', targetLanguageCode: 'de' },
  { code: 'el', sourceLanguageCode: 'el', targetLanguageCode: 'el' },
  { code: 'en-gb', sourceLanguageCode: 'en', targetLanguageCode: 'en-GB' },
  { code: 'en-us', sourceLanguageCode: 'en', targetLanguageCode: 'en-US' },
  { code: 'es', sourceLanguageCode: 'es', targetLanguageCode: 'es' },
  { code: 'et', sourceLanguageCode: 'et', targetLanguageCode: 'et' },
  { code: 'fi', sourceLanguageCode: 'fi', targetLanguageCode: 'fi' },
  { code: 'fr', sourceLanguageCode: 'fr', targetLanguageCode: 'fr' },
  { code: 'hu', sourceLanguageCode: 'hu', targetLanguageCode: 'hu' },
  { code: 'id', sourceLanguageCode: 'id', targetLanguageCode: 'id' },
  { code: 'it', sourceLanguageCode: 'it', targetLanguageCode: 'it' },
  { code: 'ja', sourceLanguageCode: 'ja', targetLanguageCode: 'ja' },
  { code: 'ko', sourceLanguageCode: 'ko', targetLanguageCode: 'ko' },
  { code: 'lt', sourceLanguageCode: 'lt', targetLanguageCode: 'lt' },
  { code: 'lv', sourceLanguageCode: 'lv', targetLanguageCode: 'lv' },
  { code: 'nb', sourceLanguageCode: 'nb', targetLanguageCode: 'nb' },
  { code: 'nl', sourceLanguageCode: 'nl', targetLanguageCode: 'nl' },
  { code: 'pl', sourceLanguageCode: 'pl', targetLanguageCode: 'pl' },
  { code: 'pt-br', sourceLanguageCode: 'pt', targetLanguageCode: 'pt-BR' },
  { code: 'pt-pt', sourceLanguageCode: 'pt', targetLanguageCode: 'pt-PT' },
  { code: 'ro', sourceLanguageCode: 'ro', targetLanguageCode: 'ro' },
  { code: 'ru', sourceLanguageCode: 'ru', targetLanguageCode: 'ru' },
  { code: 'sk', sourceLanguageCode: 'sk', targetLanguageCode: 'sk' },
  { code: 'sl', sourceLanguageCode: 'sl', targetLanguageCode: 'sl' },
  { code: 'sv', sourceLanguageCode: 'sv', targetLanguageCode: 'sv' },
  { code: 'tr', sourceLanguageCode: 'tr', targetLanguageCode: 'tr' },
  { code: 'uk', sourceLanguageCode: 'uk', targetLanguageCode: 'uk' },
  { code: 'zh-cn', sourceLanguageCode: 'zh', targetLanguageCode: 'zh' },
];

export const getLanguageCodeType = (language: string): LanguageCode | null => {
  return languages.find((l) => l.code === language) ?? null;
};
