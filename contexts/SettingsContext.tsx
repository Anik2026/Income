import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency, Language } from '../types';

interface SettingsContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  language: Language;
  setLanguage: (l: Language) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );
  
  const [currency, setCurrency] = useState<Currency>(() => 
    (localStorage.getItem('currency') as Currency) || 'BDT'
  );

  const [language, setLanguage] = useState<Language>(() => 
    (localStorage.getItem('language') as Language) || 'bn'
  );

  // Apply theme to HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Persist other settings
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <SettingsContext.Provider value={{ theme, toggleTheme, currency, setCurrency, language, setLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};