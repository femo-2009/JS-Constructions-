import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { account } from "@/integrations/appwrite/client";
import { AppwriteException } from "appwrite";

type AuthUser = {
  $id: string;
  name: string;
  email: string;
  labels: string[];
} | null;

type AuthCtx = {
  user: AuthUser;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};
const Ctx = createContext<AuthCtx>({ user: null, isAdmin: false, loading: true, signIn: async () => {}, signOut: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  // Any logged-in user (valid email + password in the database) is treated as the admin.
  const isAdmin = !!user;

  useEffect(() => {
    let active = true;
    account
      .get()
      .then((u: any) => {
        if (active) {
          setUser({ $id: u.$id, name: u.name, email: u.email, labels: u.labels ?? [] });
        }
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    await account.createEmailPasswordSession({ email, password });
    const u: any = await account.get();
    // Any user that exists in the database (valid email + password) is the admin.
    setUser({ $id: u.$id, name: u.name, email: u.email, labels: u.labels ?? [] });
  };

  const signOut = async () => {
    try {
      await account.deleteSession("current");
    } catch (e) {
      // ignore if no session
    }
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, isAdmin, loading, signIn, signOut }}>{children}</Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
