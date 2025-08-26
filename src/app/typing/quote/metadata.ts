import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quote Typing Practice — Improve WPM & Focus | KeyFlash",
  description:
    "Practice typing with curated quotes to build speed, accuracy, and focus. Track WPM and accuracy as you go.",
  alternates: { canonical: "/typing/quote" },
  keywords: [
    "typing quotes",
    "quote typing practice",
    "typing practice",
    "wpm training",
    "KeyFlash",
  ],
  openGraph: {
    title: "Quote Typing Practice — KeyFlash",
    description:
      "Build speed and accuracy by typing memorable quotes. Track your WPM and accuracy over time.",
    url: "https://keyflash.app/typing/quote",
    images: [
      {
        url: "/KeyFlashLogo.png", // replace with /og/quote-1200x630.png if you create one
        width: 1200,
        height: 630,
        alt: "Quote Typing Practice — KeyFlash",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quote Typing Practice — KeyFlash",
    description:
      "Build speed and accuracy by typing memorable quotes. Track your WPM and accuracy over time.",
    images: ["/KeyFlashLogo.png"],
  },
};
