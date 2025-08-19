"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { User, Session, SupabaseClient } from "@supabase/supabase-js";
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
  user: TransformedUser | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (
    updates: Partial<Profile>
  ) => Promise<{ error: string | null }>;
}

interface AuthProviderProps {
  children: React.ReactNode;
  serverSession?: Session | null;
  supabase: SupabaseClient;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  serverSession,
  supabase,
}: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(serverSession || null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(
    serverSession?.user || null
  );
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(!serverSession);
  const [profileLoading, setProfileLoading] = useState(false); // Add this state
  
  // Track if we're on the client side and hydrated
  const [isHydrated, setIsHydrated] = useState(false);

  // Set hydrated state after component mounts
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  /** Fetch the user's profile */
  const refreshProfile = async () => {
    if (!supabaseUser?.id) {
      setProfile(null);
      setProfileLoading(false); // Set profile loading to false
      return;
    }
    
    try {
      setProfileLoading(true); // Start profile loading
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", supabaseUser.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    }finally {
      setProfileLoading(false); // End profile loading
    }
  };

  /** Update profile in DB, then refresh local state */
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!supabaseUser?.id) {
      return { error: "User not authenticated" };
    }
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", supabaseUser.id);

      if (error) {
        console.error("Error updating profile:", error);
        return { error: error.message };
      }

      await refreshProfile();
      return { error: null };
    } catch (error) {
      console.error("Profile update error:", error);
      return { error: "Failed to update profile" };
    }
  };

  // Fetch profile when user changes
  useEffect(() => {
    if (isHydrated) {
      refreshProfile();
    }
  }, [supabaseUser?.id, isHydrated]);

  // Handle session and auth state changes
  useEffect(() => {
    if (!isHydrated) return;
    
    let isEffectActive = true;

    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        
        if (!isEffectActive) return;
        
        if (error) throw error;
        
        setSession(session);
        setSupabaseUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
        setSession(null);
        setSupabaseUser(null);
      } finally {
        if (isEffectActive) {
          setLoading(false);
        }
      }
    };

    // Only get session if we don't have a server session
    if (!serverSession) {
      getSession();
    } else {
      setLoading(false);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isEffectActive || !isHydrated) return;
      
      setSession(currentSession);
      setSupabaseUser(currentSession?.user ?? null);

      if (event === "SIGNED_OUT") {
        // Clear cookies
        if (typeof document !== 'undefined') {
          document.cookie =
            "sb-access-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          document.cookie =
            "sb-refresh-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        }
        
        // Navigate to signin
        if (typeof window !== 'undefined') {
          window.location.href = "/signin";
        }
      }
      
      if (["SIGNED_IN", "SIGNED_OUT"].includes(event)) {
        // Small delay to ensure state is updated before refresh
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }, 100);
      }
    });

    return () => {
      isEffectActive = false;
      subscription?.unsubscribe();
    };
  }, [supabase, serverSession, isHydrated]);
  
  const signOut = async () => {
    if (!isHydrated) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state
      setSupabaseUser(null);
      setSession(null);
      setProfile(null);
      
      // Navigate to signin
      if (typeof window !== 'undefined') {
        window.location.href = "/signin";
      }
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user: transformUser(supabaseUser, profile),
      session,
      loading: loading || !isHydrated || profileLoading, 
      signOut,
      refreshProfile,
      updateProfile,
    }),
    [supabaseUser, profile, session, loading, isHydrated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}