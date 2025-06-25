"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

// Programming languages
const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c++", label: "C++" },
  { value: "go", label: "Go" },
  { value: "typescript", label: "TypeScript" },
  { value: "pseudocode", label: "Pseudocode" },
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

const CodeType = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const [openTopic, setOpenTopic] = useState(false);
  const [openLang, setOpenLang] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedLang, setSelectedLang] = useState("");

  return (
    <div>
      <div className="flex  items-end gap-3">
        {/* Programming Language Dropdown */}
        <Popover open={openLang} onOpenChange={setOpenLang}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openLang}
              className="ml-auto w-[130px] md:w-[160px] justify-between"
            >
              {selectedLang
                ? languages.find((l) => l.value === selectedLang)?.label
                : "Language"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[130px] md:w-[160px] p-0">
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
              className="w-[140px] md:w-[160px] justify-between"
            >
              {selectedTopic
                ? topics.find((t) => t.value === selectedTopic)?.label
                : "Topic"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[140px] md:w-[160px] p-0">
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
      </div>
    </div>
  );
};

export default CodeType;
