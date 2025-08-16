'use client'

import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { AuthProvider } from "@/app/context/AuthContext";

export default function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  // Optionally show a loader until session is loaded
  if (!session) return null;

  return <AuthProvider serverSession={session}>{children}</AuthProvider>;
}
