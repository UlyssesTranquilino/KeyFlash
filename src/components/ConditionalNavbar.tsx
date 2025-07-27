// components/ConditionalNavbar.tsx
"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/app/ui/navbar/navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  if (!pathname) return null; 

  if (pathname.startsWith("/dashboard")) return null;

  return <Navbar />;
}
