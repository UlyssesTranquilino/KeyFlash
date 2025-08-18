import type { Metadata } from "next";
import { jakartaSans } from "./ui/fonts";
import "./globals.css";
import { ThemeProvider } from "./ui/theme-provider";
import AuthProviderWrapper from "@/components/ui/AuthProviderWrapper";
import Navbar from "./ui/navbar/navbar";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import Footer from "@/components/Footer";

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



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakartaSans.className}  antialiased bg-black  `}>
        <TestModeContextProvider>
          <AuthProviderWrapper>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <ConditionalNavbar />
              {children}

              <Footer />
            </ThemeProvider>
          </AuthProviderWrapper>
        </TestModeContextProvider>
      </body>
    </html>
  );
}
