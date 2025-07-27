"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Moon,
  Sun,
  Menu,
  BadgeCheck,
  Sparkles,
  CreditCard,
  LifeBuoy,
  Send,
  LogOut,
} from "lucide-react";
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
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useAuth } from "@/app/context/AuthContext";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { setTheme } = useTheme();
  const profile = user?.identities?.[1] ? user?.identities?.[1]?.identity_data?.avatar_url : user?.identities?.[0]?.identity_data?.avatar_url;

  const [isDarkMode, setIsDarkMode] = useState(true);
  const pathname = usePathname();

  const handleLogout = () => {
    signOut();
  }
  return (
    <nav className="my-3 pl-3 sm:m-3  sm:px-5 sm:py-2 md:px-10 flex justify-between items-center w-full">
      <div className="flex items-center justify-start gap-10">
        <Link href="/" className="flex items-center  gap-2 sm:gap-3  ">
          <Image src={Logo} alt="KeyFlash Logo" className="w-8 sm:w-9 " />
          <h1 className="font-medium text-base sm:text-lg"> KeyFlash</h1>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              "text-sm text-gray-300 hover:text-white",
              pathname == "/" && "text-white"
            )}
          >
            Home
          </Link>

          <Link
            href="/pricing"
            className={cn(
              "text-sm text-gray-300 hover:text-white",
              pathname == "/pricing" && "text-white"
            )}
          >
            Pricing
          </Link>
          <Link
            href="/support"
            className={cn(
              "text-sm text-gray-300 hover:text-white",
              pathname == "/support" && "text-white"
            )}
          >
            Support
          </Link>
          {/* <Link
            href="/contact"
            className={cn(
              "text-sm text-gray-300 hover:text-white",
              pathname == "/contact" && "text-white"
            )}
          >
            Contact
          </Link> */}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:px-3">
        {!user ? (
          <Link
            href="/signin"
            className="text-xs lg:text-sm bg-blue-600/10 hover:bg-blue-600/20 border-1 border-blue-500/30 hover:border-blue-400/40 p-[6px] px-3 lg:px-4 rounded-sm"
          >
            Get Started
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="text-xs lg:text-sm bg-blue-600/10 hover:bg-blue-600/20 border-1 border-blue-500/30 hover:border-blue-400/40 p-[6px] px-3 lg:px-4 rounded-sm"
          >
            Dashboard
          </Link>
        )}
        {user && 
            <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="w-7 h-7 cursor-pointer">
                      {profile ?       <AvatarImage src={profile} alt="Hello" />
                      : (<div className="h-14 w-14 rounded-full bg-blue-950 text-center text-sm pt-1">
                        {user?.identities?.[0]?.identity_data?.name[0].toUpperCase()}
                      </div>)}
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40 mx-3" align="start">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <BadgeCheck />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {" "}
                        <Sparkles />
                        Upgrade to Pro
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    {/* <Link href="/feedback">
                      <DropdownMenuItem>
                        <Send />
                        Feedback
                      </DropdownMenuItem>
                    </Link> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      {" "}
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
            </DropdownMenu>
        }
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="cursor-pointer">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle></SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-3 ">
                <Link
                  href="/"
                  className={cn(
                    " text-gray-300 hover:text-white p-2 px-6 hover:bg-gray-900/40",
                    pathname == "/" &&
                      "text-white bg-blue-600/10 hover:bg-blue-600/10"
                  )}
                >
                  Home
                </Link>

                <Link
                  href="/pricing"
                  className={cn(
                    " text-gray-300 hover:text-white p-2 px-6 hover:bg-gray-900/40",
                    pathname == "/pricing" &&
                      "text-white bg-blue-600/10 hover:bg-blue-600/10"
                  )}
                >
                  Pricing
                </Link>
                <Link
                  href="/support"
                  className={cn(
                    " text-gray-300 hover:text-white p-2 px-6 hover:bg-gray-900/40",
                    pathname == "/support" &&
                      "text-white bg-blue-600/10 hover:bg-blue-600/10"
                  )}
                >
                  Support
                </Link>
                {/* <Link
                  href="/contact"
                  className={cn(
                    " text-gray-300 hover:text-white p-2 px-6 hover:bg-gray-900/40",
                    pathname == "/contact" &&
                      "text-white bg-blue-600/10 hover:bg-blue-600/10"
                  )}
                >
                  Contact
                </Link> */}
              </div>
              <div className="grid flex-1 auto-rows-min gap-6 px-4"></div>
              <SheetFooter>
                <Link
                  href="/dashboard"
                  className="text-center py-[12px]  bg-blue-600/10 hover:bg-blue-600/20 border-1 border-blue-500/30 hover:border-blue-400/40 p-[6px] px-3 rounded-sm"
                >
                  Dashboard
                </Link>

                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="cursor-pointer mt-2 h-12"
                  >
                    Close
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
