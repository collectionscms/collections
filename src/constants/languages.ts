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
};

export const languages: readonly LanguageCode[] = [
  { code: 'en-gb' },
  { code: 'en-us' },
  { code: 'es' },
  { code: 'ja' },
  { code: 'pt-br' },
  { code: 'zh-cn' },
  { code: 'zh-tw' },
];

export const getLanguageCodeType = (language: string): LanguageCode | null => {
  return languages.find((l) => l.code === language) ?? null;
};
