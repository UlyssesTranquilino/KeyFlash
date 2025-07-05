"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Link from "next/link";
import {
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
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type CarouselApi } from "@/components/ui/carousel";
import { useWpm } from "@/app/context/WpmContext";
import { useFlashcard } from "@/app/context/FlashcardContext";

const TypingFlashcards = () => {
  const { showWpm } = useWpm();
  const { blurAnswer, setBlurAnswer, openEditFlashcard, setOpenEditFlashcard } =
    useFlashcard();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isTestMode, setIsTestMode] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [allComplete, setAllComplete] = useState(false);

  const [sampleTerms, setSampleTerms] = useState([
    {
      id: 1,
      question: "What is the capital of France?",
      answer: "Paris",
    },
    {
      id: 2,
      question: "What is the largest planet in our solar system?",
      answer: "Jupiter",
    },
    {
      id: 3,
      question: "What language is primarily spoken in Brazil?",
      answer: "Portuguese",
    },
  ]);

  // Active Tab
  const [activeTab, setActiveTab] = useState("write");

  // Typing states
  const [userInput, setUserInput] = useState("");
  const [isFocused, setIsFocused] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isIdle, setIsIdle] = useState(true);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [isClickingOnText, setIsClickingOnText] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<"question" | "answer">(
    "question"
  );
  const [questionCompleted, setQuestionCompleted] = useState(false);
  const [cardCompleted, setCardCompleted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [copyFlashcardData, setCopyFlashcardData] = useState<any>(sampleTerms);
  const [showAnswer, setShowAnswer] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const answerInputRef = useRef<HTMLInputElement>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Stat
  const [correct, setCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState("");
  const currentTerm = sampleTerms[current];
  const currentText =
    currentPhase === "question" ? currentTerm?.question : currentTerm?.answer;

  useEffect(() => {
    setOpenEditFlashcard(true);
  }, []);

  // Auto-focus when not focused
  useEffect(() => {
    if (!isFocused && !cardCompleted) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isFocused, cardCompleted]);

  // Caps Lock detection
  useEffect(() => {
    const handleKeyEvent = (event: KeyboardEvent) => {
      if (event.getModifierState) {
        setIsCapsLockOn(event.getModifierState("CapsLock"));
      }
    };

    window.addEventListener("keydown", handleKeyEvent);
    window.addEventListener("keyup", handleKeyEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyEvent);
      window.removeEventListener("keyup", handleKeyEvent);
    };
  }, []);

  // Idle detection
  useEffect(() => {
    const handleActivity = () => {
      setIsIdle(false);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => setIsIdle(true), 1000);
    };

    return () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, []);

  // Check if edit dialog is open
  useEffect(() => {
    setCopyFlashcardData(sampleTerms);
  }, [openEditFlashcard]);

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

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      const newIndex = api.selectedScrollSnap();

      // Always reset input when moving to a new card
      if (newIndex !== current) {
        resetCurrentCard();
        setBlurAnswer(true);
        setCurrent(newIndex);
      }

      // In test mode, prevent navigation unless card is completed
      if (isTestMode && newIndex !== current && !cardCompleted) {
        api.scrollTo(current);
        toast.info("Complete this card before moving on", {
          position: "top-center",
          duration: 1000,
        });
      }
    });
  }, [api, resetCurrentCard, isTestMode, current, cardCompleted]);

  // WPM calculation
  const updateWpm = useCallback((inputLength: number, start: number) => {
    const timeElapsed = (Date.now() - start) / 60000;
    const words = inputLength > 0 ? Math.max(1, inputLength / 5) : 0;
    setWpm(Math.round(words / timeElapsed));
  }, []);

  // Fixed highlighted text function
  const highlightedText = useMemo(() => {
    if (!currentText) return null;

    return currentText.split("").map((char, index) => {
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

          // Only allow navigation in test mode if card is completed
          setTimeout(() => {
            if (current < sampleTerms.length - 1) {
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
      sampleTerms.length,
    ]
  );

  // Handle answer submission in blur mode
  const handleAnswerSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCardCompleted(true);

      if (userAnswer === currentTerm.answer) {
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
        if (current < sampleTerms.length - 1) {
          api?.scrollNext();
          setUserInput("");
        } else {
          setAllComplete(true);
        }
      }, 1500);
    }

    console.log(answerInputRef);
  };

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

  const handleTextClick = useCallback(() => {
    setIsClickingOnText(true);
    inputRef.current?.focus();
    setTimeout(() => setIsClickingOnText(false), 100);
  }, []);

  const handleInputBlur = useCallback(() => {
    if (!isClickingOnText) {
      setIsFocused(false);
    }
  }, [isClickingOnText]);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
    setIsClickingOnText(false);
  }, []);

  const handleRestart = useCallback(() => {
    resetCurrentCard();
  }, [resetCurrentCard]);

  const handleReset = useCallback(() => {
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
  }, [api, setBlurAnswer]);

  const [isFlipped, setIsFlipped] = useState(false);

  const handleSubmit = () => {
    const hasEmptyFields = copyFlashcardData.some(
      (card: any) => !card.question?.trim() || !card.answer?.trim()
    );

    if (hasEmptyFields) {
      toast.warning(
        "Please make sure all flashcards have both a question and an answer."
      );
      return;
    }

    setSampleTerms(copyFlashcardData);
    setOpenEditFlashcard(false);
  };

  const handleDelete = (id: string) => {
    if (!copyFlashcardData || copyFlashcardData.length <= 0) return;

    setCopyFlashcardData((prev: any) =>
      prev ? prev.filter((card: any) => card.id !== id) : []
    );
  };

  return (
    <div className="max-w-4xl mx-auto sm:p-4">
      <Toaster position="top-center" />
      {/* Custom Settings */}

      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg">Confirm Reset</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset all progress and start from the
              beginning?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowResetConfirm(false)}
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

                setShowResetConfirm(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={allComplete} onOpenChange={setAllComplete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <DialogTitle className="text-2xl text-center">
                All Flashcards Completed!
              </DialogTitle>
              <DialogDescription className="text-center mt-2">
                Great job! You've finished all {sampleTerms.length} flashcards.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Stats Section */}
            <div className="bg-gray-900/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-center mb-4">
                Your Results
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-green-500 text-3xl font-bold">
                    {correctCount}
                  </div>
                  <div className="text-gray-400 text-sm">Correct Answers</div>
                </div>
                <div className="text-center">
                  <div className="text-red-500 text-3xl font-bold">
                    {wrongCount}
                  </div>
                  <div className="text-gray-400 text-sm">Wrong Answers</div>
                </div>
              </div>

              {/* <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Accuracy</span>
                  <span className="font-medium">
                    {Math.round(
                      (correctCount / (correctCount + wrongCount)) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${Math.round(
                        (correctCount / (correctCount + wrongCount)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div> */}
            </div>

            {/* Actions Section */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  api?.scrollTo(0);
                  resetCurrentCard();
                  setAllComplete(false);
                }}
                className="flex-1 bg-blue-950/30 hover:bg-blue-950 text-white border-0"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Practice Again
              </Button>

              <Button
                onClick={() => setOpenEditFlashcard(true)}
                variant="ghost"
                className="flex-1 text-gray-400 hover:text-white"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Cards
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div>
        <Dialog open={openEditFlashcard} onOpenChange={setOpenEditFlashcard}>
          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="!max-w-[750px] w-full "
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-center">
                Edit Flashcard
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-400">
                <div className="px-4 py-2 mb-4">
                  You're not logged in. You can add up to 10 cards.{" "}
                  <Link
                    href="/signin"
                    className="font-semibold text-blue-400 hover:underline"
                  >
                    Sign in
                  </Link>{" "}
                  to save and add more.
                </div>
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-2 "
            >
              <TabsList className="grid w-full grid-cols-2 bg-blue-950/30">
                <TabsTrigger
                  value="write"
                  className={cn(
                    "flex items-center gap-2 bg-blue-950/30 ",
                    activeTab === "write" && "text-blue-400"
                  )}
                >
                  <Type className="h-4 w-4" /> Write
                </TabsTrigger>
                <TabsTrigger
                  value="upload"
                  className={cn(
                    "flex items-center gap-2",
                    activeTab === "upload" && "text-blue-400"
                  )}
                  disabled
                >
                  <FileUp className="h-4 w-4" /> Upload (Coming Soon)
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="write"
                className="mt-4 flex flex-col gap-5 overflow-scroll max-h-100"
              >
                <div className="flex items-center justify-around gap-9 ">
                  <h1>Question</h1>
                  <h1>Answer</h1>
                </div>
                {copyFlashcardData?.map((card: any, index: number) => (
                  <div
                    key={card.id}
                    className="flex flex-col relative bg-gray-900/30"
                  >
                    {copyFlashcardData.length > 1 && (
                      <button
                        onClick={() => handleDelete(card.id)}
                        className="absolute  hover:text-red-400 text-gray-500 self-end p-1"
                      >
                        <Trash className="scale-70" />
                      </button>
                    )}
                    <div className="flex items-center justify-around gap-5 ">
                      <div className="bg-gray-900 rounded-sm w-full h-full p-4 min-h-30 md:min-h-40">
                        <textarea
                          value={card.question}
                          onInput={(e) => {
                            e.currentTarget.style.height = "auto";
                            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                          }}
                          onChange={(e) => {
                            setCopyFlashcardData((prev: any) => {
                              return prev.map((item: object, idx: number) => {
                                if (idx === index) {
                                  return { ...item, question: e.target.value };
                                } else {
                                  return item;
                                }
                              });
                            });
                          }}
                          className="h-full w-full bg-gray-900 resize-none overflow-hidden rounded-sm p-2 focus:outline-0"
                        />
                      </div>

                      <div className="bg-gray-900 rounded-sm w-full h-full p-4 min-h-30 md:min-h-40">
                        <textarea
                          value={card.answer}
                          onInput={(e) => {
                            e.currentTarget.style.height = "auto";
                            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                          }}
                          onChange={(e) => {
                            setCopyFlashcardData((prev: any) => {
                              return prev.map((item: object, idx: number) => {
                                if (idx === index) {
                                  return { ...item, answer: e.target.value };
                                } else {
                                  return item;
                                }
                              });
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
                    const MAX_CARDS_GUEST = 10;
                    const isLoggedIn = false;
                    const isGuest = !isLoggedIn;

                    if (
                      isGuest &&
                      copyFlashcardData.length >= MAX_CARDS_GUEST
                    ) {
                      toast.warning("Sign in to add more than 20 cards.");
                      return;
                    }

                    setCopyFlashcardData((prev: any) => [
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
                  <span className="text-gray-300">
                    ({10 - copyFlashcardData.length} remaining)
                  </span>
                </Button>
              </TabsContent>

              <TabsContent value="upload" className="mt-4">
                <div className="border-2 border-dashed border-blue-300/60 rounded-lg p-3 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileUp className="h-8 w-8 text-gray-400" />
                    <p className="text-sm font-medium">Upload a text file</p>
                    <p className="text-xs text-gray-500">Supports .txt files</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

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
                onClick={handleSubmit}
                className="text-blue-400 bg-blue-950/30 hover:bg-blue-950/70"
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
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
        className="max-w-[800px] mx-auto relative"
        opts={{
          watchDrag: !isTestMode, // Disable swipe in test mode
          dragFree: isTestMode, // Makes it harder to accidentally swipe
          skipSnaps: isTestMode, // Prevents partial swipes from changing cards
        }}
      >
        <CarouselContent className="max-w-[900px] w-full mx-auto gap-x-6">
          {sampleTerms.map((item, index) => (
            <CarouselItem
              key={index}
              className="h-96 rounded-2xl bg-gray-900/70 relative overflow-hidden"
            >
              <div className="flex flex-col items-center  h-full p-8">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setBlurAnswer(!blurAnswer)}
                      className={cn(
                        "absolute right-2 top-4 flex items-center gap-2 text-[0.9rem] transition px-3 lg:px-2",
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
                    <p>{!blurAnswer ? "Hide Answer" : "Show Answer"}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Phase indicator */}
                <div className="mb-6 mt-8  flex items-center gap-4">
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
                    {questionCompleted && <CheckCircle className="w-4 h-4" />}
                    <span>Question</span>
                  </div>
                  <div
                    className={`w-8 h-0.5 ${
                      questionCompleted ? "bg-green-400" : "bg-gray-600"
                    }`}
                  />
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
                    {cardCompleted && <CheckCircle className="w-4 h-4" />}
                    <span>Answer</span>
                  </div>
                </div>

                {/* Current phase label */}
                <h2 className="text-sm md:text-base text-gray-400 mb-4 mt-10 ">
                  {currentPhase === "question"
                    ? "Type the question:"
                    : blurAnswer
                    ? "Type your answer and press Enter:"
                    : "Type the answer:"}
                </h2>

                {/* Text to type */}
                <div
                  ref={textContainerRef}
                  className=" text-center  flex items-center justify-center w-full max-w-[600px]"
                >
                  {currentPhase === "answer" && blurAnswer && !showAnswer ? (
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
                      <div className="flex flex-wrap justify-center text-center mx-auto  ">
                        {highlightedText}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Show correct answer if blurAnswer is on and user pressed Enter */}
                {currentPhase === "answer" && blurAnswer && showAnswer && (
                  <div className="mt-4 p-4 bg-gray-800 rounded-md w-full">
                    <p className="text-gray-400 mb-2">Correct answer:</p>
                    <p className="text-white text-xl">{currentTerm?.answer}</p>
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
                    className=" text-center mt-6"
                  >
                    <CircleX className=" text-red-400 w-8 h-8 mx-auto mb-2" />
                    <span className=" text-red-400 text-sm">Wrong Answer!</span>
                    <div className="mt-1">
                      Correct Answer: {currentTerm.answer}
                    </div>
                  </motion.div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className=" w-full absolute right-1/2  -bottom-30 grid grid-cols-5 items-center translate-x-1/2">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 ">
            <div className="flex gap-1 items-center  ">
              {/* <Switch
                id="code-toggle"
                checked={isTestMode}
                onCheckedChange={setIsTestMode}
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
                Test
              </Label> */}
            </div>
          </div>

          <div className="w-full  col-span-3 relative">
            <div className="text-center w-30 sm:w-34 mx-auto  relative ">
              <CarouselPrevious
                disabled={isTestMode}
                className="flex  absolute left-0  top-1/2 -translate-y-1/2 z-10"
              />
              <div className="text-gray-400">
                {current + 1} / {count}
              </div>

              <CarouselNext
                disabled={isTestMode}
                className="flex absolute right-0 top-1/2 -translate-y-1/2 z-10"
              />
            </div>
            {isTestMode && (
              <div className="flex items-center justify-center text-sm gap-3 absolute -translate-x-1/67  p-4 w-full">
                <div className="flex gap-1  ">
                  <Check className="h-5 w-5 text-green-400 " />

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
                  disabled={isTestMode}
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
                  disabled={isTestMode}
                  className="flex my-14 items-center gap-2  py-2 hover:text-blue-400 hover:bg-blue-950/30 rounded-md text-gray-400 transition-colors"
                  onClick={handleRestart}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Restart Card</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </Carousel>
      {/* Hidden input */}
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
    </div>
  );
};

export default TypingFlashcards;
