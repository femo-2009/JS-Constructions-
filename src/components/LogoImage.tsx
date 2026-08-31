import { useState } from "react";
import { HardHat } from "lucide-react";

export default function LogoImage({ className = "", alt = "JS Constructions" }: { className?: string; alt?: string }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className={`flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 ${className}`} aria-label={alt}>
        <HardHat className="w-1/2 h-1/2" strokeWidth={2.5} />
      </div>
    );
  }
  return <img src="/logo.png" alt={alt} className={`object-contain ${className}`} onError={() => setErr(true)} />;
}
