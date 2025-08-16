// src/components/ui/AuthProviderClient.tsx
"use client";

import { useMemo } from "react";
import { AuthProvider as BaseAuthProvider } from "@/app/context/AuthContext";
import { createClient } from "../../../utils/supabase/client";

export default function AuthProviderClient({ 
  serverSession, 
  children 
}: { 
  serverSession: any; 
  children: React.ReactNode 
}) {
  const supabase = useMemo(() => createClient(), []);

  return (
    <BaseAuthProvider serverSession={serverSession} supabase={supabase}>
      {children}
    </BaseAuthProvider>
  );
}