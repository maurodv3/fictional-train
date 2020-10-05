import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import englishBundle from './public/static/locales/en/common.json';
import spanishBundle from './public/static/locales/es/common.json';

// the translations
const resources = {
  en: {
    translation: englishBundle
  },
  es: {
    translation: spanishBundle
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'es',
  keySeparator: false,
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
