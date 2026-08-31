import { useEffect, useState } from "react";
import { AuthProvider } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";
import Splash from "@/components/Splash";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/components/Home";
import Works from "@/components/Works";
import Clients from "@/components/Clients";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import AdminLogin from "@/components/AdminLogin";

function Shell() {
  const [page, setPage] = useState<string>(() => {
    const h = window.location.hash.replace("#", "");
    return h || "Home";
  });

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace("#", "");
      if (h) setPage(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (p: string) => {
    window.location.hash = p;
    setPage(p);
  };

  const render = () => {
    switch (page) {
      case "Works": return <Works />;
      case "Clients": return <Clients />;
      case "Services": return <Services />;
      case "Contact": return <Contact />;
      case "AdminLogin": return <AdminLogin onBack={() => go("Home")} onSuccess={() => go("Home")} />;
      default: return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar page={page} onNavigate={go} />
      <main className="flex-grow pb-24">{render()}</main>
      <Footer onAdminAccess={() => go("AdminLogin")} />
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState<"splash" | "leaving" | "done">("splash");

  const homePhase = phase === "leaving" || phase === "done";

  return (
    <I18nProvider>
      <AuthProvider>
        {homePhase && <Shell />}
        {phase !== "done" && (
          <Splash
            leaving={phase === "leaving"}
            onLeave={() => setPhase("leaving")}
            onDone={() => setPhase("done")}
          />
        )}
      </AuthProvider>
    </I18nProvider>
  );
}
