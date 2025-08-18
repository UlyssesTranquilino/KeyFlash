// src/components/ClientWrapper.tsx
'use client';

import ConditionalNavbar from "./ConditionalNavbar";
import Footer from "@/components/Footer";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
<ConditionalNavbar/>
      {children}
      <Footer />
    </>
  );
}