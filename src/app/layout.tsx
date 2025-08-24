import type { Metadata } from "next";
import { jakartaSans } from "./ui/fonts";
import "./globals.css";
import { ThemeProvider } from "./ui/theme-provider";
import Navbar from "./ui/navbar/navbar";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import Footer from "@/components/Footer";
import AuthProviderClient from "@/components/ui/AuthProviderClient";

export const metadata: Metadata = {
  title: "KeyFlash",
  description: "Typing-powered flashcards",
  icons: {
    icon: "/KeyFlashLogo.png",
    shortcut: "/KeyFlashLogo.png",
    apple: "/KeyFlashLogo.png",
  },
};
import { TestModeContextProvider } from "@/context/TestModeContext";
import ClientWrapper from "@/components/ClientWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`__className_550977  ${jakartaSans.className}  antialiased bg-black`}
        suppressHydrationWarning={true}
      >
        <TestModeContextProvider>
          <AuthProviderClient serverSession={undefined}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <ClientWrapper>{children}</ClientWrapper>
            </ThemeProvider>
          </AuthProviderClient>
        </TestModeContextProvider>
      </body>
    </html>
  );
}
