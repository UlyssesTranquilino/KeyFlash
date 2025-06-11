"use client";

import Image from "next/image";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Logo from "../../../../public/KeyFlashLogo.png";

import Link from "next/link";

export default function Navbar() {
  const { setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <nav className="p-7 grid grid-cols-3 items-center w-full max-w-300">
      <div className="flex items-center gap-3">
        <Image src={Logo} alt="KeyFlash Logo" className="w-9 " />
        <h1 className="font-medium text-lg"> KeyFlash</h1>
      </div>

      <div className="flex items-center justify-center gap-7">
        <Link className="text-gray-200 hover:text-white " href="/">
          Home
        </Link>
        <Link className="text-gray-200 hover:text-white " href="/">
          About
        </Link>
        <Link className="text-gray-200 hover:text-white " href="/">
          Contact
        </Link>
      </div>

      <div className="flex items-center justify-end gap-5">
        <button
          className="cursor-pointer text-gray-200 hover:text-white scale-95"
          onClick={toggleTheme}
        >
          {isDarkMode ? <Sun /> : <Moon />}
        </button>

        <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-md p-px text-xs font-semibold leading-6 text-white inline-block">
          <span className="absolute inset-0 overflow-hidden rounded-md">
            <span className="absolute inset-0 rounded-md bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="relative flex space-x-2 items-center z-10 rounded-md bg-zinc-950 py-2 px-4 ring-1 ring-white/10">
            <span>Get Started</span>
          </div>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-400/0 via-blue-400/90 to-cyan-400/0 transition-opacity duration-500 group-hover:opacity-40" />
        </button>
      </div>
    </nav>
  );
}
