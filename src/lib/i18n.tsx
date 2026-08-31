import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "ar";
const Ctx = createContext<{ lang: Lang; toggle: () => void; setLang: (l: Lang) => void }>({
  lang: "en", toggle: () => {}, setLang: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("lang") as Lang) || "ar");
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang]);
  return (
    <Ctx.Provider value={{ lang, toggle: () => setLang(lang === "en" ? "ar" : "en"), setLang }}>
      {children}
    </Ctx.Provider>
  );
}
export const useI18n = () => useContext(Ctx);
export const t = <T,>(lang: Lang, en: T, ar: T) => (lang === "en" ? en : ar);
