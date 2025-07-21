import { supabase } from "../../../utils/supabase-client";
import { createClient } from "../../../utils/supabase/client";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supaase = createClient();

  return (
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
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                  {children}
                </div>
              </SidebarInset>
            </SidebarProvider>
          </WpmProvider>
        </TimerProvider>
      </QuoteProvider>
    </CodeContextProvider>
  );
}
