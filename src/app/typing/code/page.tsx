"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  startTransition,
  useMemo,
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClickingOnText, setIsClickingOnText] = useState(true);
  const [isFocused, setIsFocused] = useState(true);

  // Time
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  // Stats
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setInCorrectChars] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wpm, setWpm] = useState(0);

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
    setCurrentIndex(0);
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

  // Highlight code with better debugging
  const highlightedCode = useMemo(() => {
    if (isLoading || !codeData?.code) {
      return <div className="text-gray-500">Loading code...</div>;
    }

    const codeContent = codeData.code;
    const inputLength = userInput.length;

    return (
      <>
        {codeContent.split("\n").map((line: any, lineIndex: any) => (
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
                line.split("").map((char: any, charIndex: any) => {
                  // Calculate absolute position in the entire code string
                  let absoluteIndex = 0;
                  for (let i = 0; i < lineIndex; i++) {
                    absoluteIndex += codeContent.split("\n")[i].length + 1; // +1 for \n
                  }
                  absoluteIndex += charIndex;

                  const isCursor = absoluteIndex === inputLength;
                  const isTyped = absoluteIndex < inputLength;
                  const isCorrect =
                    isTyped && userInput[absoluteIndex] === char;

                  const className = isTyped
                    ? isCorrect
                      ? "text-white bg-green-900/20"
                      : "text-red-400 bg-red-900/30"
                    : "text-gray-500";

                  const displayChar = char === " " ? "\u00A0" : char;

                  return (
                    <span
                      key={`${lineIndex}-${charIndex}`}
                      className="relative"
                    >
                      {isCursor && (
                        <span
                          className={`absolute left-0 top-[1px] w-0.5 h-4  bg-blue-400 z-10 ${
                            isIdle ? "animate-pulse" : "animate-pulse"
                          }`}
                        />
                      )}
                      <span className={className}>{displayChar}</span>
                    </span>
                  );
                })
              )}
              {/* Handle cursor at end of line */}
              {(() => {
                let lineEndIndex = 0;
                for (let i = 0; i <= lineIndex; i++) {
                  if (i < lineIndex) {
                    lineEndIndex += codeContent.split("\n")[i].length + 1;
                  } else {
                    lineEndIndex += codeContent.split("\n")[i].length;
                  }
                }
                return (
                  inputLength === lineEndIndex && (
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
        ))}
      </>
    );
  }, [codeData, userInput, isIdle, isLoading]);

  // Input Change with better character tracking
  const handleInputChange = useCallback(
    (e: any) => {
      const value = e.target.value;
      const currentTime = Date.now();

      console.log("Input changed:", JSON.stringify(value));

      // Set idle state immediately
      setIsIdle(false);

      // Start timer on first input
      if (!startTime) {
        setStartTime(currentTime);
      }

      // Update input immediately (high priority)
      setUserInput(value);
      setCurrentIndex(value.length);

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
    [codeData, startTime, debouncedWpmUpdate]
  );

  // Delete Previous Word
  const deletePreviousWord = useCallback(() => {
    let deleteTo = currentIndex - 1;
    while (deleteTo > 0 && userInput[deleteTo - 1] !== " ") deleteTo--;
    const newInput = userInput.substring(0, deleteTo);
    setUserInput(newInput);
    setCurrentIndex(deleteTo);
  }, [currentIndex, userInput]);

  // Improved Enter key handling
  const handleKeyDown = useCallback(
    (e: any) => {
      if (e.key === "Backspace" && e.ctrlKey) {
        e.preventDefault();
        deletePreviousWord();
        return;
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
          setCurrentIndex(newIndex);
        }
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();

        const codeContent = codeData?.code;
        if (!codeContent) return;

        const nextCharIndex = userInput.length;

        console.log(
          "Enter pressed, next char should be:",
          JSON.stringify(codeContent[nextCharIndex] || "END"),
          "at index:",
          nextCharIndex
        );

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

          console.log(
            "After Enter, new input:",
            JSON.stringify(newInput),
            "new index:",
            newIndex
          );

          // Update state with the new input and cursor position
          setUserInput(newInput);
          setCurrentIndex(newIndex);

          // Trigger input change handling to ensure correct/incorrect tracking
          const syntheticEvent = {
            target: { value: newInput },
          };
          handleInputChange(syntheticEvent);
        }
        return;
      }
    },
    [deletePreviousWord, userInput, codeData, handleInputChange]
  );

  // Is Typing
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
    <div className="lg:pl-20  text-white min-h-screen relative">
      {!isLoading ? (
        <div>
          {!completed ? (
            <div className="px-4 pb-6">
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
                  </div>
                  <p className="text-sm md:text-base mt-1 max-w-4xl text-gray-300">
                    {codeData?.description}
                  </p>
                </div>
              </div>
              <div className="relative overflow-auto mt-7 bg-black p-6 rounded-lg border border-gray-700/40">
                <pre className="line-numbers">
                  <code className=" md:text-lg lg:text-lg font-mono leading-relaxed">
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
              {/* Focus indicator */}
              {/* {!isFocused && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/60 z-50 rounded-lg cursor-pointer"
                  onClick={handleTextClick}
                >
                  <div className="text-white text-sm md:text-base bg-gray-800 px-4 py-2 rounded shadow-md">
                    Click here to start typing...
                  </div>
                </div>
              )} */}
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
