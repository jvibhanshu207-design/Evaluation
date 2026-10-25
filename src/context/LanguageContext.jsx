import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '../locales/translations';
import { translateText } from '../services/translationService';

const STORAGE_KEY_LANGUAGE = 'learnsphere_language';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_LANGUAGE);
      const isSupported = SUPPORTED_LANGUAGES.some((lang) => lang.code === saved);
      return isSupported ? saved : 'en';
    }
    return 'en';
  });

  const [isTranslating, setIsTranslating] = useState(false);

  // Synchronize <html> lang attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = useCallback((langCode) => {
    const isSupported = SUPPORTED_LANGUAGES.some((lang) => lang.code === langCode);
    const chosen = isSupported ? langCode : 'en';
    setLanguageState(chosen);
    try {
      localStorage.setItem(STORAGE_KEY_LANGUAGE, chosen);
    } catch {
      // safe
    }
  }, []);

  /**
   * Synchronous static dictionary translator with fallback.
   * e.g. t('dashboard') => "डैशबोर्ड" (if Hindi)
   */
  const t = useCallback(
    (key, fallback = '') => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
      if (dict && typeof dict[key] === 'string') {
        return dict[key];
      }
      const englishDict = TRANSLATIONS.en;
      if (englishDict && typeof englishDict[key] === 'string') {
        return englishDict[key];
      }
      return fallback || key;
    },
    [language]
  );

  /**
   * Asynchronous dynamic text translator via Translation API + Cache.
   * e.g. await translateDynamic("Master Java from foundational syntax...")
   */
  const translateDynamic = useCallback(
    async (text) => {
      if (!text || language === 'en') return text;
      setIsTranslating(true);
      try {
        const result = await translateText(text, language);
        return result;
      } finally {
        setIsTranslating(false);
      }
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        languages: SUPPORTED_LANGUAGES,
        currentLanguageConfig: SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0],
        t,
        translateDynamic,
        isTranslating
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

/**
 * Reusable React Hook for dynamic translation in any component.
 * Automatically translates `text` whenever the active language changes.
 *
 * @param {string} text - Original string.
 * @returns {string} Translated string or original text while translating / on error.
 */
export function useDynamicText(text) {
  const { language, translateDynamic } = useLanguage();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    let isCancelled = false;

    if (!text || language === 'en') {
      return;
    }

    translateDynamic(text).then((res) => {
      if (!isCancelled && res) {
        setTranslated(res);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [text, language, translateDynamic]);

  return language === 'en' ? text : (translated || text);
}
