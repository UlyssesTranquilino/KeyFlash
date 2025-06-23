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
} from "lucide-react";

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

import { useQuote } from "@/app/context/QuoteContext";
import { useTimer } from "@/app/context/TimerContext";

import { start } from "repl";

// Programming languages
const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c++", label: "C++" },
  { value: "go", label: "Go" },
  { value: "typescript", label: "TypeScript" },
];

// DSA Topics
const topics = [
  { value: "arrays", label: "Arrays" },
  { value: "linked-lists", label: "Linked Lists" },
  { value: "stacks", label: "Stacks" },
  { value: "queues", label: "Queues" },
  { value: "hashmaps", label: "Hash Maps" },
  { value: "trees", label: "Trees" },
  { value: "graphs", label: "Graphs" },
  { value: "recursion", label: "Recursion" },
  { value: "sorting", label: "Sorting" },
  { value: "searching", label: "Searching" },
  { value: "dynamic-programming", label: "Dynamic Programming" },
];

const tabs = [
  { label: "Story", icon: BookText, path: "/typing/story" },
  { label: "Words", icon: LetterText, path: "/typing/words" },
  { label: "Quote", icon: Quote, path: "/typing/quote" },
  { label: "Code", icon: Code, path: "/typing/code" },
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

export default function TypingTabs() {
  const { time, setTime, setRemaining, resetTimer } = useTimer();

  const [openTopic, setOpenTopic] = useState(false);
  const [openLang, setOpenLang] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedLang, setSelectedLang] = useState("");

  const pathname = usePathname();
  const router = useRouter();

  const isCodeTab = pathname.startsWith("/typing/code");

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    setOpenLang(false);
    setOpenTopic(false);
  }, [pathname]);

  const [isLowerCase, setIsLowerCase] = useState(false);
  const { lowerCaseQuote, startCaseQuote } = useQuote();

  const [openTime, setOpenTime] = useState(false);
  return (
    <div className="px-4 sm:px-9 flex items-center max-w-[1000px] mx-auto ">
      <div className="w-full flex flex-wrap justify-between gap-3 sm:gap-6 p-3 h-15 rounded-md px-5 bg-blue-950/30 items-center">
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Tab navigation */}
          {tabs.map((tab) => {
            const active = pathname === tab.path;
            return (
              <button
                key={tab.label}
                onClick={() => handleTabClick(tab.path)}
                className={cn(
                  "flex items-center gap-2 text-sm transition",
                  active ? "text-cyan-400" : "text-gray-400 hover:text-white"
                )}
              >
                <tab.icon className="scale-90" />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Only shown in Code tab */}
        {isCodeTab && (
          <>
            {/* Programming Language Dropdown */}
            <Popover open={openLang} onOpenChange={setOpenLang}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openLang}
                  className="ml-auto w-[200px] justify-between"
                >
                  {selectedLang
                    ? languages.find((l) => l.value === selectedLang)?.label
                    : "Select language..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search language..." />
                  <CommandList>
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {languages.map((lang) => (
                        <CommandItem
                          key={lang.value}
                          value={lang.value}
                          onSelect={(current) => {
                            setSelectedLang(
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

            {/* DSA Topic Dropdown */}
            <Popover open={openTopic} onOpenChange={setOpenTopic}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openTopic}
                  className="w-[220px] justify-between"
                >
                  {selectedTopic
                    ? topics.find((t) => t.value === selectedTopic)?.label
                    : "Select DSA topic..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-0">
                <Command>
                  <CommandInput placeholder="Search topic..." />
                  <CommandList>
                    <CommandEmpty>No topic found.</CommandEmpty>
                    <CommandGroup>
                      {topics.map((topic) => (
                        <CommandItem
                          key={topic.value}
                          value={topic.value}
                          onSelect={(current) => {
                            setSelectedTopic(
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
          </>
        )}

        {/* Controls*/}
        <div className="flex items-center gap-3">
          <div className="w-[0.5] h-6 bg-gray-400" />

          {/* DSA Topic Dropdown */}
          <Popover open={openTime} onOpenChange={setOpenTime}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                aria-expanded={openTime}
                className="justify-between flex items-center"
              >
                {time > 0 ? time : <Infinity />}
                <Timer className="text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-18 p-0">
              <Command>
                <CommandList>
                  <CommandEmpty>No topic found.</CommandEmpty>
                  <CommandGroup>
                    {allTime.map((topic: any) => (
                      <CommandItem
                        key={topic.value}
                        value={topic.value.toString()}
                        // In the time dropdown CommandItem's onSelect handler:
                        onSelect={(current) => {
                          const parsed = parseInt(current, 10);
                          // Only update if it's a different value
                          console.log("parsed: ", parsed, " Time: ", time);
                          if (parsed !== time) {
                            setTime(parsed);
                            setRemaining(parsed === 0 ? -1 : parsed); // Handle infinite mode (0 becomes -1)

                            setOpenTime(false);
                          } else {
                            setOpenTime(false); // Just close the dropdown if same value clicked
                          }
                        }}
                      >
                        <div className="flex items-center justify-center w-full">
                          {topic.label}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <button
            onClick={() => {
              if (isLowerCase) {
                startCaseQuote();
              } else {
                lowerCaseQuote();
              }
              setIsLowerCase(!isLowerCase);
            }}
            className={cn(
              "flex items-center gap-2 text-sm transition",
              isLowerCase ? "text-cyan-400" : "text-gray-400 hover:text-white"
            )}
          >
            <AArrowDown />
          </button>
        </div>
      </div>
    </div>
  );
}
