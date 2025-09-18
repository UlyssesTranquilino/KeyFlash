"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  Eye,
  EyeClosed,
  SkipForward,
  CircleX,
  Check,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";

// Virtualized Flashcard Item Component
export const FlashcardItem = ({
  item,
  index,
  isActive,
  currentPhase,
  setCurrentPhase,
  questionCompleted,
  cardCompleted,
  isTypingMode,
  blurAnswer,
  setBlurAnswer,
  userAnswer,
  setUserAnswer,
  userInput,
  handleTextClick,
  handleAnswerSubmit,
  showAnswer,
  correct,
  handleFlipCard,
  answerInputRef,
  skipPhase,
  goToNext,
  isExactCorrect,
  isQuizMode,
  quizModeTypingOff,
}) => {
  if (!isActive) {
    return <div className="h-100 md:h-110" />;
  }

  const wordsRef = useRef<HTMLDivElement>(null);
  const textDisplayRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  const LINE_HEIGHT = 45;
  const VISIBLE_LINES = 4;
  const CONTAINER_HEIGHT = LINE_HEIGHT * VISIBLE_LINES;

  const [isMobile, setIsMobile] = useState(false);

  // Reset scroll when phase or card changes
  useEffect(() => {
    setScrollOffset(0);
    if (textDisplayRef.current) {
      textDisplayRef.current.scrollTop = 0;
    }
  }, [currentPhase, item]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768); // adjust breakpoint
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollToCursor = useCallback(() => {
    if (cursorRef.current && textDisplayRef.current) {
      const cursor = cursorRef.current;
      const container = textDisplayRef.current;

      const cursorRect = cursor.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const cursorTop =
        cursorRect.top - containerRect.top + container.scrollTop;
      const cursorBottom = cursorTop + cursorRect.height;

      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;
      const scrollBottom = scrollTop + containerHeight;

      // Only scroll if cursor is near the bottom of the visible area
      if (cursorBottom > scrollBottom - LINE_HEIGHT) {
        const newScrollTop = cursorBottom - containerHeight + LINE_HEIGHT;
        container.scrollTop = Math.max(0, newScrollTop);
      }
    }
  }, [LINE_HEIGHT]);

  const calculateCurrentLine = useCallback(
    (position: number, text: string) => {
      if (!wordsRef.current || !text) return 0;

      // Create a temporary element to measure text wrapping
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.visibility = "hidden";
      tempDiv.style.whiteSpace = "pre-wrap";
      tempDiv.style.wordBreak = "break-word";
      tempDiv.style.width = getComputedStyle(wordsRef.current).width;
      tempDiv.style.fontSize = getComputedStyle(wordsRef.current).fontSize;
      tempDiv.style.fontFamily = getComputedStyle(wordsRef.current).fontFamily;
      tempDiv.style.lineHeight = `${LINE_HEIGHT}px`;
      tempDiv.style.textAlign = "center";

      document.body.appendChild(tempDiv);

      const textUpToPosition = text.substring(0, position);
      tempDiv.textContent = textUpToPosition;

      const height = tempDiv.offsetHeight;
      const lineNumber = Math.max(0, Math.floor(height / LINE_HEIGHT));

      document.body.removeChild(tempDiv);
      return lineNumber;
    },
    [LINE_HEIGHT]
  );

  const updateScrollPosition = useCallback(() => {
    const currentText =
      currentPhase === "question" ? item?.question : item?.answer;
    if (!currentText) return;

    const currentLine = calculateCurrentLine(userInput.length, currentText);

    // Only start scrolling when we're past the visible area (after line 3, since we show 4 lines)
    if (currentLine >= VISIBLE_LINES - 1) {
      const scrollLines = currentLine - (VISIBLE_LINES - 2); // Keep 2 lines visible above cursor
      const newScrollOffset = scrollLines * LINE_HEIGHT;
      setScrollOffset(Math.max(0, newScrollOffset));
    } else {
      setScrollOffset(0);
    }
  }, [
    userInput.length,
    currentPhase,
    item,
    calculateCurrentLine,
    LINE_HEIGHT,
    VISIBLE_LINES,
  ]);

  useEffect(() => {
    if (isTypingMode && userInput.length > 0) {
      requestAnimationFrame(() => {
        updateScrollPosition();
        scrollToCursor();
      });
    }
  }, [userInput, isTypingMode, scrollToCursor, updateScrollPosition]);

  // Split text into words for better wrapping
  const createHighlightedText = useMemo(() => {
    if (!isTypingMode) {
      const currentText =
        currentPhase === "question" ? item?.question : item?.answer;
      return <span className="text-white">{currentText}</span>;
    }

    const currentText =
      currentPhase === "question" ? item?.question : item?.answer;
    if (!currentText) return null;

    // Split text into words while preserving spaces
    const words = currentText.split(/(\s+)/);
    let charIndex = 0;

    return (
      <div className="text-center">
        {words.map((word, wordIndex) => {
          const wordStartIndex = charIndex;
          const wordEndIndex = charIndex + word.length;
          charIndex = wordEndIndex;

          return (
            <span key={wordIndex} className="inline-block">
              {word.split("").map((char, charIndexInWord) => {
                const globalCharIndex = wordStartIndex + charIndexInWord;
                const isTyped = globalCharIndex < userInput.length;
                const isCorrect = isTyped
                  ? userInput[globalCharIndex] === char
                  : false;
                const isCursor = globalCharIndex === userInput.length;

                return (
                  <span
                    key={globalCharIndex}
                    className={cn(
                      "relative",
                      isTyped
                        ? isCorrect
                          ? "text-white"
                          : "text-red-600 bg-red-900/30"
                        : "text-gray-500"
                    )}
                  >
                    {char === " " ? "\u00A0" : char}
                    {isCursor && (
                      <span
                        ref={cursorRef}
                        className="absolute left-0 top-0.5 h-8 w-0.5 bg-blue-400 animate-pulse"
                      />
                    )}
                  </span>
                );
              })}
            </span>
          );
        })}
      </div>
    );
  }, [currentPhase, item, isTypingMode, userInput]);

  return (
    <div className="mt-2 max-w-[1100px] rounded-2xl bg-gray-900/70 relative overflow-hidden h-100 md:h-110">
      <div
        className="flex flex-col items-center justify-center h-full p-2 md:p-4"
        onClick={handleFlipCard}
        style={{ perspective: "1000px" }}
        tabIndex={0}
      >
        <motion.div
          className="w-full h-full relative "
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
            className="absolute  inset-0 flex flex-col items-center justify-center p-8 backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              display: currentPhase === "question" ? "flex" : "none",
            }}
          >
            <div className="absolute top-0 h-10 right-0 w-full items-center flex justify-between px-3">
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
                  {questionCompleted && <CheckCircle className="w-4 h-4" />}
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
                <div className="flex gap-3 items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={skipPhase}
                        className={cn(
                          "p-2 cursor-pointer rounded-md transition-colors",
                          "text-gray-300 hover:text-white",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        )}
                        aria-label="Skip question"
                      >
                        <SkipForward className="w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Skip to answer (Ctrl+Enter)</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBlurAnswer(!blurAnswer);
                        }}
                        className={cn(
                          "cursor-pointer flex items-center gap-2 text-[0.9rem] transition px-3 lg:px-2",
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
                </div>
              )}
            </div>

            <h2 className="mt-3 text-sm md:text-base text-center text-gray-400 mb-4 mt-10">
              {isTypingMode ? "Type the question:" : "Question:"}
            </h2>

            <div className="text-center  flex items-center justify-center w-full max-w-[600px]">
              <motion.div
                key={`${index}-question`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                ref={textDisplayRef}
                className={`overflow-y-scroll text-xl md:text-2xl text-center font-mono leading-relaxed mb-8 sm:px-4 cursor-text whitespace-pre-wrap transition-all duration-300 overflow-hidden`}
                onClick={handleTextClick}
                onMouseDown={(e) => e.preventDefault()}
                style={{ height: `${CONTAINER_HEIGHT}px` }}
              >
                {isTypingMode ? (
                  <div
                    ref={wordsRef}
                    className="transition-transform duration-200 ease-out w-full"
                    style={{
                      transform: `translateY(-${scrollOffset}px)`,
                      lineHeight: `${LINE_HEIGHT}px`,
                    }}
                  >
                    {createHighlightedText}
                  </div>
                ) : (
                  <p className="whitespace-pre-line">{item?.question}</p>
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
            <div className="h-10   absolute top-0 right-0 w-full items-center flex justify-between px-3">
              {" "}
              <div className="flex items-center gap-2 sm:gap-3">
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
                  {questionCompleted && <CheckCircle className="w-4 h-4" />}
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
              {cardCompleted && currentPhase === "answer" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full text-center"
                >
                  {isMobile ? (
                    <div
                      onClick={goToNext} // move to next card
                      className="inline-flex items-center ml-3 gap-2 px-3 py-1 bg-blue-900/30 rounded-full cursor-pointer hover:bg-blue-800/50"
                    >
                      <SkipForward className="text-gray-300 w-3 h-3  rotate-180" />
                      <span className="hidden sm:block text-gray-300 text-sm">
                        Continue
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 rounded-full">
                      <span className="text-gray-300 text-sm">
                        Press{" "}
                        <kbd className="px-2 py-1 text-xs font-mono bg-gray-700 rounded-md text-gray-200">
                          SPACE
                        </kbd>{" "}
                        to continue
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
              {isTypingMode && (
                <div className="flex gap-3 items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={skipPhase}
                        className={cn(
                          "p-2 cursor-pointer rounded-md transition-colors",
                          "text-gray-300 hover:text-white",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        )}
                        aria-label="Skip back to question"
                      >
                        <SkipForward className="w-4 rotate-180" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Skip back to question (Ctrl+Enter)</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBlurAnswer(!blurAnswer);
                        }}
                        className={cn(
                          "cursor-pointer flex items-center gap-2 text-[0.9rem] transition px-3 lg:px-2",
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

            <div className="text-center flex items-center justify-center w-full max-w-[600px]">
              {blurAnswer && !showAnswer && isTypingMode ? (
                <div className="w-full">
                  <input
                    value={userAnswer}
                    type="text"
                    className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="Type your answer here..."
                    onKeyDown={handleAnswerSubmit}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    autoFocus
                    ref={answerInputRef}
                  />
                </div>
              ) : (
                <div>
                  <motion.div
                    key={`${index}-answer`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    ref={textDisplayRef}
                    className={`overflow-y-scroll text-xl md:text-2xl text-center font-mono leading-relaxed mb-8 sm:px-4 cursor-text whitespace-pre-wrap transition-all duration-300 overflow-hidden`}
                    onClick={handleTextClick}
                    onMouseDown={(e) => e.preventDefault()}
                    style={{ height: `${CONTAINER_HEIGHT}px` }}
                  >
                    {isTypingMode ? (
                      <div
                        ref={wordsRef}
                        className="transition-transform duration-200 ease-out w-full"
                        style={{
                          transform: `translateY(-${scrollOffset}px)`,
                          lineHeight: `${LINE_HEIGHT}px`,
                        }}
                      >
                        {createHighlightedText}
                      </div>
                    ) : (
                      <p className="whitespace-pre-line">{item?.answer}</p>
                    )}
                  </motion.div>

                  <div>
                    {/* Quiz mode and typing mode off */}
                    {!isTypingMode && isQuizMode && (
                      <div className="bottom-0 w-full flex items-center justify-center gap-8">
                        <button
                          onClick={() => {
                            quizModeTypingOff(false);
                          }}
                          className="w-20 flex items-center justify-center  p-2  rounded-sm cursor-pointer bg-red-800/20 hover:bg-red-800/40"
                        >
                          <X className="text-red-400" />
                        </button>

                        <button
                          onClick={() => {
                            quizModeTypingOff(true);
                          }}
                          className="w-20 flex items-center justify-center  p-2  rounded-sm cursor-pointer bg-green-800/20 hover:bg-green-800/40"
                        >
                          <Check className="text-green-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {blurAnswer && showAnswer && (
              <div className="mt-4 p-4 bg-gray-800 rounded-md w-full">
                <p className="text-gray-400 mb-2">Correct answer:</p>
                <p className="text-white text-xl">{item?.answer}</p>
              </div>
            )}

            {cardCompleted && (correct || isExactCorrect) && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-green-400 text-center mt-6"
              >
                <span className="text-sm">
                  {blurAnswer ? (
                    isExactCorrect ? (
                      <div className="mt-4 p-4  rounded-md w-full text-yellow-400">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                        <p className="mb-2 ">Almost - correct</p>
                        <p className="text-white text-xl">{item?.answer}</p>
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                        Correct!
                      </>
                    )
                  ) : (
                    <>
                      <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                      Card completed!
                    </>
                  )}
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
                <span className="text-red-400 text-sm">Wrong Answer!</span>
                <div className="mt-1 overflow-y-auto">
                  Correct Answer: {item?.answer}
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
