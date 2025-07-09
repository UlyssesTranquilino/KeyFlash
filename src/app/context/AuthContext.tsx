"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { createClient } from "../../../utils/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  serverSession,
}: {
  children: React.ReactNode;
  serverSession?: Session | null;
}) {
  const [session, setSession] = useState<Session | null>(serverSession || null);
  const [user, setUser] = useState<User | null>(serverSession?.user || null);
  const [loading, setLoading] = useState(!serverSession); // If serverSession exists, no initial loading

  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;

    // If a server session was provided, user and session are already set.
    // We only need to fetch the session if it wasn't provided by the server (e.g., direct client-side navigation or first load where server didn't get a session).

    if (!serverSession) {
      const getInitialSession = async () => {
        if (ignore) return;

        setLoading(true);
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!ignore) {
          if (error) {
            console.error("Error getting initial session:", error.message);
            setUser(null);
            setSession(null);
          } else {
            setSession(session);
            setUser(session?.user ?? null);
          }

          setLoading(false);
        }
      };

      getInitialSession();
    } else {
      // If serverSession was provided, ensure loading is set to false right away
      setLoading(false);
    }

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (ignore) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);

      // Refresh server-side props when auth changes
      if (["SIGNED_IN", "SIGNED_OUT"].includes(event)) {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router, serverSession]);

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);

    if (error) {
      console.error("Sign out error:", error);
    }
    router.push("/signin");
  };

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      signOut,
    }),
    [user, session, loading]
  );

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
