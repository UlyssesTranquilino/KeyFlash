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
  EllipsisVertical,
  Trash2,
  Pencil,
  Download,
  ArrowUpDown,
} from "lucide-react";

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
  const router = useRouter();

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
        <div className="flex items-center">
          <h1 className="font-semibold text-lg">{title}</h1>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                onClick={onEdit}
                variant="ghost"
                className="cursor-pointer text-gray-400 hover:text-white"
              >
                <EllipsisVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 bg-gray-900 border-gray-700">
              <DropdownMenuItem
                onClick={handleFlipQuestionsAnswers}
                className="cursor-pointer focus:bg-gray-800"
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />{" "}
                {/* Lucide swap/flip icon */}
                <span>Flip Q ↔ A</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleDownloadTxt}
                className="cursor-pointer focus:bg-gray-800"
              >
                <Download className="mr-2 h-4 w-4" />
                <span>Download .txt</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={onEdit}
                className="cursor-pointer focus:bg-gray-800"
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="cursor-pointer focus:bg-gray-800 text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p className="text-gray-300 max-w-170">{description}</p>
    </div>
  );
};
