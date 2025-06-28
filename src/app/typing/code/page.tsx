"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  startTransition,
  useMemo,
} from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

// Programming languages
const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c++", label: "C++" },
  { value: "go", label: "Go" },
  { value: "typescript", label: "TypeScript" },
  { value: "pseudocode", label: "Pseudocode" },
];

// DSA Topics
const topics = [
  { value: "arrays", label: "Arrays" },
  { value: "linked-lists", label: "Linked Lists" },
  { value: "stacks", label: "Stacks" },
  { value: "queues", label: "Queues" },
  { value: "hashmaps", label: "Hash Maps" },
  { value: "trees", label: "Trees" },
  { value: "recursion", label: "Recursion" },
  { value: "sorting", label: "Sorting" },
  { value: "searching", label: "Searching" },
  { value: "dynamic-programming", label: "Dynamic Programming" },
];

// Utils
import { getCodeSnippets } from "../../../../utils/typing/getCodeSnippet";
import { getRandomQuote } from "@/lib/typing/getQuotes";

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
  const [openSettings, setOpenSettings] = useState(false);

  // Code
  const [codeData, setCodeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Typing
  const inputRef = useRef<HTMLInputElement>(null);
  const [userInput, setUserInput] = useState<string>("");
  const [isIdle, setIsIdle] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isClickingOnText, setIsClickingOnText] = useState(true);
  const [isFocused, setIsFocused] = useState<boolean>(true);

  // Time
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);

  // Stats
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [incorrectChars, setInCorrectChars] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);

  // Initial Code Snippet Fetch
  useEffect(() => {
    const fetchCodeSnippets = async () => {
      setIsLoading(true);

      const randomCode = await getCodeSnippets("any", "");
      setCodeData(randomCode[0]);
      setIsLoading(false);
    };
    fetchCodeSnippets();
  }, []);

  // Style Difficulty
  const styleDifficulty = (difficulty: string) => {
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
      const randomCode = await getCodeSnippets("any", "");
      setCodeData(randomCode[0]);
      resetTest();
    } catch (error) {
      console.error("Error fetching code snippet:", error);
    } finally {
      setIsLoading(false);
    }
  }, [resetTest]);

  // Debounced WPM calculation
  const debouncedWpmUpdate = useMemo(
    () =>
      debounce((inputLength: number, start: number) => {
        const timeElapsed = (Date.now() - start) / 60000;
        const words = inputLength > 0 ? Math.max(1, inputLength / 5) : 0; // Standard: 5 chars = 1 word
        startTransition(() => {
          setWpm(Math.round(words / timeElapsed));
        });
      }, 100),
    []
  );

  // Highlight code
  const highlightedCode = useMemo(() => {
    if (isLoading || !codeData?.code) {
      return <div className="text-gray-500">Loading code...</div>;
    }

    const codeContent = codeData.code;
    const inputLength = userInput.length;
    let currentLine = 1;
    let currentCharInLine = 0;

    return (
      <>
        {codeContent.split("\n").map((line, lineIndex) => (
          <div key={lineIndex} className="relative">
            {/* Line number */}
            <span className="absolute left-0 text-gray-600 select-none">
              {lineIndex + 1}
            </span>
            {/* Line content */}
            <div className="pl-8">
              {line.split("").map((char, charIndex) => {
                const absoluteIndex =
                  codeContent
                    .split("\n")
                    .slice(0, lineIndex)
                    .reduce((acc, cur) => acc + cur.length + 1, 0) + charIndex;

                const isCursor = absoluteIndex === inputLength;
                const isTyped = absoluteIndex < inputLength;
                const isCorrect = isTyped && userInput[absoluteIndex] === char;

                const className = isTyped
                  ? isCorrect
                    ? "text-white"
                    : "text-red-600/75 bg-red-900/30"
                  : "text-gray-500";

                const displayChar = char === " " ? "\u00A0" : char;

                return (
                  <span key={`${lineIndex}-${charIndex}`} className="relative">
                    {isCursor && (
                      <span
                        className={`absolute left-0 top-0 w-0.5 h-5 bg-blue-400 cursor-blink ${
                          isIdle ? "animate-pulse" : ""
                        }`}
                      />
                    )}
                    <span className={className}>{displayChar}</span>
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </>
    );
  }, [codeData, userInput, isIdle, isLoading]);

  // Input Change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("Called");
      const value = e.target.value;
      const currentTime = Date.now();

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
          // Character Counting
          let correct = 0;
          const minLength = Math.min(value.length, codeData.code.length);

          for (let i = 0; i < minLength; i++) {
            if (value[i] === codeData.code[i]) {
              correct++;
            } else {
              break;
            }
          }

          setCorrectChars(correct);
          setInCorrectChars(value.length - correct);
          setMistakes(value.length - correct);

          // Check completion
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

  // Replace your current handleKeyDown function with this:
  // Replace your current handleKeyDown function with this:
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && e.ctrlKey) {
        e.preventDefault();
        deletePreviousWord();
      }

      if (e.key === "Enter") {
        e.preventDefault();

        const codeContent = codeData?.code;
        if (!codeContent) return;

        // Find the current line's end
        const currentLineEndIndex =
          userInput.lastIndexOf("\n", currentIndex - 1) === -1
            ? userInput.length
            : userInput.lastIndexOf("\n", currentIndex - 1) + 1;

        // Append a real newline (\n) to the input
        let newInput = userInput + "\n";

        // Find the corresponding character in the codeData.code after the newline
        let newCursorIndex = currentIndex + 1; // Start by assuming just after the newline

        // Skip spaces on the *original* code line to find the correct indentation
        let originalCodeNextLineStart = codeContent.indexOf("\n", currentIndex);

        if (originalCodeNextLineStart !== -1) {
          originalCodeNextLineStart++; // Move past the newline character
          // Find the first non-space character on the next line of the original code
          while (
            originalCodeNextLineStart < codeContent.length &&
            codeContent[originalCodeNextLineStart] === " "
          ) {
            originalCodeNextLineStart++;
            newCursorIndex++; // Increment newCursorIndex for each space skipped
          }
        }

        setUserInput(newInput);
        setCurrentIndex(newCursorIndex); // Move cursor to the calculated position
        return;
      }
    },
    [deletePreviousWord, userInput, codeData, currentIndex] // Added currentIndex to dependencies
  );

  // Is Typing
  const handleTextClick = useCallback(() => {
    setIsClickingOnText(true);
    inputRef.current?.focus();
    // Reset the flag after a short delay to allow focus to complete
    setTimeout(() => setIsClickingOnText(false), 100);
  }, []);

  const handleInputBlur = useCallback(() => {
    // Don't blur if we're clicking on the text area
    if (!isClickingOnText) {
      setIsFocused(false);
    }
  }, [isClickingOnText]);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
    setIsClickingOnText(false);
  }, []);

  return (
    <div className=" md:pl-20  ">
      {!isLoading ? (
        <div>
          {!completed ? (
            <div className="px-1">
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
                  <p className="text-sm md:text-base mt-1 max-w-140">
                    {codeData?.description}
                  </p>
                </div>
              </div>
              <div className="overflow-auto mt-7 bg-gray-900/80 p-4 rounded-sm">
                <pre className="line-numbers">
                  <code className="text-sm md:text-base lg:text-lg">
                    {highlightedCode}
                  </code>
                </pre>
              </div>

              <div
                className="w-full h-screen fixed top-0 left-0 opacity-0 cursor-default"
                onClick={handleTextClick}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="absolute opacity-0 w-full h-full"
                  autoFocus
                  aria-hidden="true"
                />
              </div>
              <button
                className="mx-auto flex items-center justify-center mt-10 p-2 hover:text-blue-400 hover:bg-blue-950/30 rounded-sm text-gray-400 transition-colors"
                onClick={handleRefetch}
              >
                <RotateCcw className="mr-2 scale-90" />
                {isLoading ? "Loading..." : "New Code"}
              </button>
            </div>
          ) : (
            <div> Results </div>
          )}
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default CodeType;
