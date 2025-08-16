"use client";

import { useMemo, useEffect, useState } from "react";
import { AuthProvider as BaseAuthProvider } from "@/app/context/AuthContext";
import { createClient } from "./utils/supabase/client";

 export default function AuthProviderClient({ 
  serverSession, 
  children 
}: { 
  serverSession: any; 
  children: React.ReactNode 
}) {
  const [isMounted, setIsMounted] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  // Wait for hydration to complete
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render the AuthProvider until we're on the client
  if (!isMounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <BaseAuthProvider serverSession={serverSession} supabase={supabase}>
      {children}
    </BaseAuthProvider>
  );
}