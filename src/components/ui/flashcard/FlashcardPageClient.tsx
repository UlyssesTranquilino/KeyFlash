"use client";

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
import { spaceMono } from "@/app/ui/fonts";
import { Virtuoso } from "react-virtuoso";
import { CheckCircle, Eye, EyeClosed, Trash, CircleX } from "lucide-react";
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
// import { useWpm } from "@/app/context/WpmContext";

import SkeletonFlashcard from "./SkeletonFlashcard";
import { SimpleResults } from "./ResultsComponent";
import { deleteFlashcard } from "../../../../utils/flashcard/flashcard";
import { FlashcardControls } from "./FlashcardControl";
import { useFlashcardState } from "../../../../utils/flashcard/seFlashcardState";
import { useFlashcardSettings } from "../../../../utils/flashcard/useFlashcardSettings";
import { FlashcardHeader } from "./FlashcardHeader";

// Utility functions for localStorage
const loadSettings = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("flashcardSettings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

const saveSettings = (settings: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("flashcardSettings", JSON.stringify(settings));
  }
};

const FlashcardPageClient = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const { user } = useAuth();
  // const { showWpm, setShowWpm } = useWpm();
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

  const {
    isTypingMode,
    setIsTypingMode,
    isQuizMode,
    setIsQuizMode,
    blurAnswer,
    setBlurAnswer,
  } = useFlashcardSettings();

  const {
    currentPhase,
    setCurrentPhase,
    questionCompleted,
    setQuestionCompleted,
    cardCompleted,
    setCardCompleted,
    showAnswer,
    setShowAnswer,
    userInput,
    setUserInput,
    userAnswer,
    setUserAnswer,
    currentIndex,
    setCurrentIndex,
    correctCount,
    setCorrectCount,
    wrongCount,
    setWrongCount,
    allComplete,
    setAllComplete,
    isShuffled,
    setIsShuffled,
    resetCurrentCard,
  } = useFlashcardState(flashcard.terms);

  const [isQuizModeConfirm, setIsQuizModeConfirm] = useState(false);
  const { openEditFlashcard, setOpenEditFlashcard } = useFlashcard();

  const [isFocused, setIsFocused] = useState(true);
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
  const [current, setCurrent] = useState(0);
  const [currentTerm, setCurrentTerm] = useState<any>();
  const currentText =
    currentPhase === "question" ? currentTerm?.question : currentTerm?.answer;
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  // const [wpm, setWpm] = useState(0);

  // Edit
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const [answerTimeout, setAnswerTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  useEffect(() => {
    const timeoutRef = answerTimeout;
    return () => {
      if (timeoutRef) clearTimeout(timeoutRef);
    };
  }, [answerTimeout]);

  // Handle space press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        isTypingMode &&
        currentPhase === "answer" &&
        cardCompleted &&
        e.key === " "
      ) {
        e.preventDefault();

        if (answerTimeout) {
          clearTimeout(answerTimeout);
          setAnswerTimeout(null);
        }

        if (current < flashcard.terms.length - 1) {
          api?.scrollNext();
        } else {
          setAllComplete(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (answerTimeout) {
        clearTimeout(answerTimeout);
      }
    };
  }, [
    isTypingMode,
    currentPhase,
    cardCompleted,
    current,
    api,
    flashcard.terms.length,
    answerTimeout,
  ]);

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
        router.push("/dashboard");
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
      }, 5000);
    }
  };

  const handleTextClick = useCallback(() => {
    setIsClickingOnText(true);
    inputRef.current?.focus();
    setTimeout(() => setIsClickingOnText(false), 100);
  }, []);

  // Fixed highlighted text function
  // Optimize highlightedText calculation
  const highlightedText = useMemo(() => {
    if (!currentText || !isTypingMode) return null;

    // Simple optimization - return plain text if not in typing mode
    if (!isTypingMode) {
      return <span className="text-white">{currentText}</span>;
    }

    // Use simpler DOM structure
    return (
      <span className="whitespace-pre-wrap">
        {currentText.split("").map((char, index) => {
          const isTyped = index < userInput.length;
          const isCorrect = isTyped ? userInput[index] === char : false;
          const isCursor = index === userInput.length;

          return (
            <span
              key={index}
              className={cn(
                isTyped
                  ? isCorrect
                    ? "text-white"
                    : "text-red-600 bg-red-900/30"
                  : "text-gray-500",
                "relative",
              )}
            >
              {char}
              {isCursor && (
                <span className="absolute left-0 top-0.5 h-5 w-0.5 bg-blue-400 animate-pulse" />
              )}
            </span>
          );
        })}
      </span>
    );
  }, [currentText, userInput, isTypingMode]);

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
  // const updateWpm = useCallback((inputLength: number, start: number) => {
  //   const timeElapsed = (Date.now() - start) / 60000;
  //   const words = inputLength > 0 ? Math.max(1, inputLength / 5) : 0;
  //   setWpm(Math.round(words / timeElapsed));
  // }, []);

  // Input change handler
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const currentTime = Date.now();

      setIsIdle(false);

      if (!startTime) {
        setStartTime(currentTime);
      }

      setUserInput(value);
      setCurrentIndex(value.length);

      // if (startTime && value.length > 0) {
      //   updateWpm(value.length, startTime);
      // }

      if (
        (currentText && value === currentText) ||
        value.length >= currentText.length
      ) {
        if (currentPhase === "question") {
          setQuestionCompleted(true);
          setTimeout(() => {
            setCurrentPhase("answer");
            setUserInput("");
            setCurrentIndex(0);
            setStartTime(null);
            // setWpm(0);
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 500);
        } else {
          setCorrect(true);
          setCardCompleted(true);
          setCorrectCount((prev) => prev + 1);

          // Clear existing timeout
          if (answerTimeout) {
            clearTimeout(answerTimeout);
          }

          // Set new timeout
          const timeout = setTimeout(() => {
            if (current < flashcard.terms.length - 1) {
              api?.scrollNext();
            } else {
              setAllComplete(true);
            }
          }, 5000); // 10 seconds

          setAnswerTimeout(timeout);
        }
      }
    },
    [
      currentText,
      currentPhase,
      startTime,
      // updateWpm,
      current,
      api,
      flashcard.terms.length,
      answerTimeout,
    ],
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
    [deletePreviousWord],
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

  const handleEditFlashcard = async (e: any) => {
    const hasEmptyFields = copyFlashcardData.terms.some(
      (card: any) => !card.question?.trim() || !card.answer?.trim(),
    );

    if (hasEmptyFields || !copyFlashcardData.title) {
      toast.warning(
        "Please make sure all flashcards have both a question and an answer.",
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
        // router.refresh();
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

  // Handle Flip Card
  const handleFlipCard = useCallback(() => {
    if (!isTypingMode) {
      const newPhase = currentPhase === "question" ? "answer" : "question";
      setCurrentPhase(newPhase);

      // Auto-focus after flip animation
      setTimeout(() => {
        if (newPhase === "question") {
          inputRef.current?.focus();
        } else if (blurAnswer) {
          answerInputRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      }, 300); // Match this with flip animation duration
    }
  }, [isTypingMode, currentPhase, blurAnswer]);

  // Flip card on space key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle space key when not in typing mode
      if (!isTypingMode && e.key === " ") {
        e.preventDefault(); // Prevent default spacebar behavior (scrolling)
        setCurrentPhase((prev) =>
          prev === "question" ? "answer" : "question",
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTypingMode]); // Only re-run when isTypingMode changes

  // Auto focus on input field
  useEffect(() => {
    if (isTypingMode) {
      if (currentPhase === "question") {
        inputRef.current?.focus();
      } else if (currentPhase === "answer" && !blurAnswer) {
        inputRef.current?.focus();
      } else if (currentPhase === "answer" && blurAnswer) {
        answerInputRef.current?.focus();
      }
    }
  }, [currentPhase, isTypingMode, blurAnswer]);

  // Save settings whenever they change
  useEffect(() => {
    saveSettings({
      isTypingMode,
      // showWpm,
      isQuizMode,
    });
  }, [isTypingMode, isQuizMode]); //showWpm,

  // If useWpm doesn't handle its own persistence, you might need this:
  // useEffect(() => {
  //   saveSettings({
  //     isTypingMode,
  //     // showWpm,
  //     isQuizMode,
  //   });
  // }, [showWpm]);

  // Load settings
  useEffect(() => {
    const saved = localStorage.getItem("flashcardSettings");
    if (saved) {
      const { isTypingMode, showWpm, isQuizMode } = JSON.parse(saved);
      setIsTypingMode(isTypingMode);
      // setShowWpm(showWpm);
      setIsQuizMode(isQuizMode);
    }
  }, []);

  return (
    <div
      className={`max-w-[1100px] pt-3 w-full mx-auto px-1 sm:px-5 md:px-5 mb-20 relative overflow-hidden `}
    >
      <div className="-z-3 absolute top-0 md:top-20 md:right-20 right-0 w-[400px] h-[400px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

      <div className="-z-3 absolute bottom-0 -left-[500px] w-[400px] h-[400px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

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
          <FlashcardHeader
            title={title}
            description={description}
            onEdit={() => setOpenEditFlashcard(true)}
            onDelete={() => setOpenConfirmDelete(true)}
          />

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
                    // setWpm(0);
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

              <div className=" px-2 flex flex-col gap-5 overflow-scroll  ">
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

          <div className={`h-[100vh] pt-3`}>
            <div className="mb-6  flex items-center justify-between max-w-[1000px] mx-auto">
              {/* {showWpm ? (
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
              )} */}
            </div>

            <Carousel
              setApi={setApi}
              className="mx-auto relative max-w-[1000px] "
              opts={{
                watchDrag: !isQuizMode, // Disable swipe in quiz mode
                dragFree: isQuizMode, // Makes it harder to accidentally swipe
                skipSnaps: isQuizMode, // Prevents partial swipes from changing cards
              }}
            >
              <CarouselContent
                className={` w-full mx-auto gap-x-6 ${spaceMono.className} `}
              >
                {flashcard?.terms.map((item: any, index: any) => (
                  <CarouselItem
                    key={index}
                    className={`max-w-[1100px] rounded-2xl bg-gray-900/70 relative overflow-hidden 
                     h-100 md:h-110`}
                  >
                    <div
                      className="flex flex-col items-center justify-center h-full p-2 md:p-4"
                      onClick={
                        () => handleFlipCard() // Flip card on click
                      }
                      style={{ perspective: "1000px" }}
                      tabIndex={0}
                    >
                      <motion.div
                        className="w-full h-full relative"
                        animate={{
                          rotateY: currentPhase === "question" ? 0 : 180,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                        style={{
                          transformStyle: "preserve-3d",
                        }}
                      >
                        {/* Front of the card (question) */}
                        <motion.div
                          className="absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden"
                          style={{
                            backfaceVisibility: "hidden",
                            display:
                              currentPhase === "question" ? "flex" : "none",
                          }}
                        >
                          <div className="absolute top-6 right-0 w-full items-center flex justify-between px-3">
                            <div className="flex items-center gap-3">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentPhase("question");
                                }}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentPhase("answer");
                                }}
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
                            {isTypingMode && (
                              <div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setBlurAnswer(!blurAnswer);
                                      }}
                                      className={cn(
                                        "flex items-center gap-2 text-[0.9rem] transition px-3 lg:px-2",
                                        blurAnswer
                                          ? "text-blue-400"
                                          : "text-gray-400 hover:text-white",
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
                                      {!blurAnswer
                                        ? "Hide Answer"
                                        : "Show Answer"}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            )}
                          </div>

                          <h2 className="text-sm md:text-base text-center text-gray-400 mb-4 mt-10">
                            {isTypingMode ? "Type the question:" : "Question:"}
                          </h2>

                          <div
                            ref={textContainerRef}
                            className="text-center flex items-center justify-center w-full max-w-[600px]"
                          >
                            <motion.div
                              key={`${index}-question`}
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
                                  {currentTerm?.question}
                                </p>
                              )}
                            </motion.div>
                          </div>
                        </motion.div>

                        {/* Back of the card (answer) */}
                        <motion.div
                          className="absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden"
                          style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                            display:
                              currentPhase === "answer" ? "flex" : "none",
                          }}
                        >
                          <div className="absolute top-3 right-0 w-full items-center flex justify-between px-3">
                            <div className="flex items-center gap-3">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentPhase("question");
                                }}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentPhase("answer");
                                }}
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

                            {/* Move the space prompt outside and make it more prominent */}
                            {cardCompleted && currentPhase === "answer" && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full  text-center"
                              >
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 rounded-full">
                                  <span className="text-gray-300 text-sm">
                                    Press{" "}
                                    <kbd className="px-2 py-1 text-xs font-mono bg-gray-700 rounded-md text-gray-200">
                                      SPACE
                                    </kbd>
                                    to continue
                                  </span>
                                </div>
                              </motion.div>
                            )}

                            {isTypingMode && (
                              <div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setBlurAnswer(!blurAnswer);
                                      }}
                                      className={cn(
                                        "flex items-center gap-2 text-[0.9rem] transition px-3 lg:px-2",
                                        blurAnswer
                                          ? "text-blue-400"
                                          : "text-gray-400 hover:text-white",
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
                                      {!blurAnswer
                                        ? "Hide Answer"
                                        : "Show Answer"}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            )}
                          </div>

                          <h2 className="text-sm md:text-base text-gray-400 mb-4 mt-10">
                            {isTypingMode
                              ? blurAnswer
                                ? "Type your answer and press Enter:"
                                : "Type the answer:"
                              : "Answer:"}
                          </h2>

                          <div
                            ref={textContainerRef}
                            className="text-center flex items-center justify-center w-full max-w-[600px]"
                          >
                            {blurAnswer && !showAnswer && isTypingMode ? (
                              <div className="w-full">
                                <input
                                  value={userAnswer}
                                  ref={answerInputRef}
                                  type="text"
                                  className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                                  placeholder="Type your answer here..."
                                  onKeyDown={handleAnswerSubmit}
                                  onChange={(e) =>
                                    setUserAnswer(e.target.value)
                                  }
                                  autoFocus
                                />
                              </div>
                            ) : (
                              <motion.div
                                key={`${index}-answer`}
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
                                    {currentTerm?.answer}
                                  </p>
                                )}
                              </motion.div>
                            )}
                          </div>

                          {blurAnswer && showAnswer && (
                            <div className="mt-4 p-4 bg-gray-800 rounded-md w-full">
                              <p className="text-gray-400 mb-2">
                                Correct answer:
                              </p>
                              <p className="text-white text-xl">
                                {currentTerm?.answer}
                              </p>
                            </div>
                          )}

                          {cardCompleted && correct && (
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="text-green-400 text-center mt-6"
                            >
                              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                              <span className="text-sm">
                                {blurAnswer
                                  ? "Correct Answer!"
                                  : "Card completed!"}
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
                        </motion.div>
                      </motion.div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <FlashcardControls
                isQuizMode={isQuizMode}
                isTypingMode={isTypingMode}
                isShuffled={isShuffled}
                correctCount={correctCount}
                wrongCount={wrongCount}
                current={current}
                count={count}
                onQuizModeChange={(value) => {
                  if (!value) {
                    setIsQuizModeConfirm(true);
                  } else {
                    setIsQuizMode(true);
                    setIsTypingMode(true);
                  }
                }}
                onTypingModeChange={setIsTypingMode}
                onShuffle={shuffleFlashcards}
                onUnshuffle={unshuffleFlashcards}
                onReset={() => setShowResetConfirm(true)}
                onRestart={handleRestart}
              />
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

          <div className="flex flex-col gap-5">
            <h1 className="text-lg font-semibold text-center mb-3">
              All Terms
            </h1>
            <div className="flex items-center justify-around gap-9">
              <h1>Question</h1>
              <h1>Answer</h1>
            </div>
            <Virtuoso
              style={{ height: "500px" }}
              totalCount={flashcard?.terms?.length || 0}
              itemContent={(index) => {
                const card = flashcard?.terms[index];
                return (
                  <div
                    key={card.id}
                    className="flex flex-col relative bg-gray-900/30 mb-3"
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
                );
              }}
            />
          </div>
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
