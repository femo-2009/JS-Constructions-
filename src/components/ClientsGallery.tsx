import { useEffect, useState } from "react";
import { useI18n, t } from "@/lib/i18n";
import { listRows, subscribeRows, Query, TBL } from "@/lib/rows";
import { ArrowRight, ArrowLeft } from "lucide-react";

type Item = { $id: string; title_en: string; title_ar: string; image_url: string | null };

export default function ClientsGallery() {
  const { lang } = useI18n();
  const [items, setItems] = useState<Item[]>([]);
  const [offset, setOffset] = useState(0);

  const load = async () => {
    try {
      const rows = await listRows(TBL.CARDS, [
        Query.equal("category", "clients"),
        Query.orderDesc("$createdAt"),
      ]);
      setItems((rows.filter((r) => r.image_url) as Item[]));
    } catch (e) {
      console.error("Error fetching clients:", e);
    }
  };

  useEffect(() => {
    load();
    let unsub: any;
    subscribeRows(TBL.CARDS, (ev, row) => {
      if (row?.category !== "clients") return;
      load();
    }).then((u) => (unsub = u));
    return () => { if (unsub?.close) unsub.close(); };
  }, []);

  useEffect(() => {
    if (items.length <= 6) return;
    const id = setInterval(() => setOffset((o) => (o + 6) % items.length), 5000);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  const slice: Item[] = [];
  const count = Math.min(6, items.length);
  for (let i = 0; i < count; i++) slice.push(items[(offset + i) % items.length]);

  return (
    <section className="container mx-auto px-4 sm:px-8 py-8">
      <h2 className={`text-2xl font-extrabold text-slate-800 mb-4 ${lang === "ar" ? "text-right" : "text-left"}`}>
        {t(lang, "Our Clients", "عملاؤنا")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {slice.map((it, i) => (
          <div key={`${it.$id}-${i}`} className="aspect-square rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
            <img src={it.image_url!} alt={t(lang, it.title_en, it.title_ar)}
              className="w-full h-full object-cover fade-slide" style={{ opacity: 1 }} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <a href="#Clients"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5">
          {t(lang, "See All Clients", "عرض جميع العملاء")}
          {lang === "ar" ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </a>
      </div>
    </section>
  );
}
