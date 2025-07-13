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

const CreateText = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleCreateText = () => {
    if (!title || !text) {
    }
  };

  return (
    <div className="px-3 flex flex-col  w-full">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="rounded-md p-2  mb-5 -ml-2 w-20 hover:bg-gray-800 text-gray-400"
      >
        <ArrowLeft className="h-5 w-5" /> Back
      </Button>

      <h1 className="text-center font-semibold text-lg md:text-xl mb-8 md:mb-10">
        Write Text
      </h1>

      <div className="my-3 flex flex-col gap-3">
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
      </div>

      <Button
        onClick={handleCreateText}
        className=" text-blue-400 bg-blue-950/30 hover:bg-blue-950/70  mt-5 max-w-50 mx-auto px-4"
      >
        Create Text
      </Button>
    </div>
  );
};

export default CreateText;
