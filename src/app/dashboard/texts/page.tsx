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
  ChevronRight,
  X,
  SearchX,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { getAllTexts } from "../../../../utils/text/textUtils";
import { Skeleton } from "@/components/ui/skeleton";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const { user, session } = useAuth();
  const [texts, setTexts] = useState<any[]>([]);
  const [filteredTexts, setFilteredTexts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [sortMethod, setSortMethod] = useState("newest");

  // Initial quote and text fetch
  useEffect(() => {
    const fetchTexts = async () => {
      const data = await getAllTexts();
      setLoading(false);
      if (Array.isArray(data)) {
        setTexts(data);
        setFilteredTexts(data);
      } else {
        setTexts([]);
        setFilteredTexts([]);
      }
    };
    setLoading(true);
    fetchTexts();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearchText(searchText);
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [searchText]);

  function slugify(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  const handleSearchText = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredTexts(texts);
      return;
    }
    const filteredData = texts.filter((card) =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTexts(filteredData);
  };

  const handleSortFlashcard = (value: string) => {
    setSortMethod(value);

    const sortedData = [...filteredTexts];

    switch (value) {
      case "newest":
        sortedData.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;

      case "oldest":
        sortedData.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;

      case "alphabet":
        sortedData.sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        );
        break;

      case "reverse-alphabet":
        sortedData.sort((a, b) =>
          b.title.localeCompare(a.title, undefined, { sensitivity: "base" })
        );
        break;

      case "most-terms":
        sortedData.sort((a, b) => b.terms.length - a.terms.length);
        break;

      case "fewest-terms":
        sortedData.sort((a, b) => a.terms.length - b.terms.length);
        break;

      default:
        break;
    }

    setFilteredTexts(sortedData);
  };

  if (loading) {
    return (
      <div className="h-screen container relative max-w-[1350px] px-2 md:px-5 mx-auto  overflow-hidden -mt-2">
        <div className="mt-12 flex items-center gap-1 mb-3">
          <Skeleton className="h-8 w-12 " />

          <Skeleton className="h-8 w-5 " />
        </div>

        <div className="w-full   mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Skeleton className="h-8 w-full max-w-200 " />

          <div className="self-end">
            <Skeleton className="h-8 w-30 " />
          </div>
        </div>

        <div>
          <div className="grid sm:grid-cols-2  lg:grid-cols-4 gap-3 lg:gap-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="rounded-xl h-40" />
            ))}
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

  return (
    <div className="h-screen container relative max-w-[1350px] px-2 md:px-5 mx-auto  overflow-hidden -mt-2">
      <div className="absolute top-20 right-20  w-50 sm:w-[400px] h-[200px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

      <div className="-z-3 absolute -bottom-50 -left-[200px] w-[400px] h-[200px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

      <div className="mt-12">
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-medium text-lg mb-3 ">
            Texts
            <span className="ml-1 text-sm text-gray-300">({texts.length})</span>
          </h1>
        </div>

        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="w-full h-full relative">
            <Input
              id="search"
              type="text"
              placeholder="Search codes..."
              required
              className="input-glow !bg-gray-900 !border-0 max-w-200"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="absolute right-3 top-1 rounded-full hover:bg-gray-800 cursor-pointer"
              >
                <X className="scale-75" />
              </button>
            )}
          </div>

          <div className="self-end">
            <Select
              value={sortMethod}
              onValueChange={(value) => handleSortFlashcard(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort by</SelectLabel>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="alphabet">Alphabetic (A-Z)</SelectItem>
                  <SelectItem value="reverse-alphabet">
                    Alphabetic (Z-A)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          {texts.length > 0 ? (
            filteredTexts.length > 0 ? (
              <div className="grid sm:grid-cols-2  lg:grid-cols-4 gap-3 lg:gap-5">
                {/* Flashcard Item */}
                {filteredTexts?.map((card: any) => (
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
              <div className="text-gray-400 flex flex-col items-center justify-center mt-14 sm:mt-32 lg:mt-42 gap-3 md:gap-5">
                <SearchX className="scale-150 md:scale-170" strokeWidth={1.4} />
                <h2 className="md:text-lg"> No Texts found</h2>
              </div>
            )
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
                      href="/text/create"
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
    </div>
  );
}
