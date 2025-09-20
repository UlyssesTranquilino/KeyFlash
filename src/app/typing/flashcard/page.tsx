"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Link from "next/link";
import { spaceMono } from "@/app/ui/fonts";

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
  Keyboard,
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
import { useAuth } from "@/app/context/AuthContext";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";

const TypingFlashcards = () => {
  const { user } = useAuth();
  const router = useRouter();
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
  const [isDragging, setIsDragging] = useState(false);

  const [isTypingMode, setIsTypingMode] = useState(true);

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

    const words = currentText.split(" ");
    let charIndex = 0;

    return words.map((word, wordIndex) => {
      const wordSpans = word.split("").map((char, charIndexInWord) => {
        const globalCharIndex = charIndex + charIndexInWord;
        const userChar = userInput[globalCharIndex];
        const isTyped = globalCharIndex < userInput.length;
        const isCorrect = userChar === char;
        const isCursor = globalCharIndex === userInput.length;

        const className = isTyped
          ? isCorrect
            ? "text-white"
            : "text-red-600/75 bg-red-900/30"
          : "text-gray-500";

        return (
          <span key={`${wordIndex}-${charIndexInWord}`} className="relative">
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
            <span className={className}>{char}</span>
          </span>
        );
      });

      // Handle space between words
      charIndex += word.length;
      const spaceIndex = charIndex;
      const hasSpace = wordIndex < words.length - 1;

      if (hasSpace) {
        const userSpaceChar = userInput[spaceIndex];
        const isSpaceTyped = spaceIndex < userInput.length;
        const isSpaceCorrect = userSpaceChar === " ";
        const isSpaceCursor = spaceIndex === userInput.length;

        charIndex += 1; // Account for the space

        const spaceElement = (
          <span key={`space-${wordIndex}`} className="relative">
            {isSpaceCursor && (
              <span
                className={`absolute left-0 top-1 lg:top-[9px] w-0.5 h-6 bg-blue-400 ${
                  isIdle ? "animate-pulse" : ""
                }`}
                style={{
                  animation: isIdle ? "pulse 1s ease-in-out infinite" : "none",
                }}
              />
            )}
            <span
              className={
                isSpaceTyped
                  ? isSpaceCorrect
                    ? "text-white"
                    : "text-red-600/75 bg-red-900/30"
                  : "text-gray-500"
              }
            >
              {"\u00A0"}
            </span>
          </span>
        );

        return (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {wordSpans}
            {spaceElement}
          </span>
        );
      }

      return (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {wordSpans}
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
      if (e.key === "Backspace" && (e.ctrlKey || e.metaKey)) {
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

    // Reset carousel to first card after update
    if (api) {
      setTimeout(() => {
        api.scrollTo(0);
        setCurrent(0);
      }, 0);
    }

    setOpenEditFlashcard(false);
  };

  useEffect(() => {
    if (api) {
      api.reInit();
      setCount(sampleTerms.length);
      setCurrent(api.selectedScrollSnap());
    }
  }, [sampleTerms, api]);

  const handleDelete = (id: number) => {
    if (!copyFlashcardData || copyFlashcardData.length <= 1) {
      toast.warning("You need at least one flashcard");
      return;
    }

    setCopyFlashcardData((prev: any) =>
      prev.filter((card: any) => card.id !== id)
    );
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
        setCopyFlashcardData(cards);
        toast.success(`Successfully imported ${cards.length} flashcards`);

        const encodedData = encodeURIComponent(JSON.stringify(cards));
        router.push(`/dashboard/flashcards/create?data=${encodedData}`);
      } else {
        toast.warning("No valid flashcards found in the file");
      }
    } catch (error) {
      toast.error("Error reading file");
      console.error(error);
    }
  };

  const parseFlashcardText = (text: string) => {
    const lines = text.split("\n").map((line) => line.trim());
    const flashcards = [];

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("Question:")) {
        const question = lines[i].replace("Question:", "").trim();
        const answerLine = lines[i + 1] || "";
        if (answerLine.startsWith("Answer:")) {
          const answer = answerLine.replace("Answer:", "").trim();
          flashcards.push({
            id: Date.now() + i,
            question,
            answer,
          });
        }
      }
    }

    return flashcards;
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
          prev === "question" ? "answer" : "question"
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTypingMode]); // Only re-run when isTypingMode changes

  // Auto Focus on input field
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

  return (
    <div className="max-w-4xl mx-auto  sm:p-4">
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
                className="cursor-pointer flex-1 bg-blue-950/30 hover:bg-blue-950 text-white border-0"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Practice Again
              </Button>

              <Button
                onClick={() => setOpenEditFlashcard(true)}
                variant="ghost"
                className="cursor-pointer flex-1 text-gray-400 hover:text-white"
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
                  {user ? (
                    <>
                      You're logged in — manage all your flashcards on the{" "}
                      <Link
                        href="/dashboard/flashcards"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        Flashcards Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      {" "}
                      You're not logged in. You can only add up to 10 cards.{" "}
                      <Link
                        href="/signin"
                        className="font-semibold text-blue-400 hover:underline"
                      >
                        Sign in
                      </Link>{" "}
                      to save your progress, unlock more features, and add
                      additional cards.
                    </>
                  )}
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
                    "flex items-center gap-2 ",
                    activeTab === "write" && "text-blue-400 "
                  )}
                >
                  <Type className="h-4 w-4" />{" "}
                  <span className="hidden sm:block"> Write</span>
                </TabsTrigger>
                <TabsTrigger
                  value="upload"
                  className={cn(
                    "flex items-center gap-2",
                    activeTab === "upload" && "text-blue-400"
                  )}
                >
                  <FileUp className="h-4 w-4" />{" "}
                  <span className="hidden sm:block"> Upload</span>
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
                    className="flex flex-col  relative bg-gray-900/30"
                  >
                    {copyFlashcardData.length > 1 && (
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

                      <div className="bg-gray-900 rounded-sm w-full h-full p-2 sm:p-4 min-h-30 md:min-h-40">
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
                      if (!user) {
                        toast.warning("Sign in to add more than 20 cards.");
                      } else {
                        toast.warning(
                          <>
                            <p>
                              Proceed to flashcard dashboard to add more cards.
                              <Link
                                href="/dashboard/flashcards"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                              >
                                {" "}
                                Flashcards Dashboard
                              </Link>
                            </p>
                          </>
                        );
                      }
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
                  className="h-12 border-2 border-dashed bg-gray-900/20 hover:bg-gray-800/30 text-gray-200 w-1/2 mx-auto p-3 px-1 mt-2"
                >
                  Add Card
                  <span className="text-gray-300">
                    ({10 - copyFlashcardData.length} remaining)
                  </span>
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
                    onClick={handleSubmit}
                    className="text-blue-400 bg-blue-950/30 hover:bg-blue-950/70"
                  >
                    Save
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="upload" className="mt-4 bg-gray-950/90">
                {!user && (
                  <div className="inset-0 flex items-center justify-center z-10 rounded-xl mb-4">
                    <h2 className="text-red-400">
                      Please{" "}
                      <Link
                        href="/signin"
                        className="font-semibold text-blue-400 hover:underline"
                      >
                        Sign in
                      </Link>{" "}
                      to upload a file
                    </h2>
                  </div>
                )}

                <div className="text-sm text-gray-400 mb-4">
                  <p className="text-white">File format should be:</p>
                  <div className="font-mono bg-gray-900 p-2 rounded mt-1">
                    <p>Question: ...</p>
                    <p>Answer: ...</p>
                  </div>
                  <p className="mt-2 text-white">Example:</p>
                  <div className="font-mono bg-gray-900 p-2 rounded text-left">
                    <p>Question: What is the capital of France?</p>
                    <p>Answer: Paris</p>
                    <p className="mt-2">
                      Question: Largest planet in our solar system?
                    </p>
                    <p>Answer: Jupiter</p>
                  </div>
                </div>

                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-3 text-center transition-colors",
                    isDragging
                      ? "border-blue-400 bg-blue-900/20"
                      : "border-blue-300/60",
                    !user && "opacity-50 pointer-events-none"
                  )}
                  onDragEnter={!user ? undefined : handleDragEnter}
                  onDragLeave={!user ? undefined : handleDragLeave}
                  onDragOver={!user ? undefined : handleDragOver}
                  onDrop={!user ? undefined : handleDrop}
                >
                  <div className="p-3 flex flex-col items-center justify-center gap-2">
                    <FileUp className="h-8 w-8 text-gray-400" />
                    {isDragging ? (
                      <p className="font-medium text-blue-400">
                        Drop your file here
                      </p>
                    ) : (
                      <>
                        <p className="font-medium">
                          Drag and drop your file here
                        </p>
                        <p className="text-gray-500">or</p>
                      </>
                    )}

                    <label
                      className={cn(
                        "mt-2 px-4 py-2 rounded-md cursor-pointer transition-colors",
                        user
                          ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
                          : "bg-gray-700 text-gray-500 cursor-not-allowed"
                      )}
                    >
                      Select File
                      <input
                        type="file"
                        accept=".txt"
                        className="hidden"
                        onChange={user ? handleFileUpload : undefined}
                        disabled={!user}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Supports .txt files only
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
        className={`max-w-[800px] mx-auto relative ${spaceMono.className}`}
        opts={{
          watchDrag: !isTestMode, // Disable swipe in test mode
          dragFree: isTestMode, // Makes it harder to accidentally swipe
          skipSnaps: isTestMode, // Prevents partial swipes from changing cards
        }}
      >
        <CarouselContent className="max-w-[900px] h-100 md:h-110 w-full mx-auto gap-x-6">
          {sampleTerms.map((item, index) => (
            <CarouselItem
              key={index}
              className=" md:h-110 rounded-2xl bg-gray-900/70 relative overflow-hidden"
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
                      display: currentPhase === "question" ? "flex" : "none",
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
                          {cardCompleted && <CheckCircle className="w-4 h-4" />}
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
                      display: currentPhase === "answer" ? "flex" : "none",
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
                          {cardCompleted && <CheckCircle className="w-4 h-4" />}
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
                            onChange={(e) => setUserAnswer(e.target.value)}
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
                        <p className="text-gray-400 mb-2">Correct answer:</p>
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
                  </motion.div>
                </motion.div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className=" w-full absolute right-1/2  -bottom-30 grid grid-cols-5 items-center translate-x-1/2">
          {/* Progress and controls */}
          <div className="flex col-span-1  ">
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
          </div>

          <div className="w-full flex  items-center justify-center col-span-3  relative">
            <div className=" text-center w-30 sm:w-34  relative  ">
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
          <div className="flex col-span-1  justify-end gap-5">
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
        className="absolute opacity-0 w-1 h-1 top-0 left-0"
        autoFocus
        aria-hidden="true"
      />
    </div>
  );
};

export default TypingFlashcards;
