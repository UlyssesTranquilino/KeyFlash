import type { Metadata } from "next";
import { jakartaSans } from "./ui/fonts";
import "./globals.css";
import { ThemeProvider } from "./ui/theme-provider";
import Navbar from "./ui/navbar/navbar";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import Footer from "@/components/Footer";
import AuthProviderClient from "@/components/ui/AuthProviderClient";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://keyflash.app"),
  title: {
    default: "KeyFlash – Learn by Typing",
    template: "%s | KeyFlash",
  },
  description:
    "Typing‑powered flashcards and practice modes that boost recall, accuracy, and WPM. Upload notes or code, then master by typing.",
  keywords: [
    "typing flashcards",
    "learn by typing",
    "active recall",
    "typing practice app",
    "flashcard typing mode",
    "WPM tracking",
    "study app",
    "code typing practice",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://keyflash.app/",
    siteName: "KeyFlash",
    title: "KeyFlash – Learn by Typing",
    description:
      "Turn notes into interactive typing sessions. Boost retention with active recall, WPM tracking, and gamified repetition.",
    images: [
      {
        url: "/KeyFlashLogo.png",
        width: 1200,
        height: 630,
        alt: "KeyFlash – Typing‑powered flashcards",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  themeColor: "#0A1A2F", // match your brand/navy
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
              <ClientWrapper>
                <Script
                  src="https://www.googletagmanager.com/gtag/js?id=G-692LX2CBYH"
                  strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                  {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-692LX2CBYH');
          `}
                </Script>

                {children}
              </ClientWrapper>
            </ThemeProvider>
          </AuthProviderClient>
        </TestModeContextProvider>
      </body>
    </html>
  );
}
