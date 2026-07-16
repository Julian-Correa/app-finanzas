import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

export type AppLanguage = "es" | "en";

interface LanguageContextValue {
  language: AppLanguage;
  locale: string;
  setLanguage: (language: AppLanguage) => void;
}

const languageStorageKey = "finos.language";
const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

function isValidLanguage(value: string | null): value is AppLanguage {
  return value === "es" || value === "en";
}

function getInitialLanguage(): AppLanguage {
  const storedLanguage = window.localStorage.getItem(languageStorageKey);

  if (isValidLanguage(storedLanguage)) {
    return storedLanguage;
  }

  return window.navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

function getLocale(language: AppLanguage) {
  return language === "es" ? "es-AR" : "en-US";
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<AppLanguage>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(languageStorageKey, language);
  }, [language]);

  const value: LanguageContextValue = {
    language,
    locale: getLocale(language),
    setLanguage: setLanguageState,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider.");
  }

  return context;
}
