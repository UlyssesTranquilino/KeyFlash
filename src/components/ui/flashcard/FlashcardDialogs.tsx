"use client";
// FlashcardDialogs.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { Trash } from "lucide-react";
import { FlashcardContextProvider } from "@/app/context/FlashcardContext";
import { useRef, useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "../switch";

// Discard Changes Dialog
export const DiscardChangesDialog = ({
  showDiscardConfirm,
  setShowDiscardConfirm,
  setOpenEditFlashcard,
  setCopyFlashcardData,
  flashcard,
}) => (
  <Dialog open={showDiscardConfirm} onOpenChange={setShowDiscardConfirm}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Discard changes?</DialogTitle>
        <DialogDescription>
          You have unsaved edits. If you cancel now, your changes will be lost.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => setShowDiscardConfirm(false)}
          className="cursor-pointer "
        >
          Keep Editing
        </Button>
        <Button
          onClick={() => {
            setShowDiscardConfirm(false);
            setOpenEditFlashcard(false);
            setCopyFlashcardData(flashcard); // revert edits
          }}
          className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
        >
          Discard
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

// Delete Flashcard
export const DeleteFlashcardDialog = ({ open, onOpenChange, onConfirm }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-[400px]">
      <DialogHeader>
        <DialogTitle className="text-lg">Delete Flashcard</DialogTitle>
        <DialogDescription>
          This action cannot be undone. The text will be permanently deleted.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-3 mt-4">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="cursor-pointer "
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700 text-white cursor-pointer "
        >
          Delete
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

// Quiz Mode Confirm Dialog
export const QuizModeConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-[400px]">
      <DialogHeader>
        <DialogTitle className="text-lg">Exit Quiz Mode</DialogTitle>
        <DialogDescription>
          Are you sure you want to exit quiz mode? This will reset your progress
          and return you to practice mode.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-3 mt-4">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="cursor-pointer text-gray-200 hover:text-white "
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700 text-white cursor-pointer "
        >
          Reset
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

// Reset Confirm Dialog
export const ResetConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-[400px]">
      <DialogHeader>
        <DialogTitle className="text-lg">Reset Flashcard</DialogTitle>
        <DialogDescription>
          Are you sure you want to reset flashcards?
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-3 mt-4">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="text-gray-200 hover:text-white cursor-pointer "
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700 text-white cursor-pointer "
        >
          Reset
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

// Edit Flashcard Dialog
export const EditFlashcardDialog = ({
  open,
  onOpenChange,
  flashcardData,
  onDeleteTerm,
  onAddTerm,
  onTitleChange,
  onDescriptionChange,
  onTermChange,
  onSave,
  setFlashcardData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flashcardData: any;
  onDeleteTerm: (id: string) => void;
  onAddTerm: () => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTermChange: (
    index: number,
    field: "question" | "answer",
    value: string,
  ) => void;
  onSave: () => void;
  setFlashcardData: (flashcardData: any) => void;
}) => {
  const [newCardId, setNewCardId] = useState<string | null>(null);
  const newCardRef = useRef<HTMLDivElement>(null);
  // put this near the top of the component (inside the component body)
  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const hotkeyLabel = isMac ? "⌘⏎" : "Ctrl ⏎";

  const prevTermsLengthRef = useRef(flashcardData?.terms?.length || 0);

  // Detect when a new card is added
  useEffect(() => {
    if (!flashcardData?.terms) return;

    const lastTerm = flashcardData.terms[flashcardData.terms.length - 1];
    if (flashcardData.terms.length > prevTermsLengthRef.current && lastTerm) {
      setNewCardId(lastTerm.id);
    }
    prevTermsLengthRef.current = flashcardData.terms.length;
  }, [flashcardData?.terms]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleAddTerm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Scroll into view when a new card is added
  useEffect(() => {
    if (newCardId && newCardRef.current) {
      newCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      setNewCardId(null); // Reset after scrolling
    }
  }, [newCardId]);

  // handleAddTerm just adds a card
  const handleAddTerm = () => {
    onAddTerm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="!max-w-[750px] w-full h-[80vh] p-4 sm:p-6"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Edit Flashcard
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400"></DialogDescription>
        </DialogHeader>

        <div className="sm:px-2 flex flex-col gap-5 overflow-scroll">
          <div className="my-3 flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder=""
                required
                className="input-glow !bg-gray-900 !border-0"
                value={flashcardData.title}
                onChange={(e) => onTitleChange(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="description">
                Description{" "}
                <span className="text-gray-400 px-1">(optional)</span>
              </Label>
              <Textarea
                id="description"
                placeholder=""
                className="input-glow !bg-gray-900 !border-0"
                value={flashcardData.description}
                onChange={(e) => onDescriptionChange(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 my-4">
              <label htmlFor="isPublic" className="text-gray-200">
                Public
              </label>
              <Switch
                checked={flashcardData.is_public}
                onCheckedChange={() => {
                  setFlashcardData((prev: any) => ({
                    ...prev,
                    is_public: !prev.is_public,
                  }));
                }}
                className="data-[state=checked]:bg-blue-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-around gap-9">
            <h1>Question</h1>
            <h1>Answer</h1>
          </div>

          <div className="min-h-[400px] max-h-[600px] overflow-auto flex flex-col gap-4">
            {flashcardData.terms?.map((card: any, index: number) => (
              <div
                key={card.id}
                ref={card.id === newCardId ? newCardRef : null} // <-- assign ref only to new card
                className="flex flex-col relative bg-gray-900/30"
              >
                {flashcardData.terms.length > 1 && (
                  <button
                    onClick={() => onDeleteTerm(card.id)}
                    className="cursor-pointer absolute hover:text-red-400 text-gray-500 self-end p-1"
                  >
                    <Trash className="scale-70" />
                  </button>
                )}
                <div className="flex items-center justify-around gap-3 sm:gap-5">
                  <div className="bg-gray-900 rounded-sm w-full h-full p-2 sm:p-4 min-h-30 md:min-h-40">
                    <textarea
                      value={card.question}
                      onInput={(e) => {
                        const target = e.currentTarget;
                        target.style.height = "auto";
                        target.style.height = `${target.scrollHeight}px`;
                      }}
                      onChange={(e) =>
                        onTermChange(index, "question", e.target.value)
                      }
                      className="h-full w-full bg-gray-900 resize-none overflow-hidden rounded-sm p-2 focus:outline-0"
                    />
                  </div>

                  <div className="bg-gray-900 rounded-sm w-full h-full p-2 sm:p-4 min-h-30 md:min-h-40">
                    <textarea
                      value={card.answer}
                      onInput={(e) => {
                        const target = e.currentTarget;
                        target.style.height = "auto";
                        target.style.height = `${target.scrollHeight}px`;
                      }}
                      onChange={(e) =>
                        onTermChange(index, "answer", e.target.value)
                      }
                      className="h-full w-full bg-gray-900 resize-none overflow-hidden rounded-sm p-2 focus:outline-0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleAddTerm}
                  aria-keyshortcuts={isMac ? "Meta+Enter" : "Control+Enter"}
                  title={`${isMac ? "Cmd" : "Ctrl"} + Enter`}
                  accessKey="n" // optional; gives Alt+Shift+N (Chrome/Win) or Ctrl+Alt+N (Linux)
                  className="cursor-pointer h-12 border-2 border-dashed bg-gray-900/20 hover:bg-gray-800/30 text-gray-200 w-1/2 mx-auto p-3 mt-2 inline-flex items-center justify-center gap-2"
                >
                  <span>Add Card</span>
                  <kbd className="rounded-md px-2 py-1 text-xs bg-gray-800/70 border border-gray-700">
                    {hotkeyLabel}
                  </kbd>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new card ({isMac ? "Cmd" : "Ctrl"} + Enter)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              onClick={() => onOpenChange(false)}
              className="cursor-pointer bg-gray-900/20 hover:bg-gray-800 text-gray-200"
            >
              Cancel
            </Button>
            <Button
              onClick={onSave}
              className="cursor-pointer text-blue-400 bg-blue-950/30 hover:bg-blue-950/70"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
