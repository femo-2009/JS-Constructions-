import { useState } from "react";
import { uploadImage } from "@/lib/upload";
import { useI18n, t } from "@/lib/i18n";
import { Upload, Loader2 } from "lucide-react";

export default function ImageUpload({ value, onChange, folder }: { value?: string | null; onChange: (url: string) => void; folder: string }) {
  const { lang } = useI18n();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setErr(t(lang, "Image must be under 8MB", "الصورة يجب أن تكون أقل من 8 ميجا"));
      return;
    }
    setBusy(true); setErr("");
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (e: any) {
      setErr(e.message || "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {value && <img src={value} alt="" className="w-full max-h-48 object-cover rounded-lg border border-slate-200" />}
      <label className="inline-flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {value ? t(lang, "Replace image", "تغيير الصورة") : t(lang, "Upload image", "رفع صورة")}
        <input type="file" accept="image/*" className="hidden" onChange={handle} disabled={busy} />
      </label>
      {err && <p className="text-xs text-red-600">{err}</p>}
    </div>
  );
}
