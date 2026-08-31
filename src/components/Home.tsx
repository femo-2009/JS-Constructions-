import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n, t } from "@/lib/i18n";
import AutoSlider from "./AutoSlider";
import ClientsGallery from "./ClientsGallery";
import LogoImage from "./LogoImage";
import { listRows, createRow, updateRow, TBL } from "@/lib/rows";
import { Pencil, Check, X, Loader2, ArrowRight, ArrowLeft, HardHat, Ruler, Paintbrush } from "lucide-react";

const KEYS = ["home_subtitle", "home_title", "home_description"] as const;
type K = typeof KEYS[number];

export default function Home() {
  const { lang } = useI18n();
  const { isAdmin, user } = useAuth();
  const [settings, setSettings] = useState<Record<K, any>>({} as any);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Record<K, { en: string; ar: string }>>({} as any);

  const load = async () => {
    const rows = await listRows(TBL.SETTINGS);
    const map: any = {};
    KEYS.forEach((k) => {
      map[k] = rows.find((r) => r.key === k) ?? { $id: k, key: k, value_en: "", value_ar: "" };
    });
    setSettings(map);
  };

  useEffect(() => {
    load();
  }, []);

  const beginEdit = () => {
    const d: any = {};
    KEYS.forEach((k) => { d[k] = { en: settings[k]?.value_en || "", ar: settings[k]?.value_ar || "" }; });
    setDraft(d);
    setEditing(true);
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      for (const k of KEYS) {
        const data = { key: k, value_en: draft[k].en, value_ar: draft[k].ar };
        const existing = settings[k];
        if (existing?.$id) {
          // If the row exists in the DB (has real id), update it.
          await updateRow(TBL.SETTINGS, existing.$id, data);
        } else {
          await createRow(TBL.SETTINGS, data, user?.$id ?? null, k);
        }
      }
      setEditing(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section className="relative min-h-[60vh] sm:min-h-[70vh] bg-slate-950 overflow-hidden flex items-center">
        {/* Architectural blueprint backdrop */}
        <div className="hero-blueprint absolute inset-0" />
        <div className="hero-glow absolute" />

        <div className="relative container mx-auto px-4 sm:px-8 py-16 z-20 w-full">
          {editing ? (
            <div className="max-w-3xl mx-auto bg-white/95 rounded-2xl p-5 space-y-4 shadow-2xl">
              {KEYS.map((k) => (
                <div key={k}>
                  <p className="text-xs font-bold uppercase text-slate-500 mb-1">{k.replace("home_", "")}</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <input dir="ltr" value={draft[k].en} placeholder="English"
                      onChange={(e) => setDraft({ ...draft, [k]: { ...draft[k], en: e.target.value } })}
                      className="rounded-lg border border-slate-300 px-3 py-2" />
                    <input dir="rtl" value={draft[k].ar} placeholder="عربي"
                      onChange={(e) => setDraft({ ...draft, [k]: { ...draft[k], ar: e.target.value } })}
                      className="rounded-lg border border-slate-300 px-3 py-2" />
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditing(false)} disabled={saving}
                  className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"><X className="w-4 h-4 inline" /> {t(lang, "Cancel", "إلغاء")}</button>
                <button onClick={save} disabled={saving}
                  className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 inline animate-spin" /> {t(lang, "Saving...", "جارٍ الحفظ...")}
                    </>
                  ) : (
                    <><Check className="w-4 h-4 inline" /> {t(lang, "Save", "حفظ")}</>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl hero-reveal">
              <div className={`flex items-center gap-3 mb-5 ${lang === "ar" ? "justify-start flex-row-reverse" : ""}`}>
                <LogoImage className="w-14 h-10 sm:w-16 sm:h-12 drop-shadow-[0_0_18px_rgba(16,185,129,.45)]" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-emerald-400">
                  JS Constructions
                </span>
              </div>

              <h2 className="text-emerald-400 font-bold text-sm sm:text-base mb-3 uppercase tracking-widest">
                {t(lang, settings.home_subtitle?.value_en || "", settings.home_subtitle?.value_ar || "")}
              </h2>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-5">
                {t(lang, settings.home_title?.value_en || "", settings.home_title?.value_ar || "")}
              </h1>
              <p className="text-slate-300 text-sm sm:text-lg max-w-xl mb-8 leading-relaxed">
                {t(lang, settings.home_description?.value_en || "", settings.home_description?.value_ar || "")}
              </p>

              <div className="flex flex-wrap gap-3 items-center">
                <a href="#Works"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/40 transition-all hover:shadow-emerald-700/40 hover:-translate-y-0.5">
                  {t(lang, "View Our Work", "شاهد أعمالنا")}
                  {lang === "ar" ? <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> : <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                </a>
                <a href="#Services"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/25 text-white hover:bg-white/10 transition-colors font-semibold">
                  {t(lang, "Our Services", "خدماتنا")}
                </a>
                <a href="#Contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-emerald-50 transition-colors font-semibold shadow-lg">
                  {t(lang, "Contact Us", "اتصل بنا")}
                  {lang === "ar" ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </a>
              </div>

              {isAdmin && (
                <button onClick={beginEdit} className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/30 hover:bg-white/20">
                  <Pencil className="w-4 h-4" /> {t(lang, "Edit welcome message", "تعديل رسالة الترحيب")}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Floating craft badges */}
        <div className="hidden lg:flex absolute bottom-8 left-8 right-8 z-20 flex-wrap justify-between gap-4 max-w-6xl mx-auto">
          <div className="craft-chip animate-float">
            <HardHat className="w-5 h-5 text-emerald-400" />
            <span>{t(lang, "General Contracting", "المقاولات العامة")}</span>
          </div>
          <div className="craft-chip animate-float" style={{ animationDelay: "0.6s" }}>
            <Paintbrush className="w-5 h-5 text-emerald-400" />
            <span>{t(lang, "Interior Finishing", "التشطيبات الداخلية")}</span>
          </div>
          <div className="craft-chip animate-float" style={{ animationDelay: "1.2s" }}>
            <Ruler className="w-5 h-5 text-emerald-400" />
            <span>{t(lang, "Precision Craftsmanship", "إتقان ودقة التنفيذ")}</span>
          </div>
        </div>
      </section>

      <AutoSlider category="works" heading={{ en: "Our Work", ar: "أعمالنا" }} />
      <AutoSlider category="services" heading={{ en: "Our Services", ar: "خدماتنا" }} />
      <ClientsGallery />
    </>
  );
}
