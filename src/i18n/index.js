import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import uzLatin from './locales/uz-latin.json';
import uzCyrillic from './locales/uz-cyrillic.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'uz-latin': { translation: uzLatin },
      'uz-cyrillic': { translation: uzCyrillic },
    },
    fallbackLng: 'uz-latin',
    supportedLngs: ['uz-latin', 'uz-cyrillic'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'news-lang',
    },
    interpolation: { escapeValue: false },
  });

export const LANGUAGES = [
  { code: 'uz-latin', label: "O'zbek (lotin)", short: 'UZ' },
  { code: 'uz-cyrillic', label: 'Ўзбек (кирилл)', short: 'ЎЗ' },
];

export default i18n;
