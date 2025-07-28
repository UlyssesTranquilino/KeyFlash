"use client";

import { useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ChevronsUpDown } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { insertCode } from "../../../../../utils/code/codeUtils";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// Programming languages
const languages = [
  { value: "Javascript", label: "JavaScript" },
  { value: "Python", label: "Python" },
  { value: "Java", label: "Java" },
  { value: "C++", label: "C++" },
  { value: "Go", label: "Go" },
  { value: "Typescript", label: "TypeScript" },
  { value: "Other", label: "Other" },
  // { value: "pseudocode", label: "Pseudocode" },
];

const CreateText = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [language, setLanguage] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("");
  const [spaceComplexity, setSpaceComplexity] = useState("");
  const [openLang, setOpenLang] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  function slugify(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  const handleCreateCode = async () => {
    if (!title || !code) {
      toast.warning(
        "Please make sure all flashcards have both a question and an answer."
      );

      return;
    }

    try {
      let codeData = {
        id: "", // placeholder, will be set by DB
        user_id: "", // placeholder, will be set by insertCode
        title: title,
        description: description,
        code: code,
        language: language === "Other" ? selectedLanguage : language,
        difficulty: difficulty,
        time_complexity: timeComplexity,
        space_complexity: spaceComplexity,
        created_at: new Date(),
      };

      const { data, error } = await insertCode(codeData);
      toast.success("Code created successfully!");

      const slug = `${data.id}-${slugify(title)}`;
      router.push(`dashboard/codes/${slug}`);
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="mb-20 px-3 flex flex-col  w-full max-w-[1100px] mx-auto overflow-hidden relative">
      <div className="absolute top-20 right-20 w-[200px] h-[200px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

      <div className="-z-3 absolute bottom-0 left-0 w-[600px] h-[400px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

      <Toaster position="top-center" />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          router.push("/dashboard");
        }}
        className="rounded-md p-2  mb-5 -ml-2 w-20 hover:bg-gray-800 text-gray-400"
      >
        <ArrowLeft className="h-5 w-5" /> Back
      </Button>

      <h1 className="text-center font-semibold text-lg md:text-xl mb-8">
        Create Code
      </h1>

      <div className="mb-3 flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="title"
            placeholder="Type your title"
            required
            className="input-glow !bg-gray-900 !border-0"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2  justify-start  gap-3">
          <div className="flex flex-col  gap-3">
            <Label htmlFor="language">
              Language <span className="text-gray-400 px-1">(optional)</span>
            </Label>

            <div className="flex gap-3">
              <Popover open={openLang} onOpenChange={setOpenLang}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openLang}
                    className="w-[95px] md:w-full max-w-[150px] sm:w-[200px] justify-between border-0 truncate"
                  >
                    {language || "Language"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[200px] p-0 ml-3 md:ml-12">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search or type..."
                      value={language}
                      onValueChange={(val) => setLanguage(val)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setOpenLang(false);
                        }
                      }}
                    />
                    <CommandList>
                      <CommandEmpty>
                        No match. Press Enter to use this value.
                      </CommandEmpty>
                      <CommandGroup>
                        {languages.map((lang) => (
                          <CommandItem
                            key={lang.value}
                            value={lang.value}
                            onSelect={(val) => {
                              setLanguage(val);
                              setOpenLang(false);
                            }}
                          >
                            {lang.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                language === lang.value
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
              {language == "Other" && (
                <Input
                  id="language"
                  type="text"
                  placeholder="Type Language"
                  required
                  className="input-glow !bg-gray-900 !border-0"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col  gap-3 ">
            <Label htmlFor="title">
              Difficulty <span className="text-gray-400 px-1 ">(optional)</span>
            </Label>
            <Select onValueChange={(value) => setDifficulty(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Difficulty</SelectLabel>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3 ">
            <Label htmlFor="space">
              Time Complexity{" "}
              <span className="text-gray-400 px-1 ">(optional)</span>
            </Label>
            <Input
              id="space"
              type="text"
              placeholder="e.g. O(n)"
              required
              className="input-glow !bg-gray-900 !border-0"
              value={timeComplexity}
              onChange={(e) => setTimeComplexity(e.target.value)}
            />
          </div>

          <div className="flex flex-col  gap-3 ">
            <Label htmlFor="space">
              Space Complexity{" "}
              <span className="text-gray-400 px-1 ">(optional)</span>
            </Label>
            <Input
              id="space"
              type="text"
              placeholder="e.g. O(n)"
              required
              className="input-glow !bg-gray-900 !border-0"
              value={spaceComplexity}
              onChange={(e) => setSpaceComplexity(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="description">
            Description <span className="text-gray-400 px-1 ">(optional)</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Type your description"
            className="input-glow !bg-gray-900 !border-0"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="email">Code</Label>
          <Textarea
            id="text"
            placeholder="Type or paste your code here..."
            className="input-glow !bg-gray-900 !border-0 min-h-50"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <div className="text-gray-500 text-sm sm:text-base">
          {code.length} characters -
          <span className={cn(" ", code.length > 1000 && "text-red-400")}>
            Max 1000 characters
          </span>
        </div>
      </div>

      <Button
        onClick={handleCreateCode}
        className="cursor-pointer text-blue-400 bg-blue-950/30 hover:bg-blue-950/70  mt-5 max-w-50 mx-auto px-4 sm:px-8"
      >
        Create Code
      </Button>
    </div>
  );
};

export default CreateText;
