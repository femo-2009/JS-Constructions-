import { useEffect, useState } from "react";
import { useI18n, t } from "@/lib/i18n";
import { listRows, subscribeRows, Query, TBL } from "@/lib/rows";

type Slide = {
  $id: string;
  title_en?: string;
  title_ar?: string;
  value_en?: string;
  value_ar?: string;
  name_en?: string;
  name_ar?: string;
  image_url: string | null;
};

export default function AutoSlider({ category, heading }: {
  category: "works" | "services";
  heading: { en: string; ar: string };
}) {
  const { lang } = useI18n();
  const [slides, setSlides] = useState<Slide[]>([]);

  const load = async () => {
    try {
      const rows = await listRows(TBL.CARDS, [
        Query.equal("category", category),
        Query.orderAsc("sort_order"),
        Query.orderDesc("$createdAt"),
      ]);
      setSlides((rows.filter((r) => r.image_url) as Slide[]));
    } catch (e) {
      console.error("Error fetching cards:", e);
    }
  };

  useEffect(() => {
    load();
    let unsub: any;
    subscribeRows(TBL.CARDS, (ev, row) => {
      if (row?.category !== category) return;
      load();
    }).then((u) => (unsub = u));
    return () => { if (unsub?.close) unsub.close(); };
  }, [category]);

  if (slides.length === 0) return null;

  const loop = [...slides, ...slides, ...slides, ...slides];
  const duration = slides.length * 15;

  const getCardTitle = (s: Slide) => {
    const enText = s.title_en || s.value_en || s.name_en || "";
    const arText = s.title_ar || s.value_ar || s.name_ar || "";
    return t(lang, enText, arText).trim();
  };

  return (
    <section className="container mx-auto px-4 sm:px-8 py-6 overflow-hidden">
      <h2 className={`text-2xl font-extrabold text-slate-800 mb-4 ${lang === "ar" ? "text-right" : "text-left"}`}>
        {t(lang, heading.en, heading.ar)}
      </h2>
      <div className="relative w-full overflow-hidden">
        <div className="flex flex-nowrap gap-4 marquee-track w-max" style={{ animationDuration: `${duration}s` }}>
          {loop.map((s, i) => {
            const displayTitle = getCardTitle(s);
            return (
              <div key={`${s.$id}-${i}`}
                className="relative shrink-0 w-[280px] sm:w-[320px] aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-md transform hover:scale-[1.02] transition-transform duration-300 flex flex-col">
                <div className="w-full flex-1 overflow-hidden bg-slate-100">
                  <img src={s.image_url!} alt={displayTitle || "Slider Image"}
                    className="w-full h-full object-cover" loading="lazy" />
                </div>
                {displayTitle && (
                  <div className="bg-white p-3 border-t border-slate-100 z-10">
                    <p className={`font-bold text-sm sm:text-base truncate ${lang === "ar" ? "text-right" : "text-left"}`} style={{ color: '#000000' }}>
                      {displayTitle}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
