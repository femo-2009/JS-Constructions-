import { useI18n, t } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function Footer({ onAdminAccess }: { onAdminAccess: () => void }) {
  const { lang } = useI18n();
  const { isAdmin } = useAuth();
  const year = new Date().getFullYear();
  
  return (
    // Modified layout wrapper setup from fixed tracking view to standard content flow block block
    <footer className="w-full mt-12 border-t border-slate-200 bg-white">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center">
        {/* Dynamic global multi-language localization copyright information label */}
        <div className="text-sm sm:text-base text-slate-700">
          {t(lang,
            `© ${year} JS Constructions. All rights reserved.`,
            `© ${year} جي اس للمقاولات - جميع الحقوق محفوظة`)}
        </div>

        <a href="#Contact"
          className="inline-flex items-center gap-2 mt-3 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md transition-colors">
          {t(lang, "Contact Us", "اتصل بنا")}
        </a>
        
        {/* Author production credits portfolio link anchor tracking link node */}
        <a href="https://afraim-porfolio.afraimfarag7.workers.dev/" target="_blank" rel="noreferrer"
          className="block mt-1 text-xs sm:text-sm text-blue-700 hover:text-blue-900 underline">
          Developed by Afraim Farag
        </a>
        
        {/* Secure hidden administrator panel authentication trigger gate interface button */}
        {!isAdmin && (
          <button onClick={onAdminAccess}
            className="absolute bottom-2 right-4 text-[10px] sm:text-xs text-slate-400/70 hover:text-slate-500"
            title={t(lang, "Admin access", "دخول الأدمن")}>
            admin
          </button>
        )}
      </div>
    </footer>
  );
}
