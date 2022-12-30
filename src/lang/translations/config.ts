import i18next from 'i18next';
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

i18next.use(initReactI18next).init({
  lng: 'ja',
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
