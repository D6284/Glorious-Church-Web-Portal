
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>((localStorage.getItem('church_lang') as Language) || 'en');
  const [translations, setTranslations] = useState<any>({});

  useEffect(() => {
    const loadTranslations = async () => {
      // Use try-catch for better error handling when fetching external resources
      try {
        const response = await fetch(`./translations/${language}.json`);
        if (response.ok) {
          const data = await response.json();
          setTranslations(data);
        } else {
          console.error(`Failed to load translation file for language: ${language}`);
        }
      } catch (err) {
        console.error(`Error fetching translations for ${language}:`, err);
      }
    };
    loadTranslations();
    localStorage.setItem('church_lang', language);
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);

  const t = (path: string): string => {
    const keys = path.split('.');
    let result = translations;
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return path;
      }
    }
    return typeof result === 'string' ? result : path;
  };

  // Fix: Use React.createElement instead of JSX syntax because this is a .ts file. 
  // JSX is only supported in .tsx files, causing "Operator '<' cannot be applied" errors in .ts files.
  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
};
