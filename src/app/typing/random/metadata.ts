import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Typing Practice — Words, Code & Prompts | KeyFlash",
  description:
    "Practice typing with random words, code snippets, and prompts to improve speed and accuracy. Great for warmups and drills.",
  alternates: { canonical: "/typing/random" },
  keywords: [
    "random typing",
    "typing drills",
    "code typing",
    "typing practice app",
    "WPM training",
    "KeyFlash",
  ],
  openGraph: {
    title: "Random Typing Practice — KeyFlash",
    description:
      "Boost your typing speed and accuracy with randomized words, quotes, and code snippets. Track progress and play with repetition.",
    url: "https://keyflash.app/typing/random",
    images: [
      {
        url: "/KeyFlashLogo.png", // swap for /og/random-1200x630.png if available
        width: 1200,
        height: 630,
        alt: "Random Typing Practice — KeyFlash",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Random Typing Practice — KeyFlash",
    description:
      "Boost your typing speed and accuracy with randomized words, quotes, and code snippets.",
    images: ["/KeyFlashLogo.png"],
  },
};
