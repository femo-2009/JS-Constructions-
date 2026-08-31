import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n, t } from "@/lib/i18n";
import CardEditor from "./CardEditor";
import { listRows, createRow, updateRow, deleteRow, subscribeRows, Query, TBL } from "@/lib/rows";
import { deleteImage } from "@/lib/upload";
import { Pencil, Trash2, Plus, ImageOff, Loader2 } from "lucide-react";

export type CardRow = Record<string, any> & { $id: string };

export default function CardsPage({ category, title, subtitle }: {
  category: "works" | "clients" | "services";
  title: { en: string; ar: string };
  subtitle: { en: string; ar: string };
}) {
  const { lang } = useI18n();
  const { isAdmin, user } = useAuth();
  const [cards, setCards] = useState<CardRow[]>([]);
  const [editing, setEditing] = useState<CardRow | null | undefined>(undefined); // undefined = closed
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    const rows = await listRows(TBL.CARDS, [
      Query.equal("category", category),
      Query.orderAsc("sort_order"),
      Query.orderDesc("$createdAt"),
    ]);
    setCards(rows);
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

  const remove = async (c: CardRow) => {
    if (!confirm(t(lang, "Delete this card?", "حذف هذه البطاقة؟"))) return;
    if (deletingId) return;
    setDeletingId(c.$id);
    try {
      await deleteRow(TBL.CARDS, c.$id);
      await deleteImage(c.image_url).catch(() => {});
    } finally {
      setDeletingId(null);
    }
  };

  const onSave = async (data: any) => {
    if (editing) {
      await updateRow(TBL.CARDS, editing.$id, data);
    } else {
      await createRow(TBL.CARDS, { category, ...data }, user?.$id ?? null);
    }
  };

  return (
    <section className="container mx-auto px-4 sm:px-8 py-10">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div className={lang === "ar" ? "text-right" : "text-left"}>
          <h2 className="text-3xl font-extrabold text-slate-800">{t(lang, title.en, title.ar)}</h2>
          <p className="text-slate-500 mt-1">{t(lang, subtitle.en, subtitle.ar)}</p>
        </div>
        {isAdmin && (
          <button onClick={() => setEditing(null)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800">
            <Plus className="w-4 h-4" /> {t(lang, "Add new", "إضافة جديد")}
          </button>
        )}
      </div>

      {cards.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          {t(lang, "Nothing here yet.", "لا يوجد محتوى بعد.")}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <article key={c.$id} className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
            <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
              {c.image_url ? (
                <img src={c.image_url} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageOff className="w-12 h-12" /></div>
              )}
            </div>
            <div className={`p-4 ${lang === "ar" ? "text-right" : "text-left"}`}>
              {(c.title_en || c.title_ar) && (
                <h3 className="font-bold text-slate-800 line-clamp-2">
                  {t(lang, c.title_en, c.title_ar)}
                </h3>
              )}
              <p className="mt-1 text-sm text-slate-600 line-clamp-3">{t(lang, c.description_en, c.description_ar)}</p>
              {isAdmin && (
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setEditing(c)} disabled={!!deletingId}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Pencil className="w-3.5 h-3.5" /> {t(lang, "Edit", "تعديل")}
                  </button>
                  <button onClick={() => remove(c)} disabled={deletingId === c.$id || !!deletingId}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    {deletingId === c.$id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />} {t(lang, "Delete", "حذف")}
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {editing !== undefined && (
        <CardEditor
          initial={editing}
          category={category}
          onClose={() => setEditing(undefined)}
          onSave={async (data) => { await onSave(data); setEditing(undefined); load(); }}
        />
      )}
    </section>
  );
}
