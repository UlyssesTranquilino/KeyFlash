"use client"; // Add this at the top

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { WpmProvider } from "../context/WpmContext";
import { TimerProvider } from "../context/TimerContext";
import { QuoteProvider } from "../context/QuoteContext";
import { CodeContextProvider } from "../context/CodeContext";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthProviderClient from "@/components/ui/AuthProviderClient";


export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();


  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin"); // redirect if no user
    }
  }, [user, loading, router]);

  return (
    <AuthProviderClient  serverSession={undefined} >
    <CodeContextProvider>
      <QuoteProvider>
        <TimerProvider>
          <WpmProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                  <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                      orientation="vertical"
                      className="mr-2 data-[orientation=vertical]:h-4"
                    />
                  </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-2 md:p-4 pt-0 mb-20 md:mb-35">
                  {children}
                </div>
              </SidebarInset>
            </SidebarProvider>
          </WpmProvider>
        </TimerProvider>
      </QuoteProvider>
    </CodeContextProvider>
    </AuthProviderClient>
  );
}
