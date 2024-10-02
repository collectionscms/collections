import { SourceLanguageCode, TargetLanguageCode } from '@collectionscms/plugin-text-generator';

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
  englishName: string;
};

export const languages: readonly LanguageCode[] = [
  { code: 'bg', sourceLanguageCode: 'bg', targetLanguageCode: 'bg', englishName: 'Bulgarian' },
  { code: 'cs', sourceLanguageCode: 'cs', targetLanguageCode: 'cs', englishName: 'Czech' },
  { code: 'da', sourceLanguageCode: 'da', targetLanguageCode: 'da', englishName: 'Danish' },
  { code: 'de', sourceLanguageCode: 'de', targetLanguageCode: 'de', englishName: 'German' },
  { code: 'el', sourceLanguageCode: 'el', targetLanguageCode: 'el', englishName: 'Modern Greek' },
  { code: 'en-gb', sourceLanguageCode: 'en', targetLanguageCode: 'en-GB', englishName: 'English' },
  { code: 'en-us', sourceLanguageCode: 'en', targetLanguageCode: 'en-US', englishName: 'English' },
  { code: 'es', sourceLanguageCode: 'es', targetLanguageCode: 'es', englishName: 'Spanish' },
  { code: 'et', sourceLanguageCode: 'et', targetLanguageCode: 'et', englishName: 'Estonian' },
  { code: 'fi', sourceLanguageCode: 'fi', targetLanguageCode: 'fi', englishName: 'Finnish' },
  { code: 'fr', sourceLanguageCode: 'fr', targetLanguageCode: 'fr', englishName: 'French' },
  { code: 'hu', sourceLanguageCode: 'hu', targetLanguageCode: 'hu', englishName: 'Hungarian' },
  { code: 'id', sourceLanguageCode: 'id', targetLanguageCode: 'id', englishName: 'Indonesian' },
  { code: 'it', sourceLanguageCode: 'it', targetLanguageCode: 'it', englishName: 'Italian' },
  { code: 'ja', sourceLanguageCode: 'ja', targetLanguageCode: 'ja', englishName: 'Japanese' },
  { code: 'ko', sourceLanguageCode: 'ko', targetLanguageCode: 'ko', englishName: 'Korean' },
  { code: 'lt', sourceLanguageCode: 'lt', targetLanguageCode: 'lt', englishName: 'Lithuanian' },
  { code: 'lv', sourceLanguageCode: 'lv', targetLanguageCode: 'lv', englishName: 'Latvian' },
  {
    code: 'nb',
    sourceLanguageCode: 'nb',
    targetLanguageCode: 'nb',
    englishName: 'Norwegian Bokmal',
  },
  { code: 'nl', sourceLanguageCode: 'nl', targetLanguageCode: 'nl', englishName: 'Dutch' },
  { code: 'pl', sourceLanguageCode: 'pl', targetLanguageCode: 'pl', englishName: 'Polish' },
  {
    code: 'pt-br',
    sourceLanguageCode: 'pt',
    targetLanguageCode: 'pt-BR',
    englishName: 'Portuguese',
  },
  {
    code: 'pt-pt',
    sourceLanguageCode: 'pt',
    targetLanguageCode: 'pt-PT',
    englishName: 'Portuguese',
  },
  { code: 'ro', sourceLanguageCode: 'ro', targetLanguageCode: 'ro', englishName: 'Romanian' },
  { code: 'ru', sourceLanguageCode: 'ru', targetLanguageCode: 'ru', englishName: 'Russian' },
  { code: 'sk', sourceLanguageCode: 'sk', targetLanguageCode: 'sk', englishName: 'Slovak' },
  { code: 'sl', sourceLanguageCode: 'sl', targetLanguageCode: 'sl', englishName: 'Slovenian' },
  { code: 'sv', sourceLanguageCode: 'sv', targetLanguageCode: 'sv', englishName: 'Swedish' },
  { code: 'tr', sourceLanguageCode: 'tr', targetLanguageCode: 'tr', englishName: 'Turkish' },
  { code: 'uk', sourceLanguageCode: 'uk', targetLanguageCode: 'uk', englishName: 'Ukrainian' },
  { code: 'zh-cn', sourceLanguageCode: 'zh', targetLanguageCode: 'zh', englishName: 'Chinese' },
];

export const getLanguageCodeType = (language: string): LanguageCode | null => {
  return languages.find((l) => l.code === language) ?? null;
};
