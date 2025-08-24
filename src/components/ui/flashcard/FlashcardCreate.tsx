

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash, CircleUserRound, ArrowLeft, FileUp } from "lucide-react";
import Link from "next/link";

import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Utils

import {
  getFlashcardsCount,
  insertFlashcard,
} from "../../../../utils/flashcard/flashcard";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import UpgradeToProDialog from "@/components/ui/UpgradeToProDialog";

export default function FlashcardCreate() {
  const searchParams = useSearchParams();
  const { user, loading, session } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [flashCardData, setFlashCardData] = useState([
    {
      id: 1,
      question: "",
      answer: "",
    },
    {
      id: 2,
      question: "",
      answer: "",
    },
  ]);

  const [openReset, setOpenReset] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [openProDialog, setOpenProDialog] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasContent =
        title ||
        description ||
        flashCardData.some((card) => card.question || card.answer);

      if (hasContent) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [title, description, flashCardData]);

  // Delete
  const handleDelete = (id: string) => {
    if (!flashCardData || flashCardData.length <= 0) return;

    setFlashCardData((prev: any) =>
      prev ? prev.filter((card: any) => card.id !== id) : []
    );
  };

  function slugify(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  const handleCreateFlashcard = async () => {
    const hasEmptyFields = flashCardData.some(
      (card: any) => !card.question?.trim() || !card.answer?.trim()
    );

    if (hasEmptyFields || !title) {
      toast.warning("Please input all required fields");
      return;
    }

    if (!user) {
      toast.warning("You must sign in to create flashcard");
      return;
    }

    const { count, isLimit, error: countError } = await getFlashcardsCount();

    if (countError || isLimit) {
      setOpenProDialog(true);
      return;
    }

    const card = {
      user_id: user.id,
      title,
      description,
      terms: flashCardData,
      created_at: new Date(),
    };

    try {
      const { data: newCard, error } = await insertFlashcard(card);
      if (error) throw error;

      toast.success("Flashcard created successfully!");
      const slug = `${newCard.id}-${slugify(newCard.title)}`;
      router.push(`/dashboard/flashcards/${slug}`);
    } catch (error) {
      toast.error("Failed to create flashcard");
      console.error(error);
    }
  };

  const parseFlashcardText = (text: string) => {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.includes("-"))
      .map((line, index) => {
        const [question, answer] = line.split("-").map((part) => part.trim());
        return {
          id: Date.now() + index,
          question,
          answer,
        };
      });
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".txt")) {
      toast.error("Please upload a .txt file");
      return;
    }

    try {
      const text = await file.text();
      const cards = parseFlashcardText(text);

      if (cards.length > 0) {
        // Update state first
        setFlashCardData(cards);

        toast.success("Flashcards loaded successfully!");
        setOpenUpload(false);
      } else {
        toast.warning("No valid flashcards found in the file");
      }
    } catch (error) {
      toast.error("Error reading file");
      console.error(error);
    }
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setFlashCardData([
      {
        id: 1,
        question: "",
        answer: "",
      },
      {
        id: 2,
        question: "",
        answer: "",
      },
    ]);
    setOpenReset(false);
  };

  return (
    <div className="px-2 max-w-[1100px] mx-auto mb-14 md:px-0 w-full">
      <UpgradeToProDialog
        openProDialog={openProDialog}
        setOpenProDialog={setOpenProDialog}
      />

      <Toaster position="top-center" />
      <Dialog open={openReset} onOpenChange={setOpenReset}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg">Reset Flashcard?</DialogTitle>
            <DialogDescription>
              All unsaved changes will be lost. Are you sure you want to clear
              this flashcard?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setOpenReset(false)}
              className="text-gray-200 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleReset();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openUpload} onOpenChange={setOpenUpload}>
        <DialogContent className="max-w-[800px] mx-2">
          <DialogHeader>
            <DialogTitle className="text-lg text-center">
              Upload Flashcard
            </DialogTitle>
            <DialogDescription>
              <div className=" text-sm text-gray-400 mb-4">
                <p className="text-white text-left">File format should be:</p>
                <p className="font-mono bg-gray-900 p-2 rounded mt-1">
                  question - answer
                </p>
                <p className="mt-2 text-white text-left ">Example:</p>
                <div className="font-mono bg-gray-900 p-2 rounded text-left">
                  <p>What is the capital of France? - Paris</p>
                  <p>Largest planet in our solar system? - Jupiter</p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-3 text-center transition-colors",
              isDragging
                ? "border-blue-400 bg-blue-900/20"
                : "border-blue-300/60",
              !user && "blur-xs"
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

      <div className="flex items-center justify-between ">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="cursor-pointer rounded-md p-2  mb-5 -ml-2 w-20 hover:bg-gray-800 text-gray-400"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenUpload(true)}
          className="cursor-pointer rounded-md p-2  mb-5 -ml-2 w-20 hover:bg-gray-800 text-gray-400"
        >
          <FileUp className="h-5 w-5" />
          Upload
        </Button>
      </div>
      <h1 className="text-center font-semibold text-lg md:text-xl mb-8 md:mb-10">
        Create Flashcard
      </h1>

      <div className="my-3 flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <Label htmlFor="email">Title</Label>
          <Input
            id="text"
            type="text"
            placeholder=""
            required
            className="input-glow !bg-gray-900 !border-0"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="email">
            Description <span className="text-gray-400 px-1 ">(optional)</span>
          </Label>
          <Textarea
            id="description"
            placeholder=""
            className="input-glow !bg-gray-900 !border-0"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <h1 className=" mt-10 mb-5 font-semibold">Terms</h1>
      <div className="flex items-center justify-around gap-9 ">
        <h1>Question</h1>
        <h1>Answer</h1>
      </div>
      <div className="flex flex-col gap-3 my-5">
        {flashCardData?.map((card: any, index: number) => (
          <div key={card.id} className="flex flex-col relative bg-gray-900/30">
            {flashCardData.length > 1 && (
              <button
                onClick={() => handleDelete(card.id)}
                className="absolute  hover:text-red-400 text-gray-500 self-end p-1"
              >
                <Trash className="scale-70" />
              </button>
            )}
            <div className="flex items-start justify-around gap-3 sm:gap-5">
              <div className="bg-gray-900 rounded-sm w-full h-full p-2 sm:p-4 min-h-30 md:min-h-40 flex">
                <textarea
                  value={card.question}
                  onInput={(e) => {
                    e.currentTarget.style.height = "auto";
                    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                  }}
                  onChange={(e) => {
                    setFlashCardData((prev: any) => {
                      return prev.map((item: object, idx: number) => {
                        if (idx === index) {
                          return { ...item, question: e.target.value };
                        } else {
                          return item;
                        }
                      });
                    });
                  }}
                  className="h-full w-full bg-gray-900 resize-none overflow-hidden rounded-sm p-2 focus:outline-0 flex-grow"
                />
              </div>

              <div className="bg-gray-900 rounded-sm w-full h-full p-2 sm:p-4 min-h-30 md:min-h-40 flex">
                <textarea
                  value={card.answer}
                  onInput={(e) => {
                    e.currentTarget.style.height = "auto";
                    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                  }}
                  onChange={(e) => {
                    setFlashCardData((prev: any) => {
                      return prev.map((item: object, idx: number) => {
                        if (idx === index) {
                          return { ...item, answer: e.target.value };
                        } else {
                          return item;
                        }
                      });
                    });
                  }}
                  className="h-full w-full bg-gray-900 resize-none overflow-hidden rounded-sm p-2 focus:outline-0 flex-grow"
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          onClick={() => {
            const MAX_CARDS_GUEST = 10;
            const isLoggedIn = false;
            const isGuest = !isLoggedIn;

            setFlashCardData((prev: any) => [
              ...prev,
              {
                id: Date.now(),
                question: "",
                answer: "",
              },
            ]);
          }}
          className="cursor-pointer h-12 border-2 border-dashed bg-gray-900/20 hover:bg-gray-800/30 text-gray-200 w-1/2 mx-auto p-3 mt-2"
        >
          Add Card
        </Button>
      </div>

      <div className="mt-20 flex justify-end gap-3 sm:gap-8">
        <Button
          onClick={() => {
            setOpenReset(true);
          }}
          className="cursor-pointer bg-gray-900/20 hover:bg-gray-800 text-gray-200"
        >
          Reset
        </Button>
        <Button
          onClick={handleCreateFlashcard}
          className="cursor-pointer text-blue-400 bg-blue-950/30 hover:bg-blue-950/70"
        >
          Create FLashcard
        </Button>
      </div>
    </div>
  );
}
