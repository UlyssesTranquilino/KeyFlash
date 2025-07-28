"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { createClient } from "../../../utils/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { transformUser } from "../../../utils/auth/auth";

interface Profile {
  id: string;
  nickname?: string;
  avatar_url?: string;
  is_pro?: boolean;
  created_at?: string;
}

interface TransformedUser {
  nickname: string;
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  isPro: boolean;
  createdAt: Date;
}

interface AuthContextType {
  user: TransformedUser | null ;
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
  const [supabaseUser, setSupabaseUser] = useState<User | null>(serverSession?.user || null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(!serverSession);

  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  // Fetch user profile when user changes
  useEffect(() => {
    if (!supabaseUser?.id) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', supabaseUser.id)
        .single();
      
      if (!error && data) {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [supabaseUser?.id, supabase]);

  // Handle session and auth state changes
  useEffect(() => {
    let isMounted = true;

    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (error) throw error;

        setSession(session);
        setSupabaseUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
        setSession(null);
        setSupabaseUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (!serverSession) {
      getSession();
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!isMounted) return;

      setSession(currentSession);
      setSupabaseUser(currentSession?.user ?? null);

      if (event === "SIGNED_OUT") {
        // Clear auth cookies
        document.cookie = 'sb-access-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'sb-refresh-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/signin');
      }
      
      if (["SIGNED_IN", "SIGNED_OUT"].includes(event)) {
        router.refresh();
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase, router, serverSession]);

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSupabaseUser(null);
      setSession(null);
      setProfile(null);
      
      window.location.href = '/signin';
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({
    user: transformUser(supabaseUser, profile),
    session,
    loading,
    signOut,
  }), [supabaseUser, profile, session, loading]);

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