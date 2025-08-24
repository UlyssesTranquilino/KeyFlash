"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  startTransition,
  useMemo,
  memo,
} from "react";
import { useCode } from "@/app/context/CodeContext";
import { useWpm } from "@/app/context/WpmContext";

import { RotateCcw, CirclePlus } from "lucide-react";
import {
  getRandomCodeSnippets,
  getCodeSnippets,
} from "../../../../utils/typing/getCodeSnippet";
import { motion } from "framer-motion";

import Results from "@/components/ui/typing/Results";

// Debounce utility
const debounce = (func: any, wait: any) => {
  let timeout: any;
  return function executedFunction(...args: any) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Memoized Character Component to prevent unnecessary rerenders
const CharacterComponent = memo(
  ({
    char,
    absoluteIndex,
    userInput,
    isIdle,
    isLocked,
  }: {
    char: string;
    absoluteIndex: number;
    userInput: string;
    isIdle: boolean;
    isLocked: boolean;
  }) => {
    const isCursor = absoluteIndex === userInput.length && !isLocked;
    const isTyped = absoluteIndex < userInput.length;
    const isCorrect = isTyped && userInput[absoluteIndex] === char;

    const className = isTyped
      ? isCorrect
        ? "text-white bg-green-900/20"
        : "text-red-400 bg-red-900/30"
      : isLocked
        ? "text-gray-600 opacity-50"
        : "text-gray-500";

    const displayChar = char === " " ? "\u00A0" : char;

    return (
      <span className="relative">
        {isCursor && (
          <span
            className={`absolute left-0 top-[1px] w-0.5 h-4 bg-blue-400 z-10 ${
              isIdle ? "animate-pulse" : "animate-pulse"
            }`}
          />
        )}
        <span className={className}>{displayChar}</span>
      </span>
    );
  }
);

CharacterComponent.displayName = "CharacterComponent";

// Memoized Line Component
const LineComponent = memo(
  ({
    line,
    lineIndex,
    codeContent,
    userInput,
    isIdle,
    lockedLines,
  }: {
    line: string;
    lineIndex: number;
    codeContent: string;
    userInput: string;
    isIdle: boolean;
    lockedLines: Set<number>;
  }) => {
    const isLocked = lockedLines.has(lineIndex);

    // Calculate absolute starting index for this line
    const lineStartIndex = useMemo(() => {
      let index = 0;
      const lines = codeContent.split("\n");
      for (let i = 0; i < lineIndex; i++) {
        index += lines[i].length + 1; // +1 for \n
      }
      return index;
    }, [codeContent, lineIndex]);

    return (
      <div key={lineIndex} className="relative min-h-[1.5rem]">
        {/* Line number */}
        <span className="absolute left-0 text-gray-700 select-none w-8 text-right pr-2">
          {lineIndex + 1}
        </span>

        {/* Line content */}
        <div className="pl-10">
          {line.length === 0 ? (
            // Handle empty lines
            <span className="text-gray-500">&nbsp;</span>
          ) : (
            line.split("").map((char, charIndex) => {
              const absoluteIndex = lineStartIndex + charIndex;

              return (
                <CharacterComponent
                  key={`${lineIndex}-${charIndex}`}
                  char={char}
                  absoluteIndex={absoluteIndex}
                  userInput={userInput}
                  isIdle={isIdle}
                  isLocked={isLocked}
                />
              );
            })
          )}

          {/* Handle cursor at end of line */}
          {(() => {
            const lineEndIndex = lineStartIndex + line.length;
            const isCursor = userInput.length === lineEndIndex && !isLocked;

            return (
              isCursor && (
                <span className="relative">
                  <span
                    className={`absolute left-0 top-0 w-0.5 h-5 bg-blue-400 z-10 ${
                      isIdle ? "animate-pulse" : "animate-pulse"
                    }`}
                  />
                </span>
              )
            );
          })()}
        </div>
      </div>
    );
  }
);

LineComponent.displayName = "LineComponent";

const CodeType = () => {
  const { showWpm, setShowWpm } = useWpm();
  const { language, topic } = useCode();

  // Code
  const [codeData, setCodeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Typing
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userInput, setUserInput] = useState("");
  const [isIdle, setIsIdle] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharInLine, setCurrentCharInLine] = useState(0);
  const [isClickingOnText, setIsClickingOnText] = useState(true);
  const [isFocused, setIsFocused] = useState(true);

  // Line locking state - tracks which lines are "locked" (completed and can't be edited)
  const [lockedLines, setLockedLines] = useState<Set<number>>(new Set());

  // Time
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  // Stats
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setInCorrectChars] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wpm, setWpm] = useState(0);

  // Split code into lines for better performance
  const codeLines = useMemo(() => {
    if (!codeData?.code) return [];
    return codeData.code.split("\n");
  }, [codeData?.code]);

  // Calculate current position in code
  const currentPosition = useMemo(() => {
    let globalIndex = 0;
    for (let i = 0; i < currentLineIndex && i < codeLines.length; i++) {
      globalIndex += codeLines[i].length + 1; // +1 for \n
    }
    globalIndex += currentCharInLine;
    return globalIndex;
  }, [currentLineIndex, currentCharInLine, codeLines]);

  // Initial Code Snippet Fetch
  useEffect(() => {
    handleRefetch();
  }, [language, topic]);

  // Style Difficulty
  const styleDifficulty = (difficulty: any) => {
    difficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    if (difficulty == "Easy") {
      return (
        <div className="bg-gray-900 text-green-300 px-2 w-auto flex items-center justify-center text-sm rounded-full p-1">
          {difficulty}
        </div>
      );
    } else if (difficulty == "Medium") {
      return (
        <div className="bg-gray-900 text-orange-300 px-2 w-auto flex items-center justify-center text-sm rounded-full p-1">
          {difficulty}
        </div>
      );
    } else {
      return (
        <div className="bg-gray-900 text-red-300 px-2 w-auto flex items-center justify-center text-sm rounded-full p-1">
          {difficulty}
        </div>
      );
    }
  };

  // Reset Text
  const resetTest = useCallback(() => {
    setUserInput("");
    setCurrentLineIndex(0);
    setCurrentCharInLine(0);
    setLockedLines(new Set());
    setStartTime(null);
    setWpm(0);
    setIsIdle(true);
    setCompleted(false);
    setCorrectChars(0);
    setInCorrectChars(0);
    setMistakes(0);
    inputRef.current?.focus();
  }, []);

  const handleRefetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getCodeSnippets(language, topic);
      setCodeData(data);
      resetTest();
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching code snippet:", error);
      setIsLoading(false);
    }
  }, [resetTest, language, topic]);

  // Debounced WPM calculation
  const debouncedWpmUpdate = useMemo(
    () =>
      debounce((inputLength: any, start: any) => {
        const timeElapsed = (Date.now() - start) / 60000;
        const words = inputLength > 0 ? Math.max(1, inputLength / 5) : 0;
        startTransition(() => {
          setWpm(Math.round(words / timeElapsed));
        });
      }, 100),
    []
  );

  // Virtualized line rendering - only render visible lines
  const visibleLines = useMemo(() => {
    const startLine = Math.max(0, currentLineIndex - 5);
    const endLine = Math.min(codeLines.length, currentLineIndex + 15);

    return codeLines.slice(startLine, endLine).map((line, relativeIdx) => {
      const actualLineIdx = startLine + relativeIdx;
      return {
        line,
        lineIndex: actualLineIdx,
        isLocked: lockedLines.has(actualLineIdx),
      };
    });
  }, [codeLines, currentLineIndex, lockedLines]);

  // Optimized code highlighting with virtualization
  const highlightedCode = useMemo(() => {
    if (isLoading || !codeData?.code) {
      return <div className="text-gray-500">Loading code...</div>;
    }

    return (
      <>
        {visibleLines.map(({ line, lineIndex, isLocked }) => (
          <LineComponent
            key={lineIndex}
            line={line}
            lineIndex={lineIndex}
            codeContent={codeData.code}
            userInput={userInput}
            isIdle={isIdle}
            lockedLines={lockedLines}
          />
        ))}
      </>
    );
  }, [visibleLines, codeData?.code, userInput, isIdle, lockedLines, isLoading]);

  // Optimized input change handler with line locking
  const handleInputChange = useCallback(
    (e: any) => {
      const value = e.target.value;
      const currentTime = Date.now();

      // Prevent editing locked content
      if (
        value.length < currentPosition &&
        lockedLines.has(currentLineIndex - 1)
      ) {
        return;
      }

      setIsIdle(false);

      // Start timer on first input
      if (!startTime) {
        setStartTime(currentTime);
      }

      // Calculate current line and character position
      let totalChars = 0;
      let newLineIndex = 0;
      let newCharInLine = 0;

      for (let i = 0; i < codeLines.length; i++) {
        const lineLength = codeLines[i].length;
        const includeNewline = i < codeLines.length - 1;
        const lineTotalLength = lineLength + (includeNewline ? 1 : 0);

        if (value.length <= totalChars + lineLength) {
          newLineIndex = i;
          newCharInLine = value.length - totalChars;
          break;
        } else if (
          value.length ===
          totalChars + lineLength + (includeNewline ? 1 : 0)
        ) {
          // User completed this line and the newline
          newLineIndex = i + 1;
          newCharInLine = 0;

          // Lock the completed line
          setLockedLines((prev) => new Set([...prev, i]));
          break;
        } else if (value.length < totalChars + lineTotalLength) {
          newLineIndex = i;
          newCharInLine = value.length - totalChars;
          break;
        }

        totalChars += lineTotalLength;
      }

      // Update input immediately (high priority)
      setUserInput(value);
      setCurrentLineIndex(newLineIndex);
      setCurrentCharInLine(newCharInLine);

      // Batch non-critical updates
      startTransition(() => {
        if (codeData?.code) {
          // Character Counting - count all correct characters from start
          let correct = 0;
          let incorrect = 0;
          const minLength = Math.min(value.length, codeData.code.length);

          for (let i = 0; i < minLength; i++) {
            if (value[i] === codeData.code[i]) {
              correct++;
            } else {
              // Once we hit an incorrect character, everything after is considered incorrect
              incorrect = value.length - correct;
              break;
            }
          }

          // If we've typed more than the code length, all extra characters are incorrect
          if (value.length > codeData.code.length) {
            incorrect += value.length - codeData.code.length;
          }

          setCorrectChars(correct);
          setInCorrectChars(incorrect);
          setMistakes(incorrect);

          // Check completion - must match exactly
          if (value.length === codeData.code.length) {
            setEndTime(currentTime);
            setCompleted(true);
          }
        }

        // Update WPM with debouncing
        if (startTime && value.length > 0) {
          debouncedWpmUpdate(value.length, startTime);
        }
      });
    },
    [
      codeData,
      startTime,
      debouncedWpmUpdate,
      codeLines,
      currentPosition,
      lockedLines,
      currentLineIndex,
    ]
  );

  // Delete Previous Word with line locking
  const deletePreviousWord = useCallback(() => {
    // Find the start of the current word, but respect locked lines
    let targetLineIndex = currentLineIndex;
    let targetCharInLine = currentCharInLine;

    if (targetCharInLine === 0 && targetLineIndex > 0) {
      targetLineIndex = targetLineIndex - 1;
      targetCharInLine = codeLines[targetLineIndex]?.length || 0;
    }

    // Don't delete into locked lines
    while (targetLineIndex >= 0 && lockedLines.has(targetLineIndex)) {
      targetLineIndex++;
      targetCharInLine = 0;
      break;
    }

    if (targetLineIndex < 0) return;

    // Calculate the position at the start of the target position
    let newPosition = 0;
    for (let i = 0; i < targetLineIndex; i++) {
      newPosition += codeLines[i].length + 1; // +1 for \n
    }

    // Find word boundary
    const line = codeLines[targetLineIndex] || "";
    let wordStart = targetCharInLine;
    while (wordStart > 0 && line[wordStart - 1] !== " ") {
      wordStart--;
    }

    newPosition += wordStart;
    const newInput = userInput.substring(0, newPosition);

    setUserInput(newInput);
    setCurrentLineIndex(targetLineIndex);
    setCurrentCharInLine(wordStart);
  }, [currentLineIndex, currentCharInLine, userInput, lockedLines, codeLines]);

  // Improved key handling with line locking
  const handleKeyDown = useCallback(
    (e: any) => {
      if (e.key === "Backspace" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        deletePreviousWord();
        return;
      }


      // Prevent backspace into locked content
      if (e.key === "Backspace") {
        const wouldDeleteIntoLocked =
          userInput.length <= currentPosition &&
          lockedLines.has(currentLineIndex - 1);
        if (wouldDeleteIntoLocked) {
          e.preventDefault();
          return;
        }
      }

      if (e.key === "Tab") {
        e.preventDefault();
        const codeContent = codeData?.code;
        if (!codeContent) return;

        const nextCharIndex = userInput.length;
        if (nextCharIndex < codeContent.length) {
          let newInput = userInput;
          let newIndex = nextCharIndex;

          // Add spaces until we match the expected indentation
          while (
            newIndex < codeContent.length &&
            codeContent[newIndex] === " "
          ) {
            newInput += " ";
            newIndex++;
          }

          setUserInput(newInput);

          // Update position tracking
          const syntheticEvent = { target: { value: newInput } };
          handleInputChange(syntheticEvent);
        }
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();

        const codeContent = codeData?.code;
        if (!codeContent) return;

        const nextCharIndex = userInput.length;

        if (
          (nextCharIndex < codeContent.length &&
            codeContent[nextCharIndex] === "\n") ||
          codeContent[nextCharIndex] === ""
        ) {
          let newInput = userInput + "\n";
          let newIndex = nextCharIndex + 1;

          // Automatically add indentation spaces that follow the newline
          while (
            newIndex < codeContent.length &&
            codeContent[newIndex] === " "
          ) {
            newInput += " ";
            newIndex++;
          }

          // Trigger input change handling to ensure correct/incorrect tracking
          const syntheticEvent = {
            target: { value: newInput },
          };
          handleInputChange(syntheticEvent);
        }
        return;
      }
    },
    [
      deletePreviousWord,
      userInput,
      codeData,
      handleInputChange,
      currentPosition,
      lockedLines,
      currentLineIndex,
    ]
  );

  // Focus handlers
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

  return (
    <div className="lg:pl-20 text-white min-h-screen relative">
      {!isLoading ? (
        <div>
          {!completed ? (
            <div className="px-4 pb-4 mt-20">
              {showWpm && (
                <motion.div
                  initial={{ y: -17, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -17, opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute right-0 self-end p-5 sm:p-3 pr-0 my-2 bg-black/40 text-white text-sm md:text-base px-3 py-1 rounded-md font-mono shadow-lg backdrop-blur-sm"
                >
                  {userInput.length == 0 ? 0 : wpm} WPM
                </motion.div>
              )}

              {/* Code Information */}
              <div className="pl-2 flex items-center">
                <div className="my-3">
                  <h1 className="mb-3 font-medium text-lg md:text-2xl lg:text-[1.7em]">
                    {codeData?.title}
                  </h1>
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    {codeData?.difficulty
                      ? styleDifficulty(codeData?.difficulty)
                      : ""}

                    <div className="bg-gray-900 text-blue-300 w-auto px-3 flex items-center justify-center text-sm rounded-full p-1">
                      Time Complexity: {codeData?.time_complexity}
                    </div>

                    <div className="bg-gray-900 text-blue-300 w-auto px-3 flex items-center justify-center text-sm rounded-full p-1">
                      Space Complexity: {codeData?.space_complexity}
                    </div>

                    <div className="bg-gray-900 text-blue-300 w-auto px-3 flex items-center justify-center text-sm rounded-full p-1">
                      {codeData?.language}
                    </div>
                  </div>
                  <p className="text-sm md:text-base mt-1 max-w-4xl text-gray-300">
                    {codeData?.description}
                  </p>
                </div>
              </div>

              <div className="relative overflow-auto mt-7 bg-black p-6 rounded-lg border border-gray-700/40">
                <pre className="line-numbers">
                  <code className="md:text-lg lg:text-lg font-mono leading-relaxed">
                    {highlightedCode}
                  </code>
                </pre>

                {/* Hidden input positioned only here */}
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="absolute inset-0 opacity-0 z-10"
                  autoFocus
                  aria-hidden="true"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 sm:gap-14 md:gap-22 lg:gap-28 my-10">
                <button
                  className="flex items-center justify-center lg:text-lg mt-4 p-2 px-6 hover:text-blue-400 hover:bg-blue-950/30 rounded-sm text-gray-400 transition-colors"
                  onClick={handleRefetch}
                  disabled={isLoading}
                >
                  <CirclePlus className="mr-2 lg:mr-3 w-4 h-4 lg:scale-130" />
                  {isLoading ? "Loading..." : "New Code"}
                </button>

                <button
                  className="flex items-center justify-center lg:text-lg mt-4 p-2 px-6 hover:text-gray-300 hover:bg-gray-900 rounded-sm text-gray-400 transition-colors"
                  onClick={resetTest}
                >
                  <RotateCcw className="mr-2 lg:mr-3 w-4 h-4 lg:scale-130" />
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-28">
              <Results
                wpm={wpm}
                startTime={startTime}
                endTime={endTime || Date.now()}
                accuracy={
                  (correctChars / (correctChars + incorrectChars)) * 100
                }
                correctChars={correctChars}
                incorrectChars={incorrectChars}
                totalChars={codeData?.code?.length || 0}
                quote={codeData?.code || " "}
                author={"code"}
                mistakes={mistakes}
                handleRefetch={handleRefetch}
                handleRetype={resetTest}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-start justify-center py-60">
          <div className="text-xl text-gray-400">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default CodeType;
