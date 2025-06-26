"use client";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  startTransition,
} from "react";
import { motion } from "framer-motion";

// Icons
import { RotateCcw, TriangleAlert, MousePointer } from "lucide-react";

// Fonts
import { spaceMono } from "@/app/ui/fonts";

// Context
import { useQuote } from "@/app/context/QuoteContext";
import { useTimer } from "@/app/context/TimerContext";

// Components
import Results from "@/components/ui/typing/Results";

// Utils
import { getRandomWords } from "../../../../utils/typing/getRandomWords";

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

const Words = () => {
  const {
    time,
    setTime,
    remaining,
    setRemaining,
    isRunning,
    startTimer,
    resetTimer,
  } = useTimer();

  const [userInput, setUserInput] = useState("");
  const [isFocused, setIsFocused] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [isIdle, setIsIdle] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [completed, setCompleted] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [loading, setLoading] = useState(false);

  // Stats
  const [endTime, setEndTime] = useState<number | null>(null);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [testId, setTestId] = useState(Date.now());
  const [isHoveringNewTexts, setIsHoveringNewTexts] = useState(false);
  const [isClickingOnText, setIsClickingOnText] = useState(false);

  // Auto-focus when not focused
  useEffect(() => {
    if (!isFocused && !completed) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isFocused, completed]);

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

  // Simplified idle detection
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

  // Generate Words
  const generateWords = useCallback(
    (count = 25) => getRandomWords(Math.floor(Math.random() * count) + 10),
    []
  );

  // Memoized initial words
  const memoizedRandomWords = useMemo(
    () => generateWords(),
    [testId, generateWords]
  );
  const [randomWords, setRandomWords] = useState<string>(memoizedRandomWords);

  // Debounced WPM calculation
  const debouncedWpmUpdate = useMemo(
    () =>
      debounce((inputLength: number, start: number) => {
        const timeElapsed = (Date.now() - start) / 60000;
        const words = inputLength > 0 ? Math.max(1, inputLength / 5) : 0;
        startTransition(() => {
          setWpm(Math.round(words / timeElapsed));
        });
      }, 100),
    []
  );

  // Optimized words highlighting with memoization
  const highlightedWords = useMemo(() => {
    if (!randomWords) return null;

    const inputLength = userInput.length;

    return randomWords.split("").map((char, index) => {
      let className = "text-gray-500"; // default

      if (index < inputLength) {
        className =
          userInput[index] === char
            ? "text-white"
            : "text-red-600/75 bg-red-900/30";
      }

      const isCursor = index === inputLength;
      const displayChar = char === " " ? "\u00A0" : char;

      return (
        <span key={index} className="relative">
          {isCursor && (
            <span
              className={`absolute left-0 top-1 lg:top-[9px] w-0.5 h-6 bg-blue-400 cursor-blink ${
                isIdle ? "animate-pulse" : ""
              }`}
            />
          )}
          <span className={className}>{displayChar}</span>
        </span>
      );
    });
  }, [randomWords, userInput, isIdle]);

  // Reset when timer stops
  useEffect(() => {
    if (!isRunning) {
      resetTest();
      setRandomWords(generateWords());
    }
  }, [time, isRunning, generateWords]);

  // Add more words dynamically
  useEffect(() => {
    if (
      typeof randomWords === "string" &&
      randomWords.split(" ").length - userInput.trim().split(" ").length <=
        10 &&
      !completed &&
      time > 0
    ) {
      setRandomWords((prev) => prev + " " + generateWords(10));
    }
  }, [userInput, randomWords, completed, time, generateWords]);

  const resetTest = useCallback(() => {
    setUserInput("");
    setCurrentIndex(0);
    setStartTime(null);
    setWpm(0);
    setIsIdle(true);
    setCompleted(false);
    setCorrectChars(0);
    setIncorrectChars(0);
    setMistakes(0);
    setTestId(Date.now());
    if (inputRef.current) {
      inputRef.current.focus();
    }
    resetTimer();
  }, [resetTimer]);

  // Load Next Random Words
  const loadNextRandomWords = useCallback(async () => {
    setRandomWords(generateWords());
    setUserInput("");
    setCurrentIndex(0);
    setCompleted(false);
    setStartTime(Date.now());
  }, [generateWords]);

  // Optimized input change handler
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const currentTime = Date.now();

      // Set idle state immediately
      setIsIdle(false);

      // Start timer on first input
      if (!startTime) {
        setStartTime(currentTime);
        startTimer();
      }

      // Update input immediately (high priority)
      setUserInput(value);
      setCurrentIndex(value.length);

      // Batch non-critical updates
      startTransition(() => {
        if (randomWords) {
          // Optimized character counting
          let correctFromStart = 0;
          const minLength = Math.min(value.length, randomWords.length);

          for (let i = 0; i < minLength; i++) {
            if (value[i] === randomWords[i]) {
              correctFromStart++;
            } else {
              break;
            }
          }

          setCorrectChars(correctFromStart);
          setIncorrectChars(value.length - correctFromStart);
          setMistakes(value.length - correctFromStart);

          // Check completion
          if (
            value.length === randomWords.length &&
            correctFromStart === randomWords.length
          ) {
            setEndTime(currentTime);
            setCompleted(true);

            // Load next words if in timed mode with time remaining
            if (time > 0 && remaining > 0) {
              loadNextRandomWords();
              setCompleted(false);
            }
          }
        }

        // Update WPM with debouncing
        if (startTime && value.length > 0) {
          debouncedWpmUpdate(value.length, startTime);
        }
      });
    },
    [
      randomWords,
      startTime,
      startTimer,
      time,
      remaining,
      loadNextRandomWords,
      debouncedWpmUpdate,
    ]
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
    setLoading(true);
    setRandomWords(generateWords());
    resetTest();
    setLoading(false);
  }, [generateWords, resetTest]);

  const handleReType = useCallback(
    (prevTexts: string) => {
      setLoading(true);
      setRandomWords(prevTexts);
      resetTest();
      setLoading(false);
    },
    [resetTest]
  );

  // Auto-refocus during running timer
  useEffect(() => {
    if (!isFocused && isRunning) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isFocused, isRunning]);

  return (
    <div className="mt-22 relative">
      {(!completed && (time === -1 || remaining > 0)) ||
      (time > 0 && remaining > 0) ? (
        <div>
          {!isFocused &&
            !completed &&
            (time === -1 || remaining > 0) &&
            !isHoveringNewTexts && (
              <div
                className="absolute w-full h-[30vh] bg-black/10 z-10 cursor-pointer"
                onClick={handleTextClick}
              >
                <div className="w-100 mx-auto flex items-center justify-center mt-14 p-2 text-blue-400 font-semibold text-xl">
                  <MousePointer className="mr-2" /> Click to focus and start
                  typing
                </div>
              </div>
            )}

          <div className="relative h-full w-full max-w-[900px] mx-auto">
            {/* Timer */}
            <div className=" px-5 md:px-9 lg:px-0  mb-3 ml-1 lg:text-lg">
              {isRunning
                ? remaining > 0
                  ? remaining
                  : ""
                : time > 0
                ? time
                : ""}
            </div>

            {isCapsLockOn && (
              <motion.div
                initial={{ y: -17, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -17, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 text-blue-400 drop-shadow-[0_0_1px_#22d3ee]"
              >
                <TriangleAlert className="scale-90" />
                <h1 className="text-center text-sm md:text-base">
                  Caps Lock On
                </h1>
              </motion.div>
            )}

            {/* Display the words with color highlighting and cursor */}
            <motion.div
              key={testId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`px-5 md:px-10 lg:px-0 relative text-xl lg:text-[1.7rem] text-center ${
                spaceMono.className
              } leading-8 mb-8 h-auto cursor-text overflow-y-auto px-2 
                transition-opacity duration-100 ease-in-out 
                ${!isFocused ? "blur-sm opacity-60" : "blur-0 opacity-100"}`}
              onClick={handleTextClick}
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className="flex flex-wrap justify-center leading-relaxed">
                {highlightedWords}
              </div>
            </motion.div>

            {/* Hidden input field for capturing keystrokes */}
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

            {/* Stats */}
            <div className="flex justify-between items-center -mt-14">
              <div className="text-lg font-semibold"></div>
            </div>
          </div>

          <div className="absolute -top-55 -right-4 -z-2 size-100 rounded-full bg-radial-[at_50%_50%] from-blue-500/20 to-black to-90%"></div>

          <button
            className="mx-auto flex items-center justify-center mt-14 p-2 hover:text-blue-400 hover:bg-blue-950/30 rounded-sm text-gray-400 transition-colors"
            onClick={handleRestart}
            disabled={loading}
            onMouseEnter={() => setIsHoveringNewTexts(true)}
            onMouseLeave={() => setIsHoveringNewTexts(false)}
          >
            <RotateCcw className="mr-2 scale-90" />
            {loading ? "Loading..." : "New Texts"}
          </button>
        </div>
      ) : (
        <Results
          wpm={wpm}
          startTime={startTime}
          endTime={endTime || Date.now()}
          accuracy={(correctChars / (correctChars + incorrectChars)) * 100}
          correctChars={correctChars}
          incorrectChars={incorrectChars}
          totalChars={correctChars + incorrectChars}
          quote={randomWords || ""}
          author={""}
          mistakes={mistakes}
          handleRefetch={handleRestart}
          handleRetype={handleReType}
        />
      )}
    </div>
  );
};

export default Words;
