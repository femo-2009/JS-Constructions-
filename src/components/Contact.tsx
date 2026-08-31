import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n, t } from "@/lib/i18n";
import { listRows, createRow, updateRow, deleteRow, subscribeRows, TBL } from "@/lib/rows";
import { Phone, Mail, Plus, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";

type Phone = { $id: string; label: string | null; number: string };
type EmailRow = { $id: string; label: string | null; email: string };

export default function Contact() {
  const { lang } = useI18n();
  const { user } = useAuth();

  const [phones, setPhones] = useState<Phone[]>([]);
  const [emails, setEmails] = useState<EmailRow[]>([]);

  const load = async () => {
    const [p, e] = await Promise.all([
      listRows(TBL.PHONES),
      listRows(TBL.EMAILS),
    ]);
    const sort = (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0);
    setPhones(p.sort(sort) as Phone[]);
    setEmails(e.sort(sort) as EmailRow[]);
  };

  useEffect(() => {
    load();
    let unsubPhones: any;
    let unsubEmails: any;
    subscribeRows(TBL.PHONES, load).then((u) => (unsubPhones = u));
    subscribeRows(TBL.EMAILS, load).then((u) => (unsubEmails = u));
    return () => {
      if (unsubPhones?.close) unsubPhones.close();
      if (unsubEmails?.close) unsubEmails.close();
    };
  }, []);

  const savePhone = async (id: string | null, label: string, value: string) => {
    const data = { label: label || null, number: value };
    if (id) await updateRow(TBL.PHONES, id, data);
    else await createRow(TBL.PHONES, data, user?.$id ?? null);
    load();
  };

  const saveEmail = async (id: string | null, label: string, value: string) => {
    const data = { label: label || null, email: value };
    if (id) await updateRow(TBL.EMAILS, id, data);
    else await createRow(TBL.EMAILS, data, user?.$id ?? null);
    load();
  };

  return (
    <section className="container mx-auto px-4 sm:px-8 py-10 max-w-3xl">
      <h2 className={`text-3xl font-extrabold text-slate-800 mb-6 ${lang === "ar" ? "text-right" : "text-left"}`}>
        {t(lang, "Contact Us", "اتصل بنا")}
      </h2>

      <ListSection<Phone>
        icon={<Phone className="w-5 h-5 text-emerald-600" />}
        title={t(lang, "Phone numbers", "أرقام الهاتف")}
        items={phones}
        renderRow={(p) => (
          <a href={`tel:${p.number}`} dir="ltr" className="text-emerald-700 hover:underline font-medium">{p.number}</a>
        )}
        valuePlaceholder="+201000000000"
        table={TBL.PHONES}
        onSave={savePhone}
      />

      <ListSection<EmailRow>
        icon={<Mail className="w-5 h-5 text-orange-600" />}
        title={t(lang, "Emails", "البريد الإلكتروني")}
        items={emails}
        renderRow={(e) => (
          <a href={`mailto:${e.email}`} dir="ltr" className="text-emerald-700 hover:underline font-medium">{e.email}</a>
        )}
        valuePlaceholder="info@example.com"
        table={TBL.EMAILS}
        onSave={saveEmail}
      />
    </section>
  );
}

function ListSection<T extends { $id: string; label: string | null }>(props: {
  icon: React.ReactNode; title: string; items: T[]; renderRow: (it: T) => React.ReactNode;
  valuePlaceholder: string; table: string; onSave: (id: string | null, label: string, value: string) => Promise<void>;
}) {
  const { lang } = useI18n();
  const { isAdmin } = useAuth();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftLabel, setDraftLabel] = useState("");
  const [draftValue, setDraftValue] = useState("");
  const [busy, setBusy] = useState(false);

  const beginAdd = () => { setAdding(true); setEditingId(null); setDraftLabel(""); setDraftValue(""); };
  const beginEdit = (it: T) => { setAdding(false); setEditingId(it.$id); setDraftLabel(it.label || ""); setDraftValue(String((it as any).number || (it as any).email || "")); };

  const save = async () => {
    const v = draftValue.trim();
    if (!v || busy) return;
    setBusy(true);
    try {
      await props.onSave(editingId, draftLabel.trim(), v);
      setAdding(false); setEditingId(null);
    } finally {
      setBusy(false);
    }
  };
  const remove = async (id: string) => {
    if (!confirm(t(lang, "Delete this item?", "حذف هذا العنصر؟"))) return;
    if (busy) return;
    setBusy(true);
    try {
      await deleteRow(props.table, id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">{props.icon} {props.title}</h3>
        {isAdmin && !adding && <button onClick={beginAdd} disabled={busy} className="text-sm inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"><Plus className="w-3.5 h-3.5" /> {t(lang, "Add", "إضافة")}</button>}
      </div>

      <ul className="divide-y divide-slate-100">
        {props.items.map((it) => (
          <li key={it.$id} className="py-2 flex items-center justify-between gap-3 flex-wrap">
            {editingId === it.$id ? (
              <div className="flex gap-2 flex-1">
                <input value={draftLabel} onChange={(e) => setDraftLabel(e.target.value)} placeholder={t(lang, "Label (optional)", "الوصف (اختياري)")} className="rounded-lg border border-slate-300 px-2 py-1 text-sm w-32" />
                <input dir="ltr" value={draftValue} onChange={(e) => setDraftValue(e.target.value)} placeholder={props.valuePlaceholder} className="flex-1 rounded-lg border border-slate-300 px-2 py-1 text-sm" />
                <button onClick={save} disabled={busy} className="px-2 py-1 rounded-lg bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}</button>
                <button onClick={() => setEditingId(null)} disabled={busy} className="px-2 py-1 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 min-w-0">
                  {it.label && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{it.label}</span>}
                  {props.renderRow(it)}
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button onClick={() => beginEdit(it)} disabled={busy} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"><Pencil className="w-3 h-3" /></button>
                    <button onClick={() => remove(it.$id)} disabled={busy} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"><Trash2 className="w-3 h-3" /></button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
        {props.items.length === 0 && !adding && (
          <li className="py-3 text-sm text-slate-400">{t(lang, "Nothing yet.", "لا يوجد شيء بعد.")}</li>
        )}
      </ul>

      {adding && (
        <div className="mt-3 flex gap-2">
          <input value={draftLabel} onChange={(e) => setDraftLabel(e.target.value)} placeholder={t(lang, "Label (optional)", "الوصف (اختياري)")} className="rounded-lg border border-slate-300 px-2 py-1 text-sm w-32" />
          <input dir="ltr" value={draftValue} onChange={(e) => setDraftValue(e.target.value)} placeholder={props.valuePlaceholder} className="flex-1 rounded-lg border border-slate-300 px-2 py-1 text-sm" />
          <button onClick={save} disabled={busy} className="px-3 py-1 rounded-lg bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}</button>
          <button onClick={() => setAdding(false)} disabled={busy} className="px-3 py-1 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"><X className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}
