"use client";

import { useState, useEffect } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ChevronsUpDown, FileUp } from "lucide-react";
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
import UpgradeToProDialog from "@/components/ui/UpgradeToProDialog";
import { getCodesCount } from "../../../../../utils/code/codeUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  const [openProDialog, setOpenProDialog] = useState(false);

  // File Upload
  const [openUpload, setOpenUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (title || code) {
        e.preventDefault();
        e.returnValue = ""; // Required for most browsers to trigger the alert
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [title, code]);

  function slugify(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  const handleCreateCode = async () => {
    if (!title || !code) {
      toast.warning("Please fill in both the title and code.");
      return;
    }

    try {
      const { data, error } = await insertCode({
        title,
        description,
        code,
        language: language === "Other" ? selectedLanguage : language,
        difficulty,
        time_complexity: timeComplexity,
        space_complexity: spaceComplexity,
        created_at: new Date(),
      });

      if (error) {
        if (error.includes("Code limit reached")) {
          setOpenProDialog(true);
        } else {
          toast.error(error);
        }
        return;
      }

      toast.success("Code created successfully!");
      const slug = `${data.id}-${slugify(title)}`;
      router.push(`/dashboard/codes/${slug}`);
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload({
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "text/plain" || file.name.endsWith(".txt"))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCode((event.target?.result as string) || "");
      };
      reader.readAsText(file);
      setOpenUpload(false);
    } else {
      alert("Please upload a .txt file");
    }
  };
  return (
    <div className="mb-20 px-3 flex flex-col  w-full max-w-[1100px] mx-auto overflow-hidden relative">
      <UpgradeToProDialog
        openProDialog={openProDialog}
        setOpenProDialog={setOpenProDialog}
      />

      <Dialog open={openUpload} onOpenChange={setOpenUpload}>
        <DialogContent className="max-w-[800px] mx-2">
          <DialogHeader>
            <DialogTitle className="text-lg text-center">
              Upload Code
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-3 text-center transition-colors",
              isDragging
                ? "border-blue-400 bg-blue-900/20"
                : "border-blue-300/60"
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="p-3 flex flex-col items-center justify-center gap-2">
              <FileUp className="h-8 w-8 text-gray-400" />
              {isDragging ? (
                <p className="font-medium text-blue-400">Drop your file here</p>
              ) : (
                <>
                  <p className="font-medium">Drag and drop your file here</p>
                  <p className="text-gray-500">or</p>
                </>
              )}
              <label className="mt-2 px-4 py-2 bg-blue-900/30 text-blue-400 rounded-md cursor-pointer hover:bg-blue-900/50 transition-colors">
                Select File
                <input
                  type="file"
                  accept=".txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Supports .txt files only
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="absolute top-20 right-20 w-[200px] h-[200px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

      <div className="-z-3 absolute bottom-0 left-0 w-[600px] h-[400px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

      <Toaster position="top-center" />

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            router.push("/dashboard");
          }}
          className="cursor-pointer rounded-md p-2  mb-5 -ml-2 w-20 hover:bg-gray-800 text-gray-400"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenUpload(true)}
          className="cursor-pointer rounded-md p-2 mb-5 -ml-2 w-20 hover:bg-gray-800 text-gray-400"
        >
          <FileUp className="h-5 w-5" />
          Upload
        </Button>
      </div>

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
          <Label htmlFor="text">Code</Label>
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
