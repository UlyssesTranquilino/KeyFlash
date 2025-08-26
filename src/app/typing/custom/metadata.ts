import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Typing Practice — Code & Text | KeyFlash",
  description:
    "Upload or paste code snippets or regular text to create interactive typing sessions. Practice code syntax, documentation, or lecture notes while tracking WPM and accuracy.",
  alternates: { canonical: "/typing/custom" },
  keywords: [
    "custom typing",
    "code typing",
    "text typing",
    "upload text typing",
    "paste notes",
    "typing practice",
    "KeyFlash",
  ],
  openGraph: {
    title: "Custom Typing Practice — Code & Text | KeyFlash",
    description:
      "Upload or paste code snippets and normal text to make interactive typing sessions that boost retention and accuracy.",
    url: "https://keyflash.app/typing/custom",
    images: [
      {
        url: "/KeyFlashLogo.png", // swap for /og/custom-1200x630.png if you make one
        width: 1200,
        height: 630,
        alt: "Custom Typing Practice — Code & Text",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Typing Practice — Code & Text | KeyFlash",
    description:
      "Upload or paste code snippets and regular text to create interactive typing sessions that improve WPM and accuracy.",
    images: ["/KeyFlashLogo.png"],
  },
};
