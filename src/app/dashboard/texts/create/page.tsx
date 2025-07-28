"use client";

import { useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { insertText } from "../../../../../utils/text/textUtils";
import { cn } from "@/lib/utils";

const CreateText = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  function slugify(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  const handleCreateText = async () => {
    if (!title || !text) {
      toast.warning(
        "Please make sure all flashcards have both a question and an answer."
      );

      return;
    }

    try {
      let textData = {
        title: title,
        typingText: text,
      };

      const { data, error } = await insertText(textData);
      toast.success("Text created successfully!");

      const slug = `${data.id}-${slugify(title)}`;
      router.push(`/dashboard/texts/${slug}`);
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="px-3 flex flex-col  w-full max-w-[1100px] mx-auto overflow-hidden relative">
      <div className="absolute top-4 right-4 md:top-25 md:right-30 w-[150px] h-[150px]  sm:w-[300px] sm:h-[300px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

      <div className="-z-3 absolute bottom-0 left-0 w-[600px] h-[400px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

      <Toaster position="top-center" />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="rounded-md p-2  mb-5 -ml-2 w-20 hover:bg-gray-800 text-gray-400"
      >
        <ArrowLeft className="h-5 w-5" /> Back
      </Button>

      <h1 className="text-center font-semibold text-lg md:text-xl mb-8">
        Create Text
      </h1>

      <div className="mb-3 flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <Label htmlFor="email">Title</Label>
          <Input
            id="email"
            type="email"
            placeholder="Type your title"
            required
            className="input-glow !bg-gray-900 !border-0"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="email">Typing Text</Label>
          <Textarea
            id="text"
            placeholder="Type or paste your text here..."
            className="input-glow !bg-gray-900 !border-0 min-h-50"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="text-gray-500 text-sm sm:text-base">
          {text.length} characters -
          <span className={cn(" ", text.length > 500 && "text-red-400")}>
            Max 500 characters
          </span>
        </div>
      </div>

      <Button
        onClick={handleCreateText}
        className="cursor-pointer text-blue-400 bg-blue-950/30 hover:bg-blue-950/70  mt-5 max-w-50 mx-auto px-4"
      >
        Create Text
      </Button>
    </div>
  );
};

export default CreateText;
