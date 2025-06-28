"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  startTransition,
  useMemo,
} from "react";

import { RotateCcw } from "lucide-react";

// Mock C++ code data for testing
const mockCodeData = {
  title: "Two Sum",
  description:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  difficulty: "easy",
  label: "Arrays",
  language: "C++",
  time_complexity: "O(n)",
  space_complexity: "O(n)",
  code: "vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> map;\n    for (int i = 0; i < nums.size(); ++i) {\n        int complement = target - nums[i];\n        if (map.count(complement)) {\n            return { map[complement], i };\n        }\n        map[nums[i]] = i;\n    }\n    return {};\n}",
};

// Debounce utility
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const CodeType = () => {
  // Code
  const [codeData, setCodeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Typing
  const inputRef = useRef(null);
  const [userInput, setUserInput] = useState("");
  const [isIdle, setIsIdle] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClickingOnText, setIsClickingOnText] = useState(true);
  const [isFocused, setIsFocused] = useState(true);

  // Time
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [completed, setCompleted] = useState(false);

  // Stats
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setInCorrectChars] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wpm, setWpm] = useState(0);

  // Initial Code Snippet Fetch
  useEffect(() => {
    const fetchCodeSnippets = async () => {
      setIsLoading(true);
      // Using mock data for testing
      setTimeout(() => {
        setCodeData(mockCodeData);
        setIsLoading(false);
      }, 500);
    };
    fetchCodeSnippets();
  }, []);

  // Style Difficulty
  const styleDifficulty = (difficulty) => {
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
      setTimeout(() => {
        setCodeData(mockCodeData);
        resetTest();
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching code snippet:", error);
      setIsLoading(false);
    }
  }, [resetTest]);

  // Debounced WPM calculation
  const debouncedWpmUpdate = useMemo(
    () =>
      debounce((inputLength, start) => {
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

    console.log("Code content:", JSON.stringify(codeContent));
    console.log("User input:", JSON.stringify(userInput));
    console.log("Input length:", inputLength);

    return (
      <>
        {codeContent.split("\n").map((line, lineIndex) => (
          <div key={lineIndex} className="relative min-h-[1.5rem]">
            {/* Line number */}
            <span className="absolute left-0 text-gray-600 select-none w-8 text-right pr-2">
              {lineIndex + 1}
            </span>
            {/* Line content */}
            <div className="pl-10">
              {line.length === 0 ? (
                // Handle empty lines
                <span className="text-gray-500">&nbsp;</span>
              ) : (
                line.split("").map((char, charIndex) => {
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
                          className={`absolute left-0 top-0 w-0.5 h-5 bg-blue-400 z-10 ${
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
    (e) => {
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
          if (
            value.length === codeData.code.length &&
            value === codeData.code
          ) {
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
    (e) => {
      if (e.key === "Backspace" && e.ctrlKey) {
        e.preventDefault();
        deletePreviousWord();
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        // Handle tab as 4 spaces or however your code is formatted
        const codeContent = codeData?.code;
        if (!codeContent) return;

        const nextCharIndex = userInput.length;
        if (nextCharIndex < codeContent.length) {
          // Add spaces until we match the expected indentation
          let newInput = userInput;
          let newIndex = nextCharIndex;

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
          JSON.stringify(codeContent[nextCharIndex])
        );

        if (
          nextCharIndex < codeContent.length &&
          codeContent[nextCharIndex] === "\n"
        ) {
          // We're at a newline position, so add the newline
          let newInput = userInput + "\n";
          let newIndex = nextCharIndex + 1;

          // Now add any spaces that should follow the newline
          while (
            newIndex < codeContent.length &&
            codeContent[newIndex] === " "
          ) {
            newInput += " ";
            newIndex++;
          }

          console.log("New input after Enter:", JSON.stringify(newInput));
          setUserInput(newInput);
          setCurrentIndex(newIndex);
        }
        return;
      }
    },
    [deletePreviousWord, userInput, codeData]
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
    <div className="lg:pl-20 bg-gray-950 text-white min-h-screen">
      {!isLoading ? (
        <div>
          {!completed ? (
            <div className="px-4 py-6">
              {/* Stats Bar */}
              <div className="flex items-center justify-between mb-6 text-sm bg-gray-900/50 p-4 rounded-lg">
                <div className="flex items-center gap-6">
                  <div>
                    WPM: <span className="text-blue-400 font-mono">{wpm}</span>
                  </div>
                  <div>
                    Accuracy:{" "}
                    <span className="text-green-400 font-mono">
                      {correctChars > 0
                        ? Math.round(
                            (correctChars / (correctChars + incorrectChars)) *
                              100
                          )
                        : 100}
                      %
                    </span>
                  </div>
                  <div>
                    Errors:{" "}
                    <span className="text-red-400 font-mono">{mistakes}</span>
                  </div>
                </div>
                <div className="text-gray-400 font-mono">
                  {userInput.length} / {codeData?.code?.length || 0}
                </div>
              </div>

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

              {/* Code Display */}
              <div className="overflow-auto mt-7 bg-gray-900/80 p-6 rounded-lg border border-gray-700">
                <pre className="line-numbers">
                  <code className="text-sm md:text-base lg:text-lg font-mono leading-relaxed">
                    {highlightedCode}
                  </code>
                </pre>
              </div>

              {/* Hidden Input */}
              <div
                className="w-full h-screen fixed top-0 left-0 opacity-0 cursor-text z-50"
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

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  className="flex items-center justify-center p-3 hover:text-blue-400 hover:bg-blue-950/30 rounded-lg text-gray-400 transition-colors border border-gray-600"
                  onClick={handleRefetch}
                  disabled={isLoading}
                >
                  <RotateCcw className="mr-2 w-4 h-4" />
                  {isLoading ? "Loading..." : "New Code"}
                </button>

                <button
                  className="flex items-center justify-center p-3 hover:text-green-400 hover:bg-green-950/30 rounded-lg text-gray-400 transition-colors border border-gray-600"
                  onClick={resetTest}
                >
                  Reset
                </button>
              </div>

              {/* Focus indicator */}
              {!isFocused && (
                <div className="fixed top-4 right-4 bg-yellow-600 text-black px-3 py-1 rounded text-sm">
                  Click to focus and start typing
                </div>
              )}

              {/* Debug info */}
              <div className="mt-4 text-xs text-gray-500 font-mono">
                <div>
                  Next expected char: "
                  {codeData?.code?.[userInput.length] || "END"}" (code:{" "}
                  {codeData?.code?.charCodeAt(userInput.length) || "N/A"})
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 text-green-400">
                  Completed!
                </h2>
                <div className="text-xl mb-4">
                  Final WPM: <span className="text-blue-400">{wpm}</span>
                </div>
                <div className="text-xl mb-4">
                  Accuracy:{" "}
                  <span className="text-green-400">
                    {Math.round(
                      (correctChars / (correctChars + incorrectChars)) * 100
                    )}
                    %
                  </span>
                </div>
                <button
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
                  onClick={resetTest}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-gray-400">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default CodeType;
