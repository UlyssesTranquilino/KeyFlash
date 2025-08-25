"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
const Footer = () => {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith("/dashboard");

  return (
    <div className="bottom-0 mx-auto w-full ">
      <footer
        className={cn(
          "w-full  border-t border-white/10 py-8 px-4 text-sm text-center text-white/80",
          isDashboardRoute && "bg-black/60 md:px-20",
        )}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto gap-4 ">
          <div
            className={cn(
              "flex flex-col items-center  sm:items-start lg:flex-row  gap-4 lg:gap-6 w-full",
              isDashboardRoute && "",
            )}
          >
            <p className="text-white/80 hover:text-white transition-colors duration-200">
              © 2025 KeyFlash. All rights reserved.
            </p>
            <div className="hidden lg:block h-4 w-px bg-white/20" />
            <p className="text-white/80 hover:text-white transition-colors duration-200">
              Contact us at{" "}
              <a
                href="mailto:support@keyflash.app"
                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200"
              >
                support@keyflash.app
              </a>
            </p>
          </div>

          <div className="flex gap-6 text-white/60 text-sm">
            <Link href="/" className="hover:text-white transition">
              About
            </Link>
            <Link href="/pricing" className="hover:text-white transition">
              Pricing
            </Link>
            <Link href="/support" className="hover:text-white transition">
              Support
            </Link>
            <Link href="/contact" className="hover:text-white transition">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-white transition">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
