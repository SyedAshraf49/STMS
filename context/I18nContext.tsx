import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import enTranslations from '../locales/en.json';

type Language = 'en' | 'ta' | 'te' | 'ml';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, ...args: any[]) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Helper to access nested keys like 'login.title'
const getTranslation = (langFile: Record<string, any>, key: string): string | undefined => {
  const value = key.split('.').reduce<any>((obj, k) => obj?.[k], langFile);
  return typeof value === 'string' ? value : undefined;
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [translations, setTranslations] = useState<Partial<Record<Language, Record<string, any>>>>({
    en: enTranslations,
  });

  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  useEffect(() => {
    let cancelled = false;

    if (translations[language]) {
      return;
    }

    const fetchLanguage = async (lang: Language) => {
      try {
        const res = await fetch(`./locales/${lang}.json`);
        if (!res.ok) throw new Error(`Failed to load ${lang}`);
        const data = await res.json();
        if (!cancelled) setTranslations(prev => ({ ...prev, [lang]: data }));
      } catch (err) {
        console.error('Failed to load translations for', lang, err);
        if (!cancelled) setTranslations(prev => ({ ...prev, [lang]: {} }));
      }
    };

    fetchLanguage(language);

    return () => { cancelled = true; };
  }, [language, translations]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, ...args: any[]): string => {
    const langFile = translations[language] || translations.en || {};
    const fallback = getTranslation(translations.en || {}, key);
    let translation = getTranslation(langFile, key) || fallback || key;

    if (args.length > 0) {
      args.forEach((arg, index) => {
        translation = translation.replace(new RegExp(`\\{${index}\\}`, 'g'), arg);
      });
    }

    return translation;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};