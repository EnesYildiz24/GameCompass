// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import de from './locales/de.json';
import en from './locales/en.json';
import tr from './locales/tr.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import ru from './locales/ru.json';
i18n
  // zuerst den Detector nutzen …
  .use(LanguageDetector)
  // … dann React-Bindings
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: de },
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      tr: { translation: tr },
      ru: { translation: ru },
    },
    fallbackLng: 'de',
    interpolation: { escapeValue: false },

    detection: {
      // Reihenfolge, in der i18next nach der Sprache sucht
      order: ['localStorage', 'navigator'],
      // Wo die Sprache gespeichert wird
      caches: ['localStorage'],
    },
  });

export default i18n;
