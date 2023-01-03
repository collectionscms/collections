import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import translation_en from './en/translation.json';
import translation_ja from './ja/translation.json';

export const resources = {
  ja: {
    translation: translation_ja,
  },
  en: {
    translation: translation_en,
  },
} as const;

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
