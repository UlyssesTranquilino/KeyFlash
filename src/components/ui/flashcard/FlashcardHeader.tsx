"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  EllipsisVertical,
  Trash2,
  Pencil,
  Download,
  ArrowUpDown,
  Clipboard,
  Check,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { getUserPublicProfile } from "../../../../utils/auth/userUtils";

export const FlashcardHeader = ({
  title,
  description,
  onEdit,
  onDelete,
  flashcard,
  setFlashcard,
}: {
  title: string;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
  flashcard: any;
  setFlashcard: any;
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [ownerName, setOwnerName] = useState<string>("");

  const handleDownloadTxt = () => {
    if (!flashcard?.terms) return;

    // Format: "Question - Answer"
    const content = flashcard.terms
      .map(
        (term: any) =>
          `${term.question?.trim() || ""} - ${term.answer?.trim() || ""}`,
      )
      .join("\n\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${flashcard.title || "flashcards"}.txt`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFlipQuestionsAnswers = () => {
    if (!flashcard?.terms) return;

    const flipped = {
      ...flashcard,
      terms: flashcard.terms.map((term: any) => ({
        ...term,
        question: term.answer,
        answer: term.question,
      })),
    };

    // Update the parent state directly
    setFlashcard(flipped);

    // If you want it saved permanently, call your API here
    // await editFlashcard(flipped);
  };

  useEffect(() => {
    async function fetchOwner() {
      if (!flashcard?.user_id) return;

      const { data, error } = await getUserPublicProfile(flashcard.user_id);

      if (error) {
        console.error("Error fetching owner:", error);
        return;
      }

      setOwnerName(data.full_name || "Unknown");
    }

    fetchOwner();
  }, [flashcard?.user_id]);

  return (
    <div className="relative -mt-3 sm:-mt-5 mb-2">
      <div className="flex gap-1 mb-10 mt-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="cursor-pointer rounded-md p-2 mb-3 -ml-2 w-20 hover:bg-gray-800 text-gray-400"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </Button>
      </div>

      <div className="flex justify-between items-center gap-3 w-full">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-lg">{title}</h1>
            {flashcard.is_public ? (
              <span
                className="text-sm text-blue-300 bg-blue-800/20
 px-2 py-1 rounded-md"
              >
                Public
              </span>
            ) : (
              <span className="text-sm text-gray-400 bg-gray-900/30 px-2 py-1 rounded-md">
                Private
              </span>
            )}
          </div>

          {ownerName && (
            <p className="text-gray-400 text-sm mt-1">Created by {ownerName}</p>
          )}

          <p className="text-gray-300 max-w-170">{description}</p>
        </div>

        <div className="flex gap-1 items-center">
          {/* Share Button */}
          {flashcard.is_public && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/dashboard/flashcards/${flashcard.id}/share`;
                    navigator.clipboard.writeText(shareUrl);
                    toast.success("Link copied! Share it with your friends.");
                  }}
                  variant="ghost"
                  className="text-gray-400 hover:text-white  cursor-pointer flex items-center gap-1 px-3 py-3 rounded-md  text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  {/* <span>Share</span> */}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share - Copy Link</p>
              </TooltipContent>
            </Tooltip>
          )}

          {flashcard.user_id == user?.id && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onEdit}
                  variant="ghost"
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <Pencil className=" h-4 w-4" />
                  {/* Edit */}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <EllipsisVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 bg-gray-900 border-gray-700">
              <DropdownMenuItem
                onClick={handleFlipQuestionsAnswers}
                className="cursor-pointer focus:bg-gray-800"
              >
                <ArrowUpDown className="mr-2 h-4 w-4" /> Flip Q ↔ A
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleDownloadTxt}
                className="cursor-pointer focus:bg-gray-800"
              >
                <Download className="mr-2 h-4 w-4" />
                Download .txt
              </DropdownMenuItem>

              {flashcard.user_id == user?.id && (
                <DropdownMenuItem
                  onClick={onDelete}
                  className="cursor-pointer focus:bg-gray-800 text-red-400"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p className="text-gray-300 max-w-170">{description}</p>
    </div>
  );
};
