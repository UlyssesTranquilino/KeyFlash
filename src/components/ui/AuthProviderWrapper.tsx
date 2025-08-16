'use client'

import { createClient } from "@/app/utils/supabase/client";
import { AuthProvider } from "@/app/context/AuthContext";

export default async function AuthProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  

  return <AuthProvider serverSession={session}>{children}</AuthProvider>;
}
