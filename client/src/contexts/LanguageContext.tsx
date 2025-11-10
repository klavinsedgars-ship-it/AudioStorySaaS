import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  currentLang: string;
  setCurrentLang: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLangState] = useState('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('app-lang');
    if (storedLang) {
      setCurrentLangState(storedLang);
    }
  }, []);

  const setCurrentLang = (lang: string) => {
    setCurrentLangState(lang);
    localStorage.setItem('app-lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
