import { useEffect, useRef } from "react";
import { useI18n, t } from "@/lib/i18n";

export default function Splash({
  leaving,
  onLeave,
  onDone,
}: {
  leaving: boolean;
  onLeave: () => void;
  onDone: () => void;
}) {
  const { lang } = useI18n();
  const onLeaveRef = useRef(onLeave);
  const onDoneRef = useRef(onDone);
  onLeaveRef.current = onLeave;
  onDoneRef.current = onDone;

  useEffect(() => {
    const hold = setTimeout(() => onLeaveRef.current(), 3000);
    return () => clearTimeout(hold);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const done = setTimeout(() => onDoneRef.current(), 1200);
    return () => clearTimeout(done);
  }, [leaving]);

  return (
    <div className={`fixed inset-0 z-[100] overflow-hidden ${leaving ? "splash-leaving" : ""}`}>
      {/* Two curtain halves that open from the center seam outward to the sides */}
      <div className="splash-panel splash-panel-left">
        <div className="splash-panel-glow-left" />
      </div>
      <div className="splash-panel splash-panel-right">
        <div className="splash-panel-glow-right" />
      </div>

      <div className="splash-bg-grid" />

      {/* Centered column: letters side by side on top, text below them */}
      <div className="splash-column z-10">
        <div className="splash-wordmark flex items-baseline" dir="ltr">
          <span className="splash-letter splash-letter-j">J</span>
          <span className="splash-letter splash-letter-s">S</span>
        </div>

        <div className="splash-subline">
          <p className="px-6 text-center text-emerald-200/90 text-sm sm:text-base font-semibold tracking-wide">
            {t(
              lang,
              "Interior Finishing & Contracting",
              "التشطيبات الداخلية والمقاولات العامة"
            )}
          </p>
          <div className="mt-6 flex justify-center">
            <div className="splash-loader-ring" />
          </div>
        </div>
      </div>
    </div>
  );
}
