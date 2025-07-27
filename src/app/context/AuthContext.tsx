'use client';

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
  const [loading, setLoading] = useState(!serverSession);

  const supabase = useMemo(() => createClient(), []);

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);

    if (error) {
      console.error("Sign out error:", error);
    }

    // Delay routing to ensure we're in a mounted context
    if (typeof window !== 'undefined') {
      window.location.href = "/signin";
    }
  };

  useEffect(() => {
    let ignore = false;
    const router = useRouter(); 

    const setupAuth = async () => {
      if (!serverSession) {
        setLoading(true);

        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (!ignore) {
          if (userError || sessionError) {
            console.error("Error getting initial session/user:", userError || sessionError);
            setUser(null);
            setSession(null);
          } else {
            setUser(userData.user ?? null);
            setSession(sessionData.session ?? null);
          }

          setLoading(false);
        }
      } else {
        setLoading(false);
      }

      // Auth listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
        if (ignore) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        if (["SIGNED_IN", "SIGNED_OUT"].includes(event)) {
          router.refresh();
        }
      });

      return () => subscription.unsubscribe();
    };

    setupAuth();

    return () => {
      ignore = true;
    };
  }, [supabase, serverSession]);

  const value = useMemo(
    () => ({ user, session, loading, signOut }),
    [user, session, loading]
  );

  return (
    <AuthContext.Provider value={value}>
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
