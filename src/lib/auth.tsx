import { createContext, useContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  user_id: string;
  display_name: string;
  scholar_title: string;
  xp: number;
  coins: number;
  level: number;
  streak: number;
  last_active_date: string | null;
  avatar_config: Record<string, string>;
  disclaimer_accepted: boolean;
  suspended: boolean;
};

type AuthValue = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isGuest: boolean;
  continueAsGuest: () => void;
  exitGuest: () => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);
const GUEST_KEY = "nahj.guest";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (uid: string) => {
    const [{ data: p }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    setProfile((p as Profile | null) ?? null);
    setIsAdmin(Boolean(roles?.some((r) => r.role === "admin")));
  }, []);

  useEffect(() => {
    setIsGuest(typeof window !== "undefined" && localStorage.getItem(GUEST_KEY) === "1");

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        setIsGuest(false);
        localStorage.removeItem(GUEST_KEY);
        setTimeout(() => void load(s.user.id), 0);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
    });

    void supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session?.user) await load(data.session.user.id);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, [load]);

  const refreshProfile = useCallback(async () => {
    if (session?.user) await load(session.user.id);
  }, [session, load]);

  const value = useMemo<AuthValue>(
    () => ({
      loading,
      session,
      user: session?.user ?? null,
      profile,
      isAdmin,
      isGuest,
      continueAsGuest: () => {
        localStorage.setItem(GUEST_KEY, "1");
        setIsGuest(true);
      },
      exitGuest: () => {
        localStorage.removeItem(GUEST_KEY);
        setIsGuest(false);
      },
      refreshProfile,
      signOut: async () => {
        await supabase.auth.signOut();
        localStorage.removeItem(GUEST_KEY);
        setIsGuest(false);
        setProfile(null);
        setIsAdmin(false);
      },
    }),
    [loading, session, profile, isAdmin, isGuest, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
