import { useState } from "react";
import { useI18n, t } from "@/lib/i18n";
import ImageUpload from "./ImageUpload";
import { deleteImage } from "@/lib/upload";
import { X, Loader2 } from "lucide-react";
import type { CardRow } from "./CardsPage";

export default function CardEditor({
  initial, category, onClose, onSave,
}: {
  initial: CardRow | null;
  category: "works" | "clients" | "services";
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const { lang } = useI18n();
  const [titleEn, setTitleEn] = useState(initial?.title_en ?? "");
  const [titleAr, setTitleAr] = useState(initial?.title_ar ?? "");
  const [descEn, setDescEn] = useState(initial?.description_en ?? "");
  const [descAr, setDescAr] = useState(initial?.description_ar ?? "");
  const [image, setImage] = useState<string | null>(initial?.image_url ?? null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const save = async () => {
    if (busy) return;
    setBusy(true); setErr("");
    const payload = {
      category,
      title_en: titleEn.trim(),
      title_ar: titleAr.trim(),
      description_en: descEn.trim(),
      description_ar: descAr.trim(),
      image_url: image,
    };
    try {
      await onSave(payload);
      if (initial?.image_url && initial.image_url !== image) {
        await deleteImage(initial.image_url).catch(() => {});
      }
      onClose();
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="font-bold text-slate-800">
            {initial ? t(lang, "Edit card", "تعديل البطاقة") : t(lang, "Add new card", "إضافة بطاقة جديدة")}
          </h3>
          <button onClick={onClose} disabled={busy} className="text-slate-500 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <ImageUpload value={image} onChange={setImage} folder={category} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t(lang, "Title (English)", "العنوان (إنجليزي)")} value={titleEn} onChange={setTitleEn} dir="ltr" />
            <Field label={t(lang, "Title (Arabic)", "العنوان (عربي)")} value={titleAr} onChange={setTitleAr} dir="rtl" />
            <TextArea label={t(lang, "Description (English)", "الوصف (إنجليزي)")} value={descEn} onChange={setDescEn} dir="ltr" />
            <TextArea label={t(lang, "Description (Arabic)", "الوصف (عربي)")} value={descAr} onChange={setDescAr} dir="rtl" />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} disabled={busy} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">{t(lang, "Cancel", "إلغاء")}</button>
            <button onClick={save} disabled={busy} className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
              {busy ? <><Loader2 className="w-4 h-4 inline animate-spin" /> {t(lang, "Saving...", "جارٍ الحفظ...")}</> : t(lang, "Save", "حفظ")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, dir }: { label: string; value: string; onChange: (v: string) => void; dir: "ltr" | "rtl" }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-700 mb-1">{label}</span>
      <input dir={dir} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
    </label>
  );
}
function TextArea({ label, value, onChange, dir }: { label: string; value: string; onChange: (v: string) => void; dir: "ltr" | "rtl" }) {
  return (
    <label className="block sm:col-span-1">
      <span className="block text-sm font-semibold text-slate-700 mb-1">{label}</span>
      <textarea dir={dir} rows={3} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
    </label>
  );
}
