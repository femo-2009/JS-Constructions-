import { useState } from "react";
import LogoImage from "./LogoImage";
import { useI18n, t } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { LogOut } from "lucide-react";

type NavbarProps = { page: string; onNavigate: (p: string) => void };

export default function Navbar({ page, onNavigate }: NavbarProps) {
  const { lang, toggle } = useI18n();
  const { isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const items = [
    { key: "Home", label: t(lang, "Home", "الرئيسية") },
    { key: "Works", label: t(lang, "Our Work", "أعمالنا") },
    { key: "Clients", label: t(lang, "Clients", "شركاؤنا") },
    { key: "Services", label: t(lang, "Services", "خدماتنا") },
    { key: "Contact", label: t(lang, "Contact Us", "اتصل بنا") },
  ];

  const go = (p: string) => { onNavigate(p); setOpen(false); };

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => go("Home")} className="flex items-center space-x-3">
          <LogoImage className="w-14 h-10 sm:w-16 sm:h-12" />
          <div className="text-left">
            <h1 className="text-base sm:text-xl font-extrabold text-slate-800 leading-none uppercase">JS</h1>
            <p className="text-[10px] sm:text-xs font-semibold text-emerald-600 tracking-widest uppercase">Constructions</p>
          </div>
        </button>

        <div className="hidden lg:flex items-center gap-4">
          <nav className="flex items-center gap-6">
            {items.map((it) => (
              <button key={it.key} onClick={() => go(it.key)}
                className={`font-medium transition-colors ${page === it.key ? "text-emerald-700" : "text-slate-600 hover:text-emerald-600"}`}>
                {it.label}
              </button>
            ))}
          </nav>
          {isAdmin && (
            <span className="px-2 py-1 text-[10px] uppercase tracking-wide rounded-full bg-emerald-100 text-emerald-700 font-bold">
              {t(lang, "Admin", "أدمن")}
            </span>
          )}
          {isAdmin && (
            <button onClick={signOut} className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-red-600">
              <LogOut className="w-4 h-4" /> {t(lang, "Logout", "خروج")}
            </button>
          )}
          <button onClick={toggle} className="px-4 py-2 border border-emerald-200 rounded-full text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100">
            {lang === "en" ? "العربية" : "English"}
          </button>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <button onClick={toggle} className="px-3 py-2 rounded-full border border-emerald-200 text-sm font-semibold text-emerald-700 bg-emerald-50">
            {lang === "en" ? "العربية" : "EN"}
          </button>
          <button onClick={() => setOpen((o) => !o)} className="px-3 py-2 rounded-md border border-slate-200 text-slate-700">
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden mt-3 border-t border-slate-100 pt-3 space-y-2">
          <nav className="flex flex-col gap-1">
            {items.map((it) => (
              <button key={it.key} onClick={() => go(it.key)}
                className={`w-full px-2 py-2 rounded-md hover:bg-slate-50 ${page === it.key ? "text-emerald-700 font-semibold" : "text-slate-700"} ${lang === "ar" ? "text-right" : "text-left"}`}>
                {it.label}
              </button>
            ))}
          </nav>
          {isAdmin && (
            <div className="flex gap-2">
              <button onClick={signOut} className="flex-1 px-4 py-2 rounded-full text-sm font-semibold text-red-600 border border-red-200">
                {t(lang, "Logout", "خروج")}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
