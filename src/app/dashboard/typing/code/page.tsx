"use client";

import { useState } from "react";
import CodeType from "@/app/typing/code/page";
import { Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
import { useCode } from "@/app/context/CodeContext";
import { useWpm } from "@/app/context/WpmContext";

const DashboardCodeTyping = () => {
  const { topic, setTopic, language, setLanguage } = useCode();
  const { showWpm, setShowWpm } = useWpm();

  const [openTopic, setOpenTopic] = useState(false);
  const [openLang, setOpenLang] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedLang, setSelectedLang] = useState("");

  return (
    <div>
      <div className="flex items-center gap-3 p-1 sm:p-5">
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
                        setLanguage(current === selectedLang ? "" : current);
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
              {topic ? topics.find((t) => t.value === topic)?.label : "Topic"}
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
                        setTopic(current === selectedTopic ? "" : current);
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
      </div>
      <CodeType />
    </div>
  );
};

export default DashboardCodeTyping;
