"use client";

import { useState, useEffect } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileUp } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { insertText, getTextsCount } from "../../../../../utils/text/textUtils";
import { cn } from "@/lib/utils";
import UpgradeToProDialog from "@/components/ui/UpgradeToProDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CreateText = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [openProDialog, setOpenProDialog] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (title || text) {
        e.preventDefault();
        e.returnValue = ""; // Required for most browsers to trigger the alert
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [title, text]);

  function slugify(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  const handleCreateText = async () => {
    if (!title || !text) {
      toast.warning("Please fill in both the title and the text.");
      return;
    }

    if (text.length > 350) {
      toast.warning("Text exceeds 350 character limit.");
      return;
    }

    try {
      const { data, error } = await insertText({
        title,
        typingText: text,
      });

      if (error) {
        // Special case: Pro dialog trigger
        if (error.includes("Text limit reached")) {
          setOpenProDialog(true);
        } else {
          toast.error(error || "Failed to create text.");
        }
        return;
      }

      toast.success("Text created successfully!");
      const slug = `${data.id}-${slugify(title)}`;
      router.push(`/dashboard/texts/${slug}`);
    } catch (err) {
      toast.error("An unexpected error occurred");
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
        setText((event.target?.result as string) || "");
      };
      reader.readAsText(file);
      setOpenUpload(false);
    } else {
      alert("Please upload a .txt file");
    }
  };

  return (
    <div className="px-3 flex flex-col w-full max-w-[1100px] mx-auto overflow-hidden relative">
      <UpgradeToProDialog
        openProDialog={openProDialog}
        setOpenProDialog={setOpenProDialog}
      />

      <Dialog open={openUpload} onOpenChange={setOpenUpload}>
        <DialogContent className="max-w-[800px] mx-2">
          <DialogHeader>
            <DialogTitle className="text-lg text-center">
              Upload Text
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

      {/* Background Glows */}
      <div className="absolute top-4 right-4 md:top-25 md:right-30 w-[150px] h-[150px] sm:w-[300px] sm:h-[300px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />
      <div className="-z-3 absolute bottom-0 left-0 w-[600px] h-[400px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

      <Toaster position="top-center" />

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-md p-2 mb-5 -ml-2 w-20 hover:bg-gray-800 text-gray-400"
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
        Create Text
      </h1>

      <div className="mb-3 flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Type your title"
            required
            className="input-glow !bg-gray-900 !border-0"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="text">Typing Text</Label>
          <Textarea
            id="text"
            placeholder="Type or paste your text here..."
            className="input-glow !bg-gray-900 !border-0 min-h-50"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="text-gray-500 text-sm sm:text-base">
          {text.length} characters –
          <span className={cn("", text.length > 350 && "text-red-400")}>
            Max 350 characters
          </span>
        </div>
      </div>

      <Button
        onClick={handleCreateText}
        className="cursor-pointer text-blue-400 bg-blue-950/30 hover:bg-blue-950/70 mt-5 max-w-50 mx-auto px-4"
      >
        Create Text
      </Button>
    </div>
  );
};

export default CreateText;
