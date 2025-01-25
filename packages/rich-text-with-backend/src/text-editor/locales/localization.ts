import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './en/translation.json';
import translationJA from './ja/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translationEN },
    ja: { translation: translationJA },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
