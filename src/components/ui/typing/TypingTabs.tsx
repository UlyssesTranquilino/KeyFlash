"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Quote,
  BookText,
  LetterText,
  Code,
  Check,
  ChevronsUpDown,
  AArrowDown,
  Timer,
  Infinity,
  Dices,
  CirclePlus,
  Pencil,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Context
import { useQuote } from "@/app/context/QuoteContext";
import { useTimer } from "@/app/context/TimerContext";
import { useCode } from "@/app/context/CodeContext";
import { useWpm } from "@/app/context/WpmContext";
import { useEditText } from "@/app/context/AddTextContext";

import { start } from "repl";

const tabs = [
  { label: "Random", icon: Dices, path: "/typing/random" },
  { label: "Quote", icon: Quote, path: "/typing/quote" },
  { label: "Code", icon: Code, path: "/typing/code" },
  { label: "Custom", icon: CirclePlus, path: "/typing/custom" },
];

const allTime = [
  {
    value: 10,
    label: "10",
  },
  {
    value: 20,
    label: "20",
  },
  {
    value: 30,
    label: "30",
  },
  {
    value: 60,
    label: "60",
  },
  {
    value: -1,
    label: <Infinity />,
  },
];

// Programming languages
const languages = [
  { value: "any", label: "Language (any)" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c++", label: "C++" },
  { value: "go", label: "Go" },
  { value: "typescript", label: "TypeScript" },
  // { value: "pseudocode", label: "Pseudocode" },
];

// DSA Topics
const topics = [
  { value: "any", label: "Topic (any)" },
  { value: "arrays", label: "Arrays" },
  { value: "linked-lists", label: "Linked Lists" },
  { value: "stacks", label: "Stacks" },
  { value: "queues", label: "Queues" },
  // { value: "hashmaps", label: "Hash Maps" },
  { value: "trees", label: "Trees" },
  { value: "recursion", label: "Recursion" },
  { value: "sorting", label: "Sorting" },
  { value: "searching", label: "Searching" },
  { value: "dynamic-programming", label: "Dynamic Programming" },
];

export default function TypingTabs() {
  const { openAddText, setOpenAddText } = useEditText();
  const { time, setTime, setRemaining, resetTimer } = useTimer();
  const { topic, setTopic, language, setLanguage } = useCode();
  const { showWpm, setShowWpm } = useWpm();

  const [openTopic, setOpenTopic] = useState(false);
  const [openLang, setOpenLang] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedLang, setSelectedLang] = useState("");

  const pathname = usePathname();
  const router = useRouter();

  const isCodeTab = pathname.startsWith("/typing/code");
  const isRandomTab = pathname.startsWith("/typing/random");
  const isQuoteTab = pathname.startsWith("/typing/quote");
  const isCustomTab = pathname.startsWith("/typing/custom");

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  const [isLowerCase, setIsLowerCase] = useState(true);
  const { lowerCaseQuote, startCaseQuote, isLowercase } = useQuote();

  const [openTime, setOpenTime] = useState(false);
  return (
    <div className="px-4 sm:px-9 flex justify-end items-center  mx-auto -mt-2   ">
      <div
        className={cn(
          "py-2 sm:py-0  overflow-hidden gap-3 w-full typing-tabs md:max-w-150  lg:p-3 sm:gap-5 p-1 sm:p-3 sm:h-13 md:pr-6 lg:pr-6 rounded-md px-5 bg-blue-950/30 items-center min-w-75",
          !isCodeTab ? "md:max-w-100" : ""
        )}
      >
        <div className="typing-modes ">
          {/* Tab navigation */}
          {tabs.map((tab) => {
            const active = pathname === tab.path;
            return (
              <Tooltip key={tab.label}>
                <TooltipTrigger asChild>
                  <button
                    key={tab.label}
                    onClick={() => handleTabClick(tab.path)}
                    className={cn(
                      "flex items-center gap-2 text-sm transition",
                      active
                        ? "text-blue-400"
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    <tab.icon className="scale-90" />
                    <span className="hidden tab-label">{tab.label}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tab.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Controls*/}
        <div className="flex justify-center items-center  gap-3">
          <div className={`w-[0.5] h-6 bg-gray-400 bar sm:block`} />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setShowWpm(!showWpm)}
                className={cn(
                  "flex items-center gap-2 text-[0.9rem] transition px-3 lg:px-2",
                  showWpm ? "text-blue-400" : "text-gray-400 hover:text-white"
                )}
              >
                WPM
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Words per minute</p>
            </TooltipContent>
          </Tooltip>

          {/* Word Mode Time Dropdown */}
          {isRandomTab && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Popover open={openTime} onOpenChange={setOpenTime}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-between flex items-center"
                      >
                        {time > 0 ? time : <Infinity />}
                        <Timer className="text-gray-400 ml-2" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-18 p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No time found.</CommandEmpty>
                          <CommandGroup>
                            {allTime.map((timeOption: any) => (
                              <CommandItem
                                key={timeOption.value}
                                value={timeOption.value.toString()}
                                // In TypingTabs component, modify the time selection handler:
                                onSelect={(current) => {
                                  const parsed = parseInt(current, 10);
                                  if (parsed !== time) {
                                    setTime(parsed);
                                    setRemaining(parsed === -1 ? -1 : parsed);
                                    setOpenTime(false);
                                    // Removed: resetTimer();
                                  } else {
                                    setOpenTime(false);
                                  }
                                }}
                              >
                                <div className="flex items-center justify-center w-full">
                                  {timeOption.label}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Time (sec)</p>
              </TooltipContent>
            </Tooltip>
          )}

          {isCodeTab && (
            <div className="flex items-center gap-3 md:w-100">
              <Popover open={openLang} onOpenChange={setOpenLang}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openLang}
                    className="w-[95px] md:w-full max-w-[150px] sm:w-[110px] justify-between border-0 truncate"
                  >
                    {language
                      ? languages.find((l) => l.value === language)?.label
                      : "Language"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[130px]  p-0">
                  <Command>
                    <CommandInput placeholder="Search" />
                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {languages.map((lang) => (
                          <CommandItem
                            key={lang.value}
                            value={lang.value}
                            onSelect={(current) => {
                              setLanguage(
                                current === selectedLang ? "" : current
                              );
                              setOpenLang(false);
                            }}
                          >
                            {lang.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                selectedLang === lang.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Popover open={openTopic} onOpenChange={setOpenTopic}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openTopic}
                    className="w-[95px]  md:w-full max-w-[150px] sm:w-[110px] justify-between border-0 truncate"
                  >
                    {topic
                      ? topics.find((t) => t.value === topic)?.label
                      : "Topic"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[110px] md:w-[140px] pr-0 pl-0">
                  <Command>
                    <CommandInput placeholder="Search" />
                    <CommandList>
                      <CommandEmpty>No topic found.</CommandEmpty>
                      <CommandGroup>
                        {topics.map((topic) => (
                          <CommandItem
                            key={topic.value}
                            value={topic.value}
                            onSelect={(current) => {
                              setTopic(
                                current === selectedTopic ? "" : current
                              );
                              setOpenTopic(false);
                            }}
                          >
                            {topic.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                selectedTopic === topic.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {isQuoteTab && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    if (isLowercase) {
                      startCaseQuote();
                    } else {
                      lowerCaseQuote();
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 text-sm transition px-2",
                    isLowercase
                      ? "text-blue-400"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  <AArrowDown />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isLowercase ? "Original case" : "Simplify text"}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {isCustomTab && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setOpenAddText(!openAddText)}
                  className={cn(
                    "flex items-center gap-2 text-[0.9rem] transition px-3 lg:px-2",
                    openAddText
                      ? "text-blue-400"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  <Pencil className="scale-78" /> Edit
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Custom Text</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}
