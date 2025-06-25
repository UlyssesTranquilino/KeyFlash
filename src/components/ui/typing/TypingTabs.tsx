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

import { useQuote } from "@/app/context/QuoteContext";
import { useTimer } from "@/app/context/TimerContext";

import { start } from "repl";

const tabs = [
  { label: "Random", icon: Dices, path: "/typing/words" },
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

export default function TypingTabs() {
  const { time, setTime, setRemaining, resetTimer } = useTimer();

  const pathname = usePathname();
  const router = useRouter();

  const isCodeTab = pathname.startsWith("/typing/code");
  const isRandomTab = pathname.startsWith("/typing/words");

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  const [isLowerCase, setIsLowerCase] = useState(true);
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
                  active ? "text-blue-400" : "text-gray-400 hover:text-white"
                )}
              >
                <tab.icon className="scale-90" />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Controls*/}
        <div className="flex items-center gap-3">
          <div className="w-[0.5] h-6 bg-gray-400" />

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

          <Tooltip>
            <TooltipTrigger asChild>
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
                  isLowerCase
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-white"
                )}
              >
                <AArrowDown />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Simplify Text</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
