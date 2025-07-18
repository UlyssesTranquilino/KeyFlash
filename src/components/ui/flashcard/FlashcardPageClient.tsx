"use client";

import { createClient } from "../../../../utils/supabase/server";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import {
  editFlashcard,
  getFlashcard,
} from "../../../../utils/flashcard/flashcard";
import { Button } from "@/components/ui/button";
import { type CarouselApi } from "@/components/ui/carousel";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { spaceMono } from "@/app/ui/fonts";
import {
  ArrowLeft,
  RotateCcw,
  TriangleAlert,
  MousePointer,
  Pointer,
  CheckCircle,
  Eye,
  EyeClosed,
  Type,
  FileUp,
  Trash,
  Ban,
  CircleX,
  Check,
  X,
  Rewind,
  Pencil,
  Keyboard,
  Shuffle,
  Maximize,
  Minimize,
  Trash2,
  EllipsisVertical,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useFlashcard } from "@/app/context/FlashcardContext";
import { useWpm } from "@/app/context/WpmContext";
import { flushSync } from "react-dom";
import { Switch } from "@/components/ui/switch";
import SkeletonFlashcard from "./SkeletonFlashcard";
import { SimpleResults } from "./ResultsComponent";
import { deleteFlashcard } from "../../../../utils/flashcard/flashcard";

const FlashcardPageClient = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { showWpm, setShowWpm } = useWpm();
  const id = slug.split("-")[0];
  const [api, setApi] = useState<CarouselApi>();
  const [flashcard, setFlashcard] = useState<any>({
    title: "",
    description: "",
    terms: [],
  });

  const [copyFlashcardData, setCopyFlashcardData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Flashcard Carousel
  const [count, setCount] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [isQuizModeConfirm, setIsQuizModeConfirm] = useState(false);
  const { blurAnswer, setBlurAnswer, openEditFlashcard, setOpenEditFlashcard } =
    useFlashcard();
  const [currentPhase, setCurrentPhase] = useState<"question" | "answer">(
    "question"
  );
  const [questionCompleted, setQuestionCompleted] = useState(false);
  const [cardCompleted, setCardCompleted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Typing states
  const [userInput, setUserInput] = useState("");
  const [isFocused, setIsFocused] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isIdle, setIsIdle] = useState(true);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [isClickingOnText, setIsClickingOnText] = useState(false);

  // Ref
  const inputRef = useRef<HTMLInputElement>(null);
  const answerInputRef = useRef<HTMLInputElement>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Stat
  const [correct, setCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [current, setCurrent] = useState(0);
  const [currentTerm, setCurrentTerm] = useState<any>();
  const currentText =
    currentPhase === "question" ? currentTerm?.question : currentTerm?.answer;
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);

  const [isTypingMode, setIsTypingMode] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  // Edit
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchFlashcard = async () => {
      if (user?.id) {
        setLoading(true);
        const { data } = await getFlashcard(user.id, id);

        setCurrentTerm(data.terms[0]);
        setTitle(data.title);
        setDescription(data.description);
        setLoading(false);
        setFlashcard(data);
        setCopyFlashcardData(data);
      }
    };
    fetchFlashcard();
  }, [user, id]);

  // Handle Delete Flashcard
  const handleDeleteFlashcard = async () => {
    try {
      const { error } = await deleteFlashcard(id);

      if (error) {
        toast.error("Failed to delete flashcard: " + error);
      } else {
        toast.success("Flashcard deleted successfully!");
        router.push("/home");
      }
    } catch (err) {
      toast.error("An unenxpected error occured");
    }
  };

  // Handle answer submission in blur mode
  const handleAnswerSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCardCompleted(true);

      if (userAnswer === currentTerm?.answer) {
        setCorrect(true);
        setCorrectCount((prev) => prev + 1);
      } else {
        setCorrect(false);
        setWrongCount((prev) => prev + 1);
      }

      // Focus back to the hidden input to continue typing
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);

      setTimeout(() => {
        if (current < flashcard.terms.length - 1) {
          api?.scrollNext();
          setUserInput("");
        } else {
          setAllComplete(true);
        }
      }, 800);
    }
  };

  const handleTextClick = useCallback(() => {
    setIsClickingOnText(true);
    inputRef.current?.focus();
    setTimeout(() => setIsClickingOnText(false), 100);
  }, []);

  // Fixed highlighted text function
  const highlightedText = useMemo(() => {
    if (!currentText) return null;

    return currentText.split("").map((char: any, index: any) => {
      const userChar = userInput[index];
      const isTyped = index < userInput.length;
      const isCorrect = userChar === char;
      const isCursor = index === userInput.length;

      const className = isTyped
        ? isCorrect
          ? "text-white"
          : "text-red-600/75 bg-red-900/30"
        : "text-gray-500";

      const displayChar = char === " " ? "\u00A0" : char;

      return (
        <span key={index} className="relative">
          {isCursor && (
            <span
              className={`absolute left-0 top-1 lg:top-[9px] w-0.5 h-6 bg-blue-400 ${
                isIdle ? "animate-pulse" : ""
              }`}
              style={{
                animation: isIdle ? "pulse 1s ease-in-out infinite" : "none",
              }}
            />
          )}
          <span className={className}>{displayChar}</span>
        </span>
      );
    });
  }, [currentText, userInput, isIdle]);

  const resetCurrentCard = useCallback(() => {
    setUserInput("");
    setUserAnswer("");
    setCurrentIndex(0);
    setCurrentPhase("question");
    setQuestionCompleted(false);
    setCardCompleted(false);
    setStartTime(null);
    setWpm(0);
    setShowAnswer(false);
    setCorrect(false); // Add this to reset the correct state
    setBlurAnswer(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [setBlurAnswer]);

  const shuffleFlashcards = useCallback(() => {
    // Create a deep copy of the terms array
    const shuffledTerms = [...flashcard.terms];

    // Fisher-Yates shuffle algorithm
    for (let i = shuffledTerms.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledTerms[i], shuffledTerms[j]] = [
        shuffledTerms[j],
        shuffledTerms[i],
      ];
    }

    // Update state in one go to prevent inconsistencies
    setFlashcard((prev) => ({
      ...prev,
      terms: shuffledTerms,
    }));

    // Reset to first card after shuffle
    setCurrent(0);
    setCurrentTerm(shuffledTerms[0]);
    setIsShuffled(true);
    resetCurrentCard();

    // Force carousel to reset position
    setTimeout(() => {
      api?.scrollTo(0);
    }, 0);
  }, [flashcard.terms, api, resetCurrentCard]);

  const unshuffleFlashcards = useCallback(() => {
    // Restore original order
    setFlashcard(copyFlashcardData);

    // Reset to first card
    setCurrent(0);
    setCurrentTerm(copyFlashcardData.terms[0]);
    setIsShuffled(false);
    resetCurrentCard();

    // Force carousel to reset position
    setTimeout(() => {
      api?.scrollTo(0);
    }, 0);
  }, [copyFlashcardData, api, resetCurrentCard]);

  useEffect(() => {
    if (api) {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());

      api.on("select", () => {
        setCurrent(api.selectedScrollSnap());
        setCurrentTerm(flashcard.terms[api.selectedScrollSnap()]);
        resetCurrentCard();
      });
    }
  }, [api, flashcard.terms, resetCurrentCard]);

  const handleRestart = useCallback(() => {
    resetCurrentCard();
  }, [resetCurrentCard]);

  const [showSimpleResults, setShowSimpleResults] = useState(false);
  useEffect(() => {
    if (allComplete) {
      setShowSimpleResults(true);
    }
  }, [allComplete]);

  // Typing
  // WPM calculation
  const updateWpm = useCallback((inputLength: number, start: number) => {
    const timeElapsed = (Date.now() - start) / 60000;
    const words = inputLength > 0 ? Math.max(1, inputLength / 5) : 0;
    setWpm(Math.round(words / timeElapsed));
  }, []);

  // Input change handler
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const currentTime = Date.now();

      setIsIdle(false);

      // Start timer on first input
      if (!startTime) {
        setStartTime(currentTime);
      }

      setUserInput(value);
      setCurrentIndex(value.length);

      // Update WPM
      if (startTime && value.length > 0) {
        updateWpm(value.length, startTime);
      }

      // Check completion
      if (
        (currentText && value === currentText) ||
        value.length >= currentText.length
      ) {
        if (currentPhase === "question") {
          setQuestionCompleted(true);
          setTimeout(() => {
            setCurrentPhase("answer");
            // Only reset input and related states, not the phase
            setUserInput("");
            setCurrentIndex(0);
            setStartTime(null);
            setWpm(0);
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 500);
        } else {
          setCorrect(true);
          setCardCompleted(true);
          setCorrectCount((prev) => prev + 1);

          // Only allow navigation in quiz mode if card is completed
          setTimeout(() => {
            if (current < flashcard.terms.length - 1) {
              api?.scrollNext();
            } else {
              console.log("All cards completed!");
            }
          }, 1000);
        }
      }
    },
    [
      currentText,
      currentPhase,
      startTime,
      updateWpm,
      current,
      api,
      flashcard.terms.length,
    ]
  );

  const deletePreviousWord = useCallback(() => {
    let deleteTo = currentIndex - 1;
    while (deleteTo > 0 && userInput[deleteTo - 1] !== " ") {
      deleteTo--;
    }
    const newInput = userInput.substring(0, deleteTo);
    setUserInput(newInput);
    setCurrentIndex(deleteTo);
  }, [currentIndex, userInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && e.ctrlKey) {
        e.preventDefault();
        deletePreviousWord();
      }
    },
    [deletePreviousWord]
  );

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
    setIsClickingOnText(false);
  }, []);

  const handleInputBlur = useCallback(() => {
    if (!isClickingOnText) {
      setIsFocused(false);
    }
  }, [isClickingOnText]);

  const handleEditFlashcard = async () => {
    const hasEmptyFields = copyFlashcardData.terms.some(
      (card: any) => !card.question?.trim() || !card.answer?.trim()
    );

    if (hasEmptyFields || !copyFlashcardData.title) {
      toast.warning(
        "Please make sure all flashcards have both a question and an answer."
      );
      return;
    }

    try {
      const { data, error } = await editFlashcard(copyFlashcardData);

      if (error) {
        toast.error("Failed to update flashcard: " + error);
      } else {
        toast.success("Flashcard updated successfully!");

        // Update all states
        setFlashcard(data);
        setCopyFlashcardData(data);
        setTitle(data.title);
        setDescription(data.description);

        // Reset carousel completely
        setCurrentTerm(data.terms[0]);
        setCurrent(0);

        // Force carousel reset by using setTimeout
        setTimeout(() => {
          api?.scrollTo(0);
          setUserInput("");
          setUserAnswer("");
          setCurrentPhase("question");
          setQuestionCompleted(false);
          setCardCompleted(false);
        }, 0);
        router.refresh();
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }

    setOpenEditFlashcard(false);
  };

  const handleDelete = (id: string) => {
    if (!copyFlashcardData || copyFlashcardData.length <= 0) return;

    setCopyFlashcardData((prev: any) => {
      let newTerms = prev.terms
        ? prev.terms.filter((card: any) => card.id !== id)
        : [];
      return { ...prev, terms: newTerms };
    });
  };

  useEffect(() => {
    if (allComplete) {
      setShowSimpleResults(true);
    }
  }, [allComplete]);

  const handleResetFlashcards = () => {
    setShowSimpleResults(false);
    setAllComplete(false);
    setCorrectCount(0);
    setWrongCount(0);
    api?.scrollTo(0);
    resetCurrentCard();
    setShowResetConfirm(false);
  };

  return (
    <div
      className={`max-w-[900px] mx-auto px-2 sm:px-5 mb-20 relative overflow-hidden mt-14 ${
        isFullScreen ? "fixed inset-0 top-1/5  z-50 p-0 m-0 " : ""
      }`}
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

      <div className="-z-3 absolute bottom-0 -left-[500px] w-[600px] h-[400px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

      <Toaster position="top-center" />

      {showSimpleResults && (
        <SimpleResults
          correctCount={correctCount}
          totalCards={flashcard.terms.length}
          onRestart={handleResetFlashcards}
          isQuizMode={isQuizMode}
        />
      )}

      {!loading ? (
        <div className="relative -mt-3 sm:-mt-5">
          <div className="absolute bottom-70 -right-3 -z-2 size-155 rounded-full bg-radial-[at_50%_50%] from-blue-500/20 to-black to-70%" />

          <Dialog open={openConfirmDelete} onOpenChange={setOpenConfirmDelete}>
            <DialogContent className="max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-lg">Delete Flashcard</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. The text will be permanently
                  deleted and removed from your library.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpenConfirmDelete(false);
                  }}
                  className="text-gray-200 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleDeleteFlashcard();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isQuizModeConfirm} onOpenChange={setIsQuizModeConfirm}>
            <DialogContent className="max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-lg">Exit Quiz Mode</DialogTitle>
                <DialogDescription>
                  Are you sure you want to exit quiz mode? This will reset your
                  progress and return you to practice mode.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsQuizModeConfirm(false);
                    setCopyFlashcardData(flashcard);
                  }}
                  className="text-gray-200 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Reset all cards state
                    setUserInput("");
                    setUserAnswer("");
                    setCurrentIndex(0);
                    setCurrentPhase("question");
                    setQuestionCompleted(false);
                    setCardCompleted(false);
                    setStartTime(null);
                    setWpm(0);
                    setShowAnswer(false);
                    setCorrect(false);
                    setBlurAnswer(true);

                    // Reset statistics
                    setCorrectCount(0);
                    setWrongCount(0);

                    // Go back to the first card
                    api?.scrollTo(0);
                    setCurrent(0);

                    // Focus the input
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 0);

                    // Close the dialog
                    setIsQuizModeConfirm(false);
                    setIsQuizMode(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Reset
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
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
                  onClick={() => {
                    setIsQuizModeConfirm(false);
                    setCopyFlashcardData(flashcard);
                  }}
                  className="text-gray-200 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Reset all cards state
                    handleResetFlashcards();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Reset
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={openEditFlashcard} onOpenChange={setOpenEditFlashcard}>
            <DialogContent
              onOpenAutoFocus={(e) => e.preventDefault()}
              className="!max-w-[750px] w-full h-[80vh]"
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-center">
                  Edit Flashcard
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-400"></DialogDescription>
              </DialogHeader>

              <div className="mt-4 px-2 flex flex-col gap-5 overflow-scroll  ">
                <div className="my-3 flex flex-col gap-3">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="email">Title</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder=""
                      required
                      className="input-glow !bg-gray-900 !border-0"
                      value={copyFlashcardData.title}
                      onChange={(e) => {
                        setCopyFlashcardData((prev: any) => ({
                          ...prev,
                          title: e.target.value,
                        }));
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label htmlFor="email">
                      Description{" "}
                      <span className="text-gray-400 px-1 ">(optional)</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder=""
                      className="input-glow !bg-gray-900 !border-0"
                      value={copyFlashcardData.description}
                      onChange={(e) => {
                        setCopyFlashcardData((prev: any) => ({
                          ...prev,
                          description: e.target.value,
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-around gap-9 ">
                  <h1>Question</h1>
                  <h1>Answer</h1>
                </div>
                {copyFlashcardData.terms?.map((card: any, index: number) => (
                  <div
                    key={card.id}
                    className="flex flex-col  relative bg-gray-900/30"
                  >
                    {copyFlashcardData.terms.length > 1 && (
                      <button
                        onClick={() => handleDelete(card.id)}
                        className="absolute  hover:text-red-400 text-gray-500 self-end p-1"
                      >
                        <Trash className="scale-70" />
                      </button>
                    )}
                    <div className="flex items-center justify-around gap-3 sm:gap-5 ">
                      <div className="bg-gray-900 rounded-sm w-full h-full p-2 sm:p-4 min-h-30 md:min-h-40">
                        <textarea
                          value={card.question}
                          onInput={(e) => {
                            e.currentTarget.style.height = "auto";
                            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                          }}
                          onChange={(e) => {
                            setCopyFlashcardData((prev: any) => {
                              const newTerms = [...prev.terms];
                              newTerms[index] = {
                                ...newTerms[index],
                                question: e.target.value,
                              };
                              return { ...prev, terms: newTerms };
                            });
                          }}
                          className="h-full w-full bg-gray-900 resize-none overflow-hidden rounded-sm p-2 focus:outline-0"
                        />
                      </div>

                      <div className="bg-gray-900 rounded-sm w-full h-full p-2 sm:p-4 min-h-30 md:min-h-40">
                        <textarea
                          value={card.answer}
                          onInput={(e) => {
                            e.currentTarget.style.height = "auto";
                            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                          }}
                          onChange={(e) => {
                            setCopyFlashcardData((prev: any) => {
                              const newTerms = [...prev.terms];

                              newTerms[index] = {
                                ...newTerms[index],
                                answer: e.target.value,
                              };
                              return { ...prev, terms: newTerms };
                            });
                          }}
                          className="h-full w-full bg-gray-900 resize-none overflow-hidden rounded-sm p-2 focus:outline-0"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  onClick={() => {
                    setCopyFlashcardData((prev: any) => {
                      let newTerms = prev.terms;
                      newTerms = [
                        ...newTerms,
                        {
                          id: Date.now(),
                          question: "",
                          answer: "",
                        },
                      ];

                      return { ...prev, terms: newTerms };
                    });
                  }}
                  className="h-12 border-2 border-dashed bg-gray-900/20 hover:bg-gray-800/30 text-gray-200 w-1/2 mx-auto p-3 mt-2"
                >
                  Add Card
                </Button>
                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    onClick={() => {
                      setOpenEditFlashcard(false);
                    }}
                    className="bg-gray-900/20 hover:bg-gray-800 text-gray-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditFlashcard}
                    className="text-blue-400 bg-blue-950/30 hover:bg-blue-950/70"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {!isFullScreen && (
            <div className="my-3 x-auto flex flex-col mb-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="rounded-md p-2 -ml-2 w-20 hover:bg-gray-800 text-gray-400"
              >
                <ArrowLeft className="h-5 w-5" /> Back
              </Button>
              <div className="flex justify-between items-center gap-3 w-full">
                <div className="flex items-center">
                  <h1 className="font-semibold text-lg">{flashcard.title}</h1>
                </div>

                <div className="flex gap-2 ">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowWpm(!showWpm);
                    }}
                    variant="ghost"
                    className={cn(
                      "text-gray-400 hover:text-white",
                      showWpm && "text-blue-400 hover:text-blue-400"
                    )}
                  >
                    WPM
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                      >
                        <EllipsisVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40 bg-gray-900 border-gray-700">
                      <DropdownMenuItem
                        onClick={() => {
                          e.preventDefault();
                          setOpenEditFlashcard(true);
                        }}
                        className="cursor-pointer focus:bg-gray-800"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setOpenConfirmDelete(true)}
                        className="cursor-pointer focus:bg-gray-800 text-red-400 "
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <p className="text-gray-300 max-w-170">{flashcard.description}</p>
            </div>
          )}

          <div className={`${isFullScreen ? "h-screen " : "h-[100vh] pt-3"}`}>
            <div className="mb-6  flex items-center justify-between max-w-[800px] mx-auto">
              {showWpm ? (
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 20, opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="mt-2 text-blue-400 font-mono w-full text-right"
                >
                  {wpm} WPM
                </motion.div>
              ) : (
                <div className="h-0" />
              )}
            </div>

            <Carousel
              setApi={setApi}
              className="mx-auto relative"
              opts={{
                watchDrag: !isQuizMode, // Disable swipe in quiz mode
                dragFree: isQuizMode, // Makes it harder to accidentally swipe
                skipSnaps: isQuizMode, // Prevents partial swipes from changing cards
              }}
            >
              <CarouselContent
                className={`max-w-[900px] w-full mx-auto gap-x-6 ${spaceMono.className} `}
              >
                {flashcard?.terms.map((item: any, index: any) => (
                  <CarouselItem
                    key={index}
                    className={`rounded-2xl bg-gray-900/70 relative overflow-hidden ${
                      isFullScreen ? "h-100" : "h-96"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center h-full p-8">
                      <div className="absolute top-6 right-0 w-full items-center flex justify-between px-3">
                        {/* Phase indicator */}
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => setCurrentPhase("question")}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm cursor-pointer ${
                              currentPhase === "question"
                                ? "bg-blue-600/20 text-blue-400"
                                : questionCompleted
                                ? "bg-green-600/20 text-green-400"
                                : "bg-gray-600/20 text-gray-400"
                            }`}
                          >
                            {questionCompleted && (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            <span className="text-xs">Question</span>
                          </div>

                          <div
                            onClick={() => setCurrentPhase("answer")}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm cursor-pointer ${
                              currentPhase === "answer"
                                ? "bg-blue-600/20 text-blue-400"
                                : cardCompleted
                                ? "bg-green-600/20 text-green-400"
                                : "bg-gray-600/20 text-gray-400"
                            }`}
                          >
                            {cardCompleted && (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            <span className="text-xs">Answer</span>
                          </div>
                        </div>

                        <div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => setBlurAnswer(!blurAnswer)}
                                className={cn(
                                  "flex items-center gap-2 text-[0.9rem] transition px-3 lg:px-2",
                                  blurAnswer
                                    ? "text-blue-400"
                                    : "text-gray-400 hover:text-white"
                                )}
                              >
                                {!blurAnswer ? (
                                  <Eye className="scale-78" />
                                ) : (
                                  <EyeClosed className="scale-78" />
                                )}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {!blurAnswer ? "Hide Answer" : "Show Answer"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      {/* Current phase label */}
                      <h2 className="text-sm md:text-base text-gray-400 mb-4 mt-10 ">
                        {isTypingMode &&
                          (currentPhase === "question"
                            ? "Type the question:"
                            : blurAnswer
                            ? "Type your answer and press Enter:"
                            : "Type the answer:")}
                      </h2>

                      {/* Text to type */}
                      <div
                        ref={textContainerRef}
                        className="text-center flex items-center justify-center w-full max-w-[600px]"
                      >
                        {currentPhase === "answer" &&
                        blurAnswer &&
                        !showAnswer ? (
                          // Show input field for answer when blurAnswer is on
                          <div className="w-full">
                            <input
                              value={userAnswer}
                              ref={answerInputRef}
                              type="text"
                              className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                              placeholder="Type your answer here..."
                              onKeyDown={handleAnswerSubmit}
                              onChange={(e) => setUserAnswer(e.target.value)}
                              autoFocus
                            />
                          </div>
                        ) : (
                          // Show normal typing interface for other cases
                          <motion.div
                            key={`${index}-${currentPhase}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`text-xl md:text-2xl text-center font-mono leading-relaxed mb-8 sm:px-4 cursor-text whitespace-pre transition-all duration-300`}
                            onClick={handleTextClick}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            {isTypingMode ? (
                              <div className="flex flex-wrap justify-center text-center mx-auto">
                                {highlightedText}
                              </div>
                            ) : (
                              <p className="whitespace-pre-line">
                                {" "}
                                {currentText}
                              </p>
                            )}
                          </motion.div>
                        )}
                      </div>

                      {/* Show correct answer if blurAnswer is on and user pressed Enter */}
                      {currentPhase === "answer" &&
                        blurAnswer &&
                        showAnswer && (
                          <div className="mt-4 p-4 bg-gray-800 rounded-md w-full">
                            <p className="text-gray-400 mb-2">
                              Correct answer:
                            </p>
                            <p className="text-white text-xl">
                              {currentTerm?.answer}
                            </p>
                          </div>
                        )}

                      {/* Card completion indicator */}
                      {cardCompleted && correct && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-green-400 text-center mt-6"
                        >
                          <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                          <span className="text-sm">
                            {blurAnswer ? "Correct Answer!" : "Card completed!"}
                          </span>
                        </motion.div>
                      )}

                      {cardCompleted && !correct && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-center mt-6"
                        >
                          <CircleX className="text-red-400 w-8 h-8 mx-auto mb-2" />
                          <span className="text-red-400 text-sm">
                            Wrong Answer!
                          </span>
                          <div className="mt-1">
                            Correct Answer: {currentTerm?.answer}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="w-full absolute right-1/2 -bottom-30 grid grid-cols-5 items-center translate-x-1/2">
                <div className="flex items-center justify-start flex-nowrap sm:items-center gap-3 sm:gap-5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col switch gap-1 items-center">
                        <Switch
                          id="code-toggle"
                          checked={isQuizMode}
                          onCheckedChange={() => {
                            if (!isQuizMode) setIsQuizMode(true);
                            else setIsQuizModeConfirm(true);
                          }}
                          className={cn(
                            "scale-80",
                            "data-[state=checked]:bg-blue-400",
                            "data-[state=checked]:border-blue-400",
                            "data-[state=checked]:ring-blue-400"
                          )}
                        />
                        <Label
                          htmlFor="code-toggle"
                          className="text-sm flex items-center gap-2"
                        >
                          Quiz
                        </Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Quiz Mode - Track your Progress</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={cn(
                          "flex items-center gap-2 py-2 hover:text-blue-400 hover:bg-blue-950/30 rounded-md transition-colors",
                          isTypingMode ? "text-blue-400" : "text-gray-400"
                        )}
                        onClick={() => setIsTypingMode(!isTypingMode)}
                      >
                        <Keyboard className="w-5 h-5" />
                        <span className="hidden text-sm">
                          {isTypingMode ? "On" : "Off"}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Typing Mode {isTypingMode ? "On" : "Off"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={cn(
                          "flex items-center gap-2 py-2 hover:text-blue-400 hover:bg-blue-950/30 rounded-md transition-colors",
                          isShuffled ? "text-blue-400" : "text-gray-400"
                        )}
                        onClick={
                          isShuffled ? unshuffleFlashcards : shuffleFlashcards
                        }
                      >
                        <Shuffle className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isShuffled ? "Unshuffle Cards" : "Shuffle Cards"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="w-full col-span-3 relative">
                  <div className="text-center w-25 sm:w-34 mx-auto relative">
                    <CarouselPrevious
                      disabled={isQuizMode}
                      className="flex absolute left-0 top-1/2 -translate-y-1/2 z-10 scale-75 sm:scale-100"
                    />
                    <div className="text-gray-400 text-sm sm:text-base">
                      {current + 1} / {count}
                    </div>

                    <CarouselNext
                      disabled={isQuizMode}
                      className="flex absolute right-0 top-1/2 -translate-y-1/2 z-10 scale-75 sm:scale-100"
                    />
                  </div>
                  {isQuizMode && (
                    <div className="flex items-center justify-center text-sm gap-3 absolute -translate-x-1/67 p-4 w-full">
                      <div className="flex gap-1">
                        <Check className="h-5 w-5 text-green-400" />
                        <span className="text-gray-300"> {correctCount}</span>
                      </div>
                      <div className="flex gap-1">
                        <X className="h-5 w-5 text-red-400" />
                        <span className="text-gray-300"> {wrongCount}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress and controls */}
                <div className="flex justify-end gap-5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        disabled={isQuizMode}
                        className="flex my-14 items-center gap-2 py-2 hover:text-blue-400 hover:bg-blue-950/30 rounded-md text-gray-400 transition-colors"
                        onClick={() => setShowResetConfirm(true)}
                      >
                        <Rewind className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset Cards</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        disabled={isQuizMode}
                        className="flex my-14 items-center gap-2 py-2 hover:text-blue-400 hover:bg-blue-950/30 rounded-md text-gray-400 transition-colors"
                        onClick={handleRestart}
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Restart Card</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className="text-gray-400 hover:text-white"
                      >
                        {isFullScreen ? (
                          <Minimize className="scale-78" />
                        ) : (
                          <Maximize className="scale-78" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isFullScreen ? "Exit Fullscreen" : "Fullscreen"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </Carousel>

            {/* Hidden input */}
            {isTypingMode && (
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="absolute opacity-0 w-0 h-0 pointer-events-none"
                autoFocus
                aria-hidden="true"
              />
            )}
          </div>

          {!isFullScreen && (
            <div className="flex flex-col gap-5">
              <h1 className="text-lg font-semibold text-center mb-3">
                All Terms
              </h1>
              <div className="flex items-center justify-around gap-9">
                <h1>Question</h1>
                <h1>Answer</h1>
              </div>
              {flashcard?.terms?.map((card: any, index: number) => (
                <div
                  key={card.id}
                  className="flex flex-col relative bg-gray-900/30"
                >
                  <div className="flex items-center justify-around gap-3 sm:gap-5">
                    <div className="bg-gray-900 rounded-sm w-full h-full p-2 sm:p-4 min-h-30 md:min-h-40">
                      {card.question}
                    </div>

                    <div className="bg-gray-900 rounded-sm w-full h-full p-2 sm:p-4 min-h-30 md:min-h-40">
                      {card.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <SkeletonFlashcard />
        </div>
      )}
    </div>
  );
};

export default FlashcardPageClient;
