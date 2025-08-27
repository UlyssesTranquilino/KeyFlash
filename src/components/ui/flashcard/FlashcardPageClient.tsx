"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import {
  editFlashcard,
  getFlashcard,
  getFlashcardPublic,
} from "../../../../utils/flashcard/flashcard";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { spaceMono } from "@/app/ui/fonts";
import { Virtuoso } from "react-virtuoso";
import {
  CheckCircle,
  Eye,
  EyeClosed,
  Trash,
  CircleX,
  ChevronLeft,
  SkipForward,
  ChevronRight,
} from "lucide-react";
import { distance, closest } from "fastest-levenshtein";

import { cn } from "@/lib/utils";
import { useFlashcard } from "@/app/context/FlashcardContext";
import { getUserPublicProfile } from "../../../../utils/auth/userUtils";
import SkeletonFlashcard from "./SkeletonFlashcard";
import { SimpleResults } from "./ResultsComponent";
import { deleteFlashcard } from "../../../../utils/flashcard/flashcard";
import { FlashcardControls } from "./FlashcardControl";
import { useFlashcardState } from "../../../../utils/flashcard/seFlashcardState";
import { useFlashcardSettings } from "../../../../utils/flashcard/useFlashcardSettings";
import { FlashcardHeader } from "./FlashcardHeader";
import { FlashcardItem } from "./FlashcardItem";

// Dialog
import {
  DeleteFlashcardDialog,
  QuizModeConfirmDialog,
  ResetConfirmDialog,
  EditFlashcardDialog,
  DiscardChangesDialog,
} from "./FlashcardDialogs";

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

const FlashcardPageClient = ({
  slug,
  isPublicView = false,
}: {
  slug: string;
  isPublicView?: boolean;
}) => {
  const router = useRouter();
  const { loading, user } = useAuth();
  const id = slug.split("-")[0];
  const [flashcard, setFlashcard] = useState<any>({
    title: "",
    description: "",
    terms: [],
  });

  const [copyFlashcardData, setCopyFlashcardData] = useState<any>({});
  const [loadingFetch, setLoadingFetch] = useState(true);

  // Flashcard Navigation
  const [current, setCurrent] = useState(0);
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
  const [currentTerm, setCurrentTerm] = useState<any>();
  const currentText =
    currentPhase === "question" ? currentTerm?.question : currentTerm?.answer;
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Edit
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [answerTimeout, setAnswerTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // is Exact Correct
  const [isExactCorrect, setIsExactCorrect] = useState(false);

  useEffect(() => {
    const timeoutRef = answerTimeout;
    return () => {
      if (timeoutRef) clearTimeout(timeoutRef);
    };
  }, [answerTimeout]);

  // Navigation functions
  const goToNext = useCallback(() => {
    if (current < flashcard.terms.length - 1) {
      setCurrent((prev) => prev + 1);
      resetCurrentCard();
    } else {
      setAllComplete(true);
    }
  }, [current, flashcard.terms.length, resetCurrentCard]);

  const goToPrevious = useCallback(() => {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
      resetCurrentCard();
    }
  }, [current, resetCurrentCard]);

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

        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (answerTimeout) {
        clearTimeout(answerTimeout);
      }
    };
  }, [isTypingMode, currentPhase, cardCompleted, answerTimeout, goToNext]);

  useEffect(() => {
    if (loading) return;

    const fetchFlashcard = async () => {
      setLoadingFetch(true);

      let data;
      if (isPublicView && flashcard.user_id != user?.id) {
        const res = await getFlashcardPublic(id);
        data = res.data;
      } else if (user?.id) {
        const res = await getFlashcard(user.id, id);
        data = res.data;
      }

      if (!data) {
        toast.error("Access denied or flashcard not found.");
        router.replace("/signin"); // redirect to homepage
        return;
      }

      if (data) {
        setFlashcard(data);
        setCopyFlashcardData(data);
        setTitle(data.title);
        setDescription(data.description);
        setCurrentTerm(data.terms[0]);
        setCount(data.terms.length);
      }

      setLoadingFetch(false);
    };

    fetchFlashcard();
  }, [user?.id, id, isPublicView, loading]); // ✅ only primitives

  // Update current term when current index changes
  useEffect(() => {
    if (flashcard.terms && flashcard.terms[current]) {
      setCurrentTerm(flashcard.terms[current]);
    }
  }, [current, flashcard.terms]);

  // Handle Delete Flashcard
  const handleDeleteFlashcard = async () => {
    try {
      const { error } = await deleteFlashcard(id);

      if (error) {
        toast.error("Failed to delete flashcard: " + error);
      } else {
        toast.success("Flashcard deleted successfully!");
        router.back();
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  const skipPhase = useCallback(() => {
    if (currentPhase === "question") {
      // Skip forward → show answer
      setQuestionCompleted(true);
      setCurrentPhase("answer");
      setUserInput("");
      setCurrentIndex(0);

      setTimeout(() => {
        if (blurAnswer) {
          answerInputRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      }, 100);
    } else {
      // Skip backward → return to question
      setCurrentPhase("question");
      setUserInput("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [currentPhase, blurAnswer]);

  // Handle answer submission in blur mode
  const handleAnswerSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      setCurrentPhase("question");

      // Focus hidden input after flipping
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);

      return; // ⬅️ prevent falling through to normal Enter handling
    }

    if (e.key === "Enter") {
      setCardCompleted(true);

      const normalize = (str: string) =>
        str
          ?.trim() // remove leading/trailing spaces
          .toLowerCase() // ignore case
          .replace(/\s+/g, " "); // collapse multiple spaces to one

      const correctAnswer = normalize(currentTerm?.answer || "");
      const userAns = normalize(userAnswer || "");

      // Exact check first
      const isExact = userAns === correctAnswer;

      // Levenshtein distance
      const d = distance(userAns, correctAnswer);

      // Allow small mistakes (tune threshold)
      const allowedMistakes = Math.max(
        1,
        Math.floor(correctAnswer.length * 0.2),
      );

      // Decide outcome
      if (isExact) {
        setCorrect(true);
        setIsExactCorrect(false);
        setCorrectCount((prev) => prev + 1);
      } else if (d > 0 && d <= allowedMistakes) {
        // Close enough — mark as accepted but show correction
        setCorrect(true); // or true if you want to treat it as correct
        setIsExactCorrect(true);
        setCorrectCount((prev) => prev + 1); // optional: give partial credit as correct
      } else {
        setCorrect(false);
        setIsExactCorrect(false);
        setWrongCount((prev) => prev + 1);
      }

      // Focus back to the hidden input to continue typing
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      setUserInput("");
    }
  };

  const handleTextClick = useCallback(() => {
    setIsClickingOnText(true);
    inputRef.current?.focus();
    setTimeout(() => setIsClickingOnText(false), 100);
  }, []);

  // Fixed highlighted text function
  const highlightedText = useMemo(() => {
    if (!currentText || !isTypingMode) return null;

    if (!isTypingMode) {
      return <span className="text-white">{currentText}</span>;
    }

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
                <span className="absolute left-0 top-0.5 h-8 w-0.5 bg-blue-400 animate-pulse" />
              )}
            </span>
          );
        })}
      </span>
    );
  }, [currentText, userInput, isTypingMode]);

  const shuffleFlashcards = useCallback(() => {
    const shuffledTerms = [...flashcard.terms];

    for (let i = shuffledTerms.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledTerms[i], shuffledTerms[j]] = [
        shuffledTerms[j],
        shuffledTerms[i],
      ];
    }

    setFlashcard((prev) => ({
      ...prev,
      terms: shuffledTerms,
    }));

    setCurrent(0);
    setCurrentTerm(shuffledTerms[0]);
    setIsShuffled(true);
    resetCurrentCard();
  }, [flashcard.terms, resetCurrentCard]);

  const unshuffleFlashcards = useCallback(() => {
    setFlashcard(copyFlashcardData);
    setCurrent(0);
    setCurrentTerm(copyFlashcardData.terms[0]);
    setIsShuffled(false);
    resetCurrentCard();
  }, [copyFlashcardData, resetCurrentCard]);

  const handleRestart = useCallback(() => {
    resetCurrentCard();
  }, [resetCurrentCard]);

  const [showSimpleResults, setShowSimpleResults] = useState(false);

  useEffect(() => {
    if (allComplete) {
      setShowSimpleResults(true);
    }
  }, [allComplete]);

  // Input change handler
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (currentPhase === "answer" && blurAnswer) {
        return;
      }
      const value = e.target.value;
      const currentTime = Date.now();

      setIsIdle(false);

      if (!startTime) {
        setStartTime(currentTime);
      }

      setUserInput(value);
      setCurrentIndex(value.length);

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

            setTimeout(() => {
              if (blurAnswer) {
                answerInputRef.current?.focus();
              } else {
                inputRef.current?.focus();
              }
            }, 100);
          }, 500);
        } else {
          setCorrect(true);
          setCardCompleted(true);
          setCorrectCount((prev) => prev + 1);

          if (answerTimeout) {
            clearTimeout(answerTimeout);
          }
        }
      }
    },
    [currentText, currentPhase, startTime, answerTimeout, goToNext],
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
      // Ctrl+Enter or Tab to skip question
      if (
        currentPhase === "question" &&
        (e.ctrlKey || e.metaKey) &&
        e.key === "Enter"
      ) {
        e.preventDefault();
        skipPhase();
      }

      if (e.key === "Backspace" && (e.ctrlKey || e.metaKey)) {
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

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(copyFlashcardData) !== JSON.stringify(flashcard);
  }, [copyFlashcardData, flashcard]);

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

        setFlashcard(data);
        setCopyFlashcardData(data);
        setTitle(data.title);
        setDescription(data.description);

        setCurrentTerm(data.terms[0]);
        setCurrent(0);

        setTimeout(() => {
          setUserInput("");
          setUserAnswer("");
          setCurrentPhase("question");
          setQuestionCompleted(false);
          setCardCompleted(false);
        }, 0);
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

  const handleResetFlashcards = () => {
    setShowSimpleResults(false);
    setAllComplete(false);
    setCorrectCount(0);
    setWrongCount(0);
    setCurrent(0);
    resetCurrentCard();
    setShowResetConfirm(false);
  };

  // Handle Flip Card
  const handleFlipCard = useCallback(() => {
    if (!isTypingMode) {
      const newPhase = currentPhase === "question" ? "answer" : "question";
      setCurrentPhase(newPhase);

      setTimeout(() => {
        if (newPhase === "question") {
          inputRef.current?.focus();
        } else if (blurAnswer) {
          answerInputRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      }, 300);
    }
  }, [isTypingMode, currentPhase, blurAnswer]);

  // Flip card on space key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isTypingMode && e.key === " ") {
        e.preventDefault();
        setCurrentPhase((prev) =>
          prev === "question" ? "answer" : "question",
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTypingMode]);

  // Auto focus on input field
  useEffect(() => {
    if (isTypingMode) {
      if (currentPhase === "question") {
        inputRef.current?.focus();
      } else if (currentPhase === "answer") {
        if (blurAnswer) {
          answerInputRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      }
    }
  }, [currentPhase, isTypingMode, blurAnswer]);

  // Save settings whenever they change
  useEffect(() => {
    saveSettings({
      isTypingMode,
      isQuizMode,
    });
  }, [isTypingMode, isQuizMode]);

  // Load settings
  useEffect(() => {
    const saved = localStorage.getItem("flashcardSettings");
    if (saved) {
      const { isTypingMode, showWpm, isQuizMode } = JSON.parse(saved);
      setIsTypingMode(isTypingMode);
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

      {!loadingFetch ? (
        <div className="relative -mt-3 sm:-mt-5">
          <FlashcardHeader
            title={title}
            description={description}
            onEdit={() => setOpenEditFlashcard(true)}
            onDelete={() => setOpenConfirmDelete(true)}
            flashcard={flashcard}
            setFlashcard={setFlashcard}
          />

          <div className="absolute bottom-70 -right-3 -z-2 size-155 rounded-full bg-radial-[at_50%_50%] from-blue-500/20 to-black to-70%" />

          {/* Dialogs */}
          <DiscardChangesDialog
            showDiscardConfirm={showDiscardConfirm}
            setShowDiscardConfirm={setShowDiscardConfirm}
            setOpenEditFlashcard={setOpenEditFlashcard}
            setCopyFlashcardData={setCopyFlashcardData}
            flashcard={flashcard}
          />

          <DeleteFlashcardDialog
            open={openConfirmDelete}
            onOpenChange={setOpenConfirmDelete}
            onConfirm={handleDeleteFlashcard}
          />
          <QuizModeConfirmDialog
            open={isQuizModeConfirm}
            onOpenChange={setIsQuizModeConfirm}
            onConfirm={() => {
              setUserInput("");
              setUserAnswer("");
              setCurrentIndex(0);
              setCurrentPhase("question");
              setQuestionCompleted(false);
              setCardCompleted(false);
              setStartTime(null);
              setShowAnswer(false);
              setCorrect(false);
              setBlurAnswer(true);
              setCorrectCount(0);
              setWrongCount(0);
              setCurrent(0);
              setTimeout(() => inputRef.current?.focus(), 0);
              setIsQuizModeConfirm(false);
              setIsQuizMode(false);
            }}
          />
          <ResetConfirmDialog
            open={showResetConfirm}
            onOpenChange={setShowResetConfirm}
            onConfirm={handleResetFlashcards}
          />
          <EditFlashcardDialog
            open={openEditFlashcard}
            onOpenChange={(open) => {
              if (!open) {
                if (hasUnsavedChanges) {
                  setShowDiscardConfirm(true);
                } else {
                  setOpenEditFlashcard(false);
                }
              } else {
                setOpenEditFlashcard(true);
              }
            }}
            flashcardData={copyFlashcardData}
            setFlashcardData={setCopyFlashcardData}
            onDeleteTerm={handleDelete}
            onAddTerm={() => {
              setCopyFlashcardData((prev: any) => ({
                ...prev,
                terms: [
                  ...prev.terms,
                  { id: Date.now(), question: "", answer: "" },
                ],
              }));
            }}
            onTitleChange={(value) => {
              setCopyFlashcardData((prev: any) => ({ ...prev, title: value }));
            }}
            onDescriptionChange={(value) => {
              setCopyFlashcardData((prev: any) => ({
                ...prev,
                description: value,
              }));
            }}
            onTermChange={(index, field, value) => {
              setCopyFlashcardData((prev: any) => {
                const newTerms = [...prev.terms];
                newTerms[index] = { ...newTerms[index], [field]: value };
                return { ...prev, terms: newTerms };
              });
            }}
            onSave={handleEditFlashcard}
          />

          <div className={`h-[100vh] pt-3`}>
            {/* Virtualized Carousel Container */}
            <div className="mx-auto relative max-w-[1000px]">
              <div className={`w-full mx-auto ${spaceMono.className}`}>
                <FlashcardItem
                  item={currentTerm}
                  index={current}
                  isActive={true}
                  currentPhase={currentPhase}
                  setCurrentPhase={setCurrentPhase}
                  questionCompleted={questionCompleted}
                  cardCompleted={cardCompleted}
                  isTypingMode={isTypingMode}
                  blurAnswer={blurAnswer}
                  setBlurAnswer={setBlurAnswer}
                  userAnswer={userAnswer}
                  setUserAnswer={setUserAnswer}
                  userInput={userInput}
                  // highlightedText={highlightedText}
                  handleTextClick={handleTextClick}
                  handleAnswerSubmit={handleAnswerSubmit}
                  showAnswer={showAnswer}
                  correct={correct}
                  handleFlipCard={handleFlipCard}
                  answerInputRef={answerInputRef}
                  skipPhase={skipPhase}
                  goToNext={goToNext}
                  isExactCorrect={isExactCorrect}
                />
              </div>

              {/* Navigation buttons */}
              <div className="absolute left-1 sm:left-4 top-1/2 transform -translate-y-1/2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrevious}
                  disabled={current === 0 || isQuizMode}
                  className="cursor-pointer  h-7 w-7 md:h-10 md:w-10 rounded-full bg-gray-800/30 hover:bg-gray-700 border-gray-600"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              </div>

              <div className="absolute right-1 sm:right-4 top-1/2 transform -translate-y-1/2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                  disabled={
                    current === flashcard.terms.length - 1 || isQuizMode
                  }
                  className="cursor-pointer h-7 w-7 md:h-10 md:w-10 rounded-full bg-gray-800/30 hover:bg-gray-700 border-gray-600"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

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
            </div>

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
                className="absolute opacity-0 w-1 h-1 top-0 left-0"
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
              style={{ height: "600px" }}
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
