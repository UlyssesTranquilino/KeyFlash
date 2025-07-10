"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash, CircleUserRound } from "lucide-react";
import Link from "next/link";

import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Utils
import { insertFlashcard } from "../../../../utils/flashcard/flashcard";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function page() {
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
      toast.warning("Please input all requried fields");
      return;
    }

    if (!user) {
      toast.warning("You must sign in to create flashcard");
      return;
    }

    let card = {
      user_id: user?.id,
      title: title,
      description: description,
      terms: flashCardData,
      created_at: new Date(),
    };

    try {
      const { data: newCard, error } = await insertFlashcard(card);
      toast.success("Flashcard created successfully!");

      const slug = `${newCard.id}-${slugify(newCard.title)}`;
      router.push(`/flashcard/${slug}`);
    } catch (error) {
      toast.error("Failed to create flashcard");
      console.error(error);
    }
  };

  const { user, loading, session } = useAuth();

  return (
    <div className="px-2 max-w-[900px] mx-auto mb-14">
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
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <h1 className="text-center font-semibold text-lg md:text-xl mb-8 md:mb-10">
        Create Flashcard
      </h1>

      <div className="my-3 flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <Label htmlFor="email">Title</Label>
          <Input
            id="email"
            type="email"
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
          className="h-12 border-2 border-dashed bg-gray-900/20 hover:bg-gray-800/30 text-gray-200 w-1/2 mx-auto p-3 mt-2"
        >
          Add Card
        </Button>
      </div>

      <div className="mt-20 flex justify-end gap-3 sm:gap-8">
        <Button
          onClick={() => {
            setOpenReset(true);
          }}
          className="bg-gray-900/20 hover:bg-gray-800 text-gray-200"
        >
          Reset
        </Button>
        <Button
          onClick={handleCreateFlashcard}
          className="text-blue-400 bg-blue-950/30 hover:bg-blue-950/70"
        >
          Create FLashcard
        </Button>
      </div>
    </div>
  );
}
