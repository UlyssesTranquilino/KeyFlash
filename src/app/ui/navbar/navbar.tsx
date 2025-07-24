"use client";

import Image from "next/image";
import { useState } from "react";
import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import Logo from "../../../../public/KeyFlashLogo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useAuth } from "@/app/context/AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { setTheme } = useTheme();
  const profile = user?.identities?.[0]?.identity_data?.avatar_url;
  const [isDarkMode, setIsDarkMode] = useState(true);
  console.log(profile);

  return (
    <nav className="my-3 px-3 sm:m-3  sm:px-7 sm:py-2 md:px-10 flex justify-between flex-row-reverse items-center w-full">
      <div className="flex items-center gap-3">
        {!user && (
          <Link
            href="/signin"
            className="hidden lg:inline-block bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-md p-px text-xs font-semibold leading-6 text-white "
          >
            <span className="absolute inset-0 overflow-hidden rounded-md">
              <span className="absolute inset-0 rounded-md bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </span>
            <div className="relative flex space-x-2 items-center z-10 rounded-md bg-zinc-950 py-2 px-4 ring-1 ring-white/10">
              <span>Get Started</span>
            </div>
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-400/0 via-blue-400/90 to-cyan-400/0 transition-opacity duration-500 group-hover:opacity-40" />
          </Link>
        )}
        <Link
          href="/dashboard"
          className="text-xs lg:text-sm bg-blue-600/10 hover:bg-blue-600/20 border-1 border-blue-500/30 hover:border-blue-400/40 p-[6px] px-3 rounded-sm"
        >
          Dashboard
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-7 h-7">
              <AvatarImage src={profile} alt="Hello" />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 mx-3" align="start">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuItem>Feedback</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link href="/" className="flex items-center  gap-2 sm:gap-3 px-3">
        <Image src={Logo} alt="KeyFlash Logo" className="w-8 sm:w-9 " />
        <h1 className="font-medium text-base sm:text-lg"> KeyFlash</h1>
      </Link>
    </nav>
  );
}
