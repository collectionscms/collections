export type LanguageType = {
  code: string;
  isSourceLanguage: boolean;
  isTargetLanguage: boolean;
};

export const languages: readonly LanguageType[] = [
  { code: 'en', isSourceLanguage: true, isTargetLanguage: true },
  { code: 'ja', isSourceLanguage: true, isTargetLanguage: true },
];
