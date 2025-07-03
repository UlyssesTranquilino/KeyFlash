"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

  const [sampleTerms, setSampleTerms] = useState([
    {
      question: "What is the capital of France?",
      answer: "Paris",
    },
    {
      question: "What is the largest planet in our solar system?",
      answer: "Jupiter",
    },
    {
      question: "What language is primarily spoken in Brazil?",
      answer: "Portuguese",
    },
    {
      question: "What is 9 x 6?",
      answer: "54",
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      answer: "William Shakespeare",
    },
  ]);

  // Active Tab
  const [activeTab, setActiveTab] = useState("text");

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

  const inputRef = useRef<HTMLInputElement>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const currentTerm = sampleTerms[current];
  const currentText =
    currentPhase === "question" ? currentTerm?.question : currentTerm?.answer;

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

  const resetCurrentCard = useCallback(() => {
    setUserInput("");
    setCurrentIndex(0);
    setCurrentPhase("question");
    setQuestionCompleted(false);
    setCardCompleted(false);
    setStartTime(null);
    setWpm(0);
    setBlurAnswer(true); // <-- Add this to hide answer again
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Carousel setup
  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      resetCurrentCard();
      setBlurAnswer(blurAnswer);
    });
  }, [api, resetCurrentCard]);

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
      if (currentText && value === currentText) {
        if (currentPhase === "question") {
          setQuestionCompleted(true);
          setTimeout(() => {
            setCurrentPhase("answer");
            setUserInput("");
            setCurrentIndex(0);
          }, 500);
        } else {
          setCardCompleted(true);
          setTimeout(() => {
            if (current < sampleTerms.length - 1) {
              api?.scrollNext();
            } else {
              // Last card completed
              console.log("All cards completed!");
            }
          }, 1000);
        }
      }
    },
    [currentText, currentPhase, startTime, updateWpm, current, api]
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

  useEffect(() => {
    if (currentPhase === "answer" && userInput === currentText) {
      setBlurAnswer(false); // Unblur when answer is correctly typed
    }
  }, [userInput, currentText, currentPhase]);

  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="max-w-4xl mx-auto sm:p-4">
      {/* Custom Settings */}
      <div>
        <Dialog open={openEditFlashcard} onOpenChange={setOpenEditFlashcard}>
          {/* <DialogTrigger> */}
          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="!max-w-[750px] w-full "
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Edit Flashcard
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Choose how you want to add text - write directly or upload a
                file
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-4 "
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
                >
                  <FileUp className="h-4 w-4" /> Upload (Coming Soon)
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="write"
                className="mt-4 flex flex-col gap-5 overflow-scroll max-h-100"
              >
                <div className="flex items-center justify-around gap-9">
                  <h1>Question</h1>
                  <h1>Answer</h1>
                </div>
                {sampleTerms.map((card: any, index) => (
                  <div
                    key={card.question + index.toString()}
                    className="flex items-center justify-around gap-5 "
                  >
                    <div className="bg-gray-900 rounded-sm w-full h-full p-4 min-h-30 md:min-h-40">
                      {" "}
                      <textarea
                        value={card.question}
                        onInput={(e) => {
                          e.currentTarget.style.height = "auto";
                          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                        }}
                        onChange={(e) => {
                          setSampleTerms((prev: any) => {
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
                          setSampleTerms((prev: any) => {
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
                ))}
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
          </DialogContent>
        </Dialog>
      </div>
      <div className="mb-6  flex items-center justify-between max-w-[800px] mx-auto">
        {/* <p className="text-sm sm:text-base text-gray-400 ">
          Type the question, then type the answer to proceed
        </p> */}

        {/* Caps Lock warning */}

        {showWpm && (
          <div className="mt-2 text-blue-400 font-mono w-full text-right">
            {wpm} WPM
          </div>
        )}
      </div>

      <Carousel setApi={setApi} className="max-w-[800px] mx-auto relative">
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
                    <p>{blurAnswer ? "Hide Answer" : "Show Answer"}</p>
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
                    : "Type the answer:"}
                </h2>

                {/* Text to type */}
                <div
                  ref={textContainerRef}
                  className=" text-center  flex items-center justify-center w-full max-w-[600px]"
                >
                  <motion.div
                    key={`${index}-${currentPhase}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`text-xl md:text-2xl text-center font-mono leading-relaxed mb-8 sm:px-4 cursor-text whitespace-pre transition-all duration-300 ${
                      currentPhase === "answer" &&
                      blurAnswer &&
                      userInput !== currentText
                        ? "filter blur-md"
                        : ""
                    }`}
                    onClick={handleTextClick}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <div className="flex flex-wrap justify-center text-center mx-auto">
                      {highlightedText}
                    </div>
                  </motion.div>
                </div>

                {/* Card completion indicator */}
                {cardCompleted && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-green-400 text-center"
                  >
                    <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm">Card completed!</span>
                  </motion.div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 z-10" />
      </Carousel>

      {/* Progress and controls */}
      <div className="flex flex-col items-center justify-between mt-6">
        <div className="text-gray-400">
          {current + 1} / {count}
        </div>

        <button
          className="flex mt-20 items-center gap-2 px-4 py-2 hover:text-blue-400 hover:bg-blue-950/30 rounded-md text-gray-400 transition-colors"
          onClick={handleRestart}
        >
          <RotateCcw className="w-4 h-4" />
          Restart Card
        </button>
      </div>

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
