"use client";

import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  CirclePlus,
  Dices,
  Quote,
  Code,
  CircleUserRound,
  Type,
  Zap,
  Crown,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { getAllFlashcards } from "../../../utils/flashcard/flashcard";
import { getAllTexts } from "../../../utils/text/textUtils";
import { getAllCodes } from "../../../utils/code/codeUtils";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import UpgradeToProDialog from "@/components/ui/UpgradeToProDialog";

export default function HomePage() {
  const router = useRouter();
  const { user, session, loading } = useAuth();
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [texts, setTexts] = useState<any[]>([]);
  const [codes, setCodes] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); // New state
  const [openProDialog, setOpenProDialog] = useState(false);

  // Initial data fetch
  useEffect(() => {
    if (!authChecked) return;

    const fetchAllData = async () => {
      setLoadingData(true);
      try {
        const [flashcardsData, textsData, codesData] = await Promise.all([
          getAllFlashcards(),
          getAllTexts(),
          getAllCodes(),
        ]);

        setFlashcards(Array.isArray(flashcardsData) ? flashcardsData : []);
        setTexts(Array.isArray(textsData) ? textsData : []);
        setCodes(Array.isArray(codesData?.data) ? codesData.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchAllData();
  }, [authChecked, user?.id]); // Add authChecked and user.id as dependencies

  // Auth check effect
  useEffect(() => {
    if (user !== undefined) {
      setAuthChecked(true);
    }
  }, [user]);

  // Show loading until auth check completes
  // if (!authChecked) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  if (loading || loadingData || !authChecked) {
    return (
      <div className="container relative max-w-[1350px] px-2 md:px-5 mx-auto  py-4  overflow-hidden">
        <div className="absolute top-20 right-20  w-50 sm:w-[400px] h-[200px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

        <div className="-z-3 absolute -bottom-50 -left-[200px] w-[400px] h-[200px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

        <div className="max-w-4xl mb-8 flex items-center gap-3">
          <Skeleton className="rounded-md w-40 h-10" />
          <Skeleton className="rounded-md w-20 h-10" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
          <Skeleton className="rounded-md w-full h-23 lg:h-30" />
          <Skeleton className="rounded-md w-full h-23 lg:h-30" />
          <Skeleton className="rounded-md w-full h-23 lg:h-30" />
          <Skeleton className="rounded-md w-full h-23 lg:h-30" />
        </div>

        <div className="mt-12">
          <div className="flex justify-between items-center mb-2">
            <h1 className="font-medium text-lg mb-3 ">Flashcards </h1>
          </div>

          <div>
            <div className="grid sm:grid-cols-2  lg:grid-cols-4 gap-3 lg:gap-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="rounded-xl h-40" />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex justify-between items-center mb-2">
            <h1 className="font-medium text-lg mb-3 ">Texts</h1>
          </div>

          <div>
            <div className="grid sm:grid-cols-2  lg:grid-cols-4 gap-3 lg:gap-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="rounded-xl h-40" />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex justify-between items-center mb-2">
            <h1 className="font-medium text-lg mb-3 ">Codes</h1>
          </div>

          <div>
            <div className="grid sm:grid-cols-2  lg:grid-cols-4 gap-4 lg:gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="rounded-xl h-40" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center mt-30 rounded-lg outline-1 border-blue-400 border-dashed mx-5 h-70 p-3 max-w-[500px] sm:mx-auto shadow-sm shadow-blue-700/50">
        <CircleUserRound
          strokeWidth={0.8}
          className="mb-10 scale-300 text-blue-400 md:scale-350"
        />
        <div className="text-lg mb-3 text-center font-semibold">
          Account Not Found
        </div>
        <div className="text-sm text-center text-gray-400 mb-3">
          Use your account credentials to sign in and access this page.
        </div>
        <Link
          href="/signin"
          className="flex items-center justify-center w-full max-w-50 hover:scale-[1.01] transition-transform duration-200"
        >
          <Button className="mt-3 w-full cursor-pointer text-blue-400 bg-gray-800/50 hover:bg-blue-600/20 hover:text-blue-300 transition-colors duration-200">
            Log in
          </Button>
        </Link>
        <div className="absolute bottom-40 -left-4 lg:left-0 -z-2 size-90 rounded-full bg-radial-[at_50%_50%] from-blue-700/40 to-black to-90%"></div>{" "}
        <div className="absolute top-10 -right-4 lg:right-0 -z-2 size-90 rounded-full bg-radial-[at_50%_50%] from-blue-700/40 to-black to-90%"></div>{" "}
      </div>
    );
  }

  function slugify(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  // Style Difficulty
  const styleDifficulty = (difficulty: string) => {
    difficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    if (difficulty == "Easy") {
      return (
        <div className="bg-gray-900 text-green-300 px-2 w-auto flex items-center justify-center text-sm rounded-full p-1">
          {difficulty}
        </div>
      );
    } else if (difficulty == "Medium") {
      return (
        <div className="bg-gray-900 text-orange-300 px-2 w-auto flex items-center justify-center text-sm rounded-full p-1">
          {difficulty}
        </div>
      );
    } else {
      return (
        <div className="bg-gray-900 text-red-300 px-2 w-auto flex items-center justify-center text-sm rounded-full p-1">
          {difficulty}
        </div>
      );
    }
  };

  const handleCreate = (type: string) => {
    // return;
    if (type === "flashcard") {
      if (flashcards.length >= 5 && !user.isPro) {
        setOpenProDialog(true);
        return;
      }
      router.push("/dashboard/flashcards/create");
    } else if (type === "text") {
      if (texts.length >= 5 && !user.isPro) {
        setOpenProDialog(true);
        return;
      }
      router.push("/dashboard/texts/create");
    } else if (type === "code") {
      if (codes.length >= 5 && !user.isPro) {
        setOpenProDialog(true);
        return;
      }
      router.push("/dashboard/codes/create");
    }
  };

  return (
    <div className="pb-30 container relative max-w-[1350px] px-2 md:px-5 mx-auto  py-4  overflow-hidden">
      <UpgradeToProDialog
        openProDialog={openProDialog}
        setOpenProDialog={setOpenProDialog}
      />

      <div className="absolute top-20 right-20  w-50 sm:w-[400px] h-[200px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

      <div className="-z-3 absolute -bottom-50 -left-[200px] w-[400px] h-[200px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

      <div className="max-w-4xl ">
        <header className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            Welcome, {user.name}!
            {user.isPro && (
              <span className="flex items-center gap-1 text-xs bg-gradient-to-r from-cyan-600/20 to-cyan-800/20 text-cyan-400 px-2 py-1 rounded-full border border-cyan-700/50">
                <Crown className="fill-cyan-400/30" size={14} />
                PRO
              </span>
            )}
          </h1>
        </header>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
        <Link
          href="/dashboard/typing/random"
          className="cursor-pointer bg-black hover:border-blue-400/60 duration-300 ease-in-out hover:border-1 shadow-xs shadow-blue-700/90 relative overflow-hidden h-23 lg:h-30 flex items-center justify-center text-center p-5 w-full rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm transition-all group"
        >
          <div className="absolute -top-55 -right-10 -z-2 size-90 rounded-full bg-radial-[at_50%_50%] from-blue-700/40 to-black to-90%"></div>{" "}
          <div className="flex flex-col items-center gap-2">
            <Dices className="text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300" />
            <p className="text-base mb-1 text-blue-400 group-hover:text-blue-300 group-hover:font-medium transition-all duration-300">
              Random Typing
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/typing/quote"
          className="cursor-pointer bg-black  hover:border-blue-400/60 duration-300 ease-in-out hover:border-1 shadow-xs shadow-blue-700/90 relative overflow-hidden h-23 lg:h-30 flex items-center justify-center text-center p-5 w-full rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm transition-all group"
        >
          <div className="absolute -top-15 -left-10 -z-2 size-90 rounded-full bg-radial-[at_50%_50%] from-blue-700/40 to-black to-90%"></div>{" "}
          <div className="flex flex-col items-center gap-2">
            <Quote className="text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300" />
            <p className="text-base mb-1 text-blue-400 group-hover:text-blue-300 group-hover:font-medium transition-all duration-300">
              Quote Typing
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/typing/code"
          className="cursor-pointer bg-black hover:border-blue-400/60 duration-300 ease-in-out hover:border-1 shadow-xs shadow-blue-700/90 relative overflow-hidden h-23 lg:h-30 flex items-center justify-center text-center p-5 w-full rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm transition-all group"
        >
          <div className="absolute -top-15 -left-15 -z-2 size-90 rounded-full bg-radial-[at_50%_50%] from-blue-700/40 to-black to-90%"></div>{" "}
          <div className="flex flex-col items-center gap-2">
            <Code className="text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300" />
            <p className="text-base mb-1 text-blue-400 group-hover:text-blue-300 group-hover:font-medium transition-all duration-300">
              Code Typing
            </p>
          </div>
        </Link>

        <Popover>
          <PopoverTrigger
            asChild
            className="cursor-pointer bg-black border border-transparent hover:border-blue-400/60 transition-all duration-300 ease-in-out shadow-xs shadow-blue-700/90 relative overflow-hidden flex items-center justify-center text-center p-5 w-full rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm  group"
          >
            <div className="flex flex-col items-center w-full h-23 lg:h-30">
              <CirclePlus className="scale-120 transition-transform duration-300 text-blue-400 group-hover:text-blue-300 group-hover:scale-125" />
              <p className="text-base mt-2 text-blue-400 group-hover:text-blue-300 group-hover:font-medium transition-all duration-300">
                Create
              </p>
              <div className="absolute -z-2 size-80 rounded-full bg-radial-[at_50%_50%] from-blue-700/40 to-black to-90%"></div>
            </div>
          </PopoverTrigger>

          <PopoverContent className="bg-gray-950 w-36 md:w-45 border-gray-800">
            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={() => handleCreate("flashcard")}
                className="max-w-50 w-full cursor-pointer text-blue-400 bg-gray-800/50 hover:bg-blue-700/20 hover:text-blue-300 transition-colors duration-300"
              >
                Flashcard
              </Button>

              <Button
                onClick={() => handleCreate("text")}
                className="max-w-50 w-full cursor-pointer text-blue-400 bg-gray-800/50 hover:bg-blue-700/20 hover:text-blue-300 transition-colors duration-300"
              >
                Text
              </Button>

              <Button
                onClick={() => handleCreate("code")}
                className="max-w-50 w-full cursor-pointer text-blue-400 bg-gray-800/50 hover:bg-blue-700/20 hover:text-blue-300 transition-colors duration-300"
              >
                Code
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="mt-12">
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-medium text-lg mb-3 ">
            Flashcards{" "}
            <span className="ml-1 text-sm text-gray-300 ">
              ({flashcards.length})
            </span>
          </h1>

          {flashcards.length > 4 && (
            <Button
              size="icon"
              onClick={() => router.push("/dashboard/flashcards")}
              className="cursor-pointer rounded-md p-1 w-24 bg-transparent hover:bg-gray-900/80 hover:text-gray-200 text-gray-400 px-2"
            >
              Show All <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div>
          {flashcards.length > 0 ? (
            <div className="grid sm:grid-cols-2  lg:grid-cols-4 gap-3 lg:gap-5">
              {/* Flashcard Item */}
              {flashcards?.slice(0, 4).map((card: any) => (
                <div
                  key={card.id}
                  onClick={() => {
                    const slug = `${card.id}-${slugify(card.title)}`;
                    router.push(`/dashboard/flashcards/${slug}`);
                  }}
                  className="relative group overflow-hidden rounded-xl h-40 w-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-950 hover:border-blue-500 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-500/20"
                >
                  {/* Content */}
                  <div className="relative z-10 p-5 h-full flex flex-col">
                    <div className="mb-2 h-20">
                      <h2 className="truncate max-w-50 font-semibold text-lg text-white group-hover:text-blue-400 transition-colors duration-300 group-hover:translate-x-1 ">
                        {card.title}
                      </h2>
                    </div>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        {card.terms.length} terms
                      </span>
                      <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 p-3 rounded-md"></button>
                    </div>
                  </div>

                  {/* Decorative Graphic - Animated on Hover */}
                  <div className="absolute right-0 bottom-0 opacity-70 group-hover:opacity-90 transition-opacity duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 200 200"
                      width="160"
                      height="160"
                      className="transition-transform duration-500 ease-in-out group-hover:rotate-0 group-hover:translate-x-2 group-hover:translate-y-2 transform translate-x-8 translate-y-5 rotate-12"
                    >
                      {/* Main Card */}
                      <rect
                        x="40"
                        y="30"
                        width="80"
                        height="110"
                        rx="12"
                        fill="#1E3A8A"
                        fillOpacity="0.3"
                        stroke="#3B82F6"
                        strokeWidth="1.5"
                      />

                      {/* Secondary Card */}
                      <rect
                        x="25"
                        y="50"
                        width="80"
                        height="110"
                        rx="12"
                        fill="#1E3A8A"
                        fillOpacity="0.2"
                        stroke="#3B82F6"
                        strokeWidth="1.2"
                        strokeDasharray="4 2"
                      />
                    </svg>
                  </div>

                  {/* Hover Gradient Overlay */}
                  <div className="absolute  inset-0 bg-gradient-to-t from-blue-800/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12">
              <div className="bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-700 p-12 text-center hover:border-blue-500 transition-colors duration-300">
                <div className="mx-auto max-w-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-500 hover:text-blue-400 transition-colors duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-white hover:text-blue-400 transition-colors duration-300">
                    No flashcards yet
                  </h3>
                  <p className="mt-2 text-gray-400 hover:text-gray-300 transition-colors duration-300">
                    Get started by creating your first flashcard set
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/dashboard/flashcards/create"
                      className="flex max-w-60 mx-auto items-center justify-center p-3 rounded-lg gap-3 w-full cursor-pointer text-blue-400 bg-gray-800/50 hover:bg-blue-700/20 hover:text-blue-300 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Create Flashcard Set
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-medium text-lg mb-3 ">
            Texts
            <span className="ml-1 text-sm text-gray-300">({texts.length})</span>
          </h1>
          {texts.length > 4 && (
            <Button
              size="icon"
              onClick={() => router.push("/dashboard/texts")}
              className="cursor-pointer rounded-md p-1 w-24 bg-transparent hover:bg-gray-900/80 hover:text-gray-200 text-gray-400 px-2"
            >
              Show All <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div>
          {texts.length > 0 ? (
            <div className="grid sm:grid-cols-2  lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Flashcard Item */}
              {texts?.slice(0, 4).map((card: any) => (
                <div
                  key={card.id}
                  onClick={() => {
                    const slug = `${card.id}-${slugify(card.title)}`;
                    router.push(`/dashboard/texts/${slug}`);
                  }}
                  className="relative group overflow-hidden rounded-xl h-40 w-full bg-gradient-to-br  from-gray-800 to-gray-900 border border-gray-950 hover:border-blue-500 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-500/20"
                >
                  {/* Content */}
                  <div className="relative z-10 p-5 h-full flex flex-col">
                    <div className="mb-2">
                      <h2 className="max-w-50 truncate font-semibold text-lg text-white group-hover:text-blue-400 transition-colors duration-300 group-hover:translate-x-1 ">
                        {card.title}
                      </h2>
                    </div>
                  </div>

                  {/* Decorative Graphic - Animated on Hover */}
                  <div className="z-1 absolute right-10 bottom-10 opacity-70 group-hover:opacity-90 transition-opacity duration-300">
                    <Type
                      className="scale-300 rotate-20 stroke-1 text-blue-500 
                    group-hover:rotate-0 
                    group-hover:scale-[3.1] 
                    group-hover:-translate-x-5
                    group-hover:-translate-y-2
                    transition-all duration-500 ease-in-out"
                    />
                  </div>

                  {/* Hover Gradient Overlay */}
                  <div className="absolute  inset-0 bg-gradient-to-t from-blue-800/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* <div className="absolute rotate-20 -bottom-10 -right-13 h-150 w-17 bg-blue-950/50 -z-0" /> */}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12">
              <div className="bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-700 p-12 text-center hover:border-blue-500 transition-colors duration-300">
                <div className="mx-auto max-w-md">
                  <Type className="scale-140 mx-auto text-gray-500 hover:text-blue-400 transition-colors duration-300" />
                  <h3 className="mt-8 text-lg font-medium text-white hover:text-blue-400 transition-colors duration-300">
                    No Texts yet
                  </h3>
                  <p className="mt-2 text-gray-400 hover:text-gray-300 transition-colors duration-300">
                    Get started by creating your first text
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/dashboard/texts/create"
                      className="flex max-w-60 mx-auto items-center justify-center p-3 rounded-lg gap-3 w-full cursor-pointer text-blue-400 bg-gray-800/50 hover:bg-blue-700/20 hover:text-blue-300 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Create Text
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-medium text-lg mb-3 ">
            Codes
            <span className="ml-1 text-sm text-gray-300">({codes.length})</span>
          </h1>

          {codes.length > 4 && (
            <Button
              size="icon"
              onClick={() => router.push("/dashboard/codes")}
              className="cursor-pointer rounded-md p-1 w-24 bg-transparent hover:bg-gray-900/80 hover:text-gray-200 text-gray-400 px-2"
            >
              Show All <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div>
          {codes.length > 0 ? (
            <div className="grid sm:grid-cols-2  lg:grid-cols-4 gap-3 lg:gap-5">
              {/* Flashcard Item */}
              {codes?.slice(0, 4).map((card: any) => (
                <div
                  key={card.id}
                  onClick={() => {
                    const slug = `${card.id}-${slugify(card.title)}`;
                    router.push(`/dashboard/codes/${slug}`);
                  }}
                  className="relative group overflow-hidden rounded-xl h-40 w-full bg-gradient-to-br  from-gray-800 to-gray-900 border border-gray-950 hover:border-blue-500 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-500/20"
                >
                  {/* Content */}
                  <div className="relative z-10 p-5 h-full flex flex-col">
                    <div className="mb-2">
                      <h2 className="max-w-50 truncate font-semibold text-lg text-white group-hover:text-blue-400 transition-colors duration-300 group-hover:translate-x-1 ">
                        {card.title}
                      </h2>
                    </div>
                  </div>

                  {/* Decorative Graphic - Animated on Hover */}
                  <div className="z-1 absolute right-10 bottom-10 opacity-70 group-hover:opacity-90 transition-opacity duration-300">
                    <Code
                      className="scale-300 rotate-20 stroke-1 text-blue-500 
                    group-hover:rotate-0 
                    group-hover:scale-[3.1] 
                    group-hover:-translate-x-5
                    group-hover:-translate-y-2
                    transition-all duration-500 ease-in-out"
                    />
                  </div>

                  {/* Hover Gradient Overlay */}
                  <div className="absolute  inset-0 bg-gradient-to-t from-blue-800/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* <div className="absolute rotate-20 -bottom-10 -right-13 h-150 w-17 bg-blue-950/50 -z-0" /> */}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12">
              <div className="bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-700 p-12 text-center hover:border-blue-500 transition-colors duration-300">
                <div className="mx-auto max-w-md">
                  <Code className="scale-140 mx-auto text-gray-500 hover:text-blue-400 transition-colors duration-300" />
                  <h3 className="mt-8 text-lg font-medium text-white hover:text-blue-400 transition-colors duration-300">
                    No Code yet
                  </h3>
                  <p className="mt-2 text-gray-400 hover:text-gray-300 transition-colors duration-300">
                    Get started by creating your first code
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/dashboard/codes/create"
                      className="flex max-w-60 mx-auto items-center justify-center p-3 rounded-lg gap-3 w-full cursor-pointer text-blue-400 bg-gray-800/50 hover:bg-blue-700/20 hover:text-blue-300 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Create Code
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
