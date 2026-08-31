import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n, t } from "@/lib/i18n";

type Props = { onBack: () => void; onSuccess: () => void };

export default function AdminLogin({ onBack, onSuccess }: Props) {
  const { lang } = useI18n();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const cleanEmail = email.trim().toLowerCase();
    try {
      await signIn(cleanEmail, password);
      setLoading(false);
      onSuccess();
    } catch (err: any) {
      setError(t(lang, "Invalid login credentials", "بيانات تسجيل الدخول غير صحيحة"));
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[65vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-800 text-center">
          {t(lang, "Admin Login", "تسجيل دخول الأدمن")}
        </h1>
        <p className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-center">
          {t(lang, "This page is for admin only", "هذه الصفحة مخصصة للأدمن فقط")}
        </p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t(lang, "Email", "البريد الإلكتروني")}</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t(lang, "Password", "كلمة المرور")}</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <p className="text-xs text-slate-400 text-center">
            {t(lang, "Only the registered admin can log in.", "يمكن للأدمن المسجل فقط تسجيل الدخول.")}
          </p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 rounded-lg bg-emerald-700 text-white py-2.5 font-semibold hover:bg-emerald-800 disabled:opacity-60">
              {loading ? "..." : t(lang, "Log in", "تسجيل الدخول")}
            </button>
            <button type="button" onClick={onBack}
              className="flex-1 rounded-lg border border-slate-300 text-slate-700 py-2.5 font-semibold hover:bg-slate-50">
              {t(lang, "Back", "رجوع")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
