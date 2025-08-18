"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({
  children,
  supabase,
  serverSession,
}: {
  children: React.ReactNode;
  supabase: any;
  serverSession: any;
}) {
  const [user, setUser] = useState(serverSession?.user ?? null);



  return (
    <AuthContext.Provider value={{ user, setUser, supabase }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
