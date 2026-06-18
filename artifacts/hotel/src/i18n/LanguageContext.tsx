import { createContext, useContext, useState, type ReactNode } from "react";
import translations, { type Language, type Translations } from "./translations";

interface LanguageContextValue {
  lang: Language;
  t: Translations;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const toggle = () => setLang((l) => (l === "en" ? "fr" : "en"));

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
