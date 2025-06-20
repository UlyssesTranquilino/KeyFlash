import { Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
export const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "400", "300", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});
