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
import { useWpm } from "@/app/context/WpmContext";

// Icons
import { RotateCcw, TriangleAlert, MousePointer, Pointer } from "lucide-react";

// Fonts
import { spaceMono } from "@/app/ui/fonts";

// Context
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

const Words = ({ sessionType = "multiple" }) => {
  const timerContext = useTimer();
  const time = timerContext?.time;
  const setTime = timerContext?.setTime;
  const remaining = timerContext?.remaining;
  const setRemaining = timerContext?.setRemaining;
  const isRunning = timerContext?.isRunning;
  const startTimer = timerContext?.startTimer;
  const resetTimer = timerContext?.resetTimer;
  const { showWpm } = useWpm();

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
  const [consecutiveMistakes, setConsecutiveMistakes] = useState(0);
  const [loading, setLoading] = useState(false);
  const MAX_CONSECUTIVE_MISTAKES = 5;

  // Stats
  const [endTime, setEndTime] = useState<number | null>(null);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [testId, setTestId] = useState(Date.now());
  const [isHoveringNewTexts, setIsHoveringNewTexts] = useState(false);
  const [isClickingOnText, setIsClickingOnText] = useState(false);

  // Scrolling state
  const [scrollOffset, setScrollOffset] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);

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

  // Calculate line height and container dimensions
  const LINE_HEIGHT = 48; // Adjust based on your text size (text-xl with leading-8 ≈ 48px)
  const VISIBLE_LINES = 3;
  const CONTAINER_HEIGHT = LINE_HEIGHT * VISIBLE_LINES;

  // Function to calculate which line a character position is on
  const calculateLineForPosition = useCallback(
    (position: number) => {
      if (!wordsRef.current || !randomWords) return 0;

      // Create a temporary element to measure text layout
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.visibility = "hidden";
      tempDiv.style.whiteSpace = "pre-wrap";
      tempDiv.style.wordWrap = "break-word";
      tempDiv.style.fontSize = window.getComputedStyle(
        wordsRef.current
      ).fontSize;
      tempDiv.style.fontFamily = window.getComputedStyle(
        wordsRef.current
      ).fontFamily;
      tempDiv.style.width = window.getComputedStyle(wordsRef.current).width;
      tempDiv.style.lineHeight = `${LINE_HEIGHT}px`;

      document.body.appendChild(tempDiv);

      // Add text up to the current position
      const textUpToPosition = randomWords.substring(0, position);
      tempDiv.textContent = textUpToPosition;

      const height = tempDiv.offsetHeight;
      const lineNumber = Math.floor(height / LINE_HEIGHT);

      document.body.removeChild(tempDiv);

      return lineNumber;
    },
    [randomWords, LINE_HEIGHT]
  );

  // Update scroll position based on current typing position
  const updateScrollPosition = useCallback(() => {
    const currentLine = calculateLineForPosition(userInput.length);

    // Start scrolling when we reach line 2 (0-indexed), so line 3 becomes the top line
    if (currentLine >= 2) {
      const shouldScrollToLine = currentLine - 1; // Keep cursor on second visible line
      const newScrollOffset = shouldScrollToLine * LINE_HEIGHT;
      setScrollOffset(newScrollOffset);
    } else {
      setScrollOffset(0);
    }

    setCurrentLine(currentLine);
  }, [userInput.length, calculateLineForPosition, LINE_HEIGHT]);

  // Update scroll position when user input changes
  useEffect(() => {
    if (userInput.length > 0) {
      updateScrollPosition();
    }
  }, [userInput, updateScrollPosition]);

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
    const randomContent = typeof randomWords === "string" ? randomWords : "";

    const words = randomContent.split(" ");
    const typedChars = userInput;
    let charIndex = 0; // Tracks global character index

    return words.map((word, wordIdx) => {
      const wordChars = word.split("");
      const isLastWord = wordIdx === words.length - 1;

      return (
        <span key={wordIdx} className="inline-block mr-1.5">
          {wordChars.map((char) => {
            const currentCharIndex = charIndex;
            charIndex++;

            const userChar = typedChars[currentCharIndex];
            const isTyped = currentCharIndex < typedChars.length;
            const isCorrect = userChar === char;
            const isCursor = currentCharIndex === typedChars.length;

            const className = isTyped
              ? isCorrect
                ? "text-white"
                : "text-red-600/75 bg-red-900/30"
              : "text-gray-500";

            const displayChar = char === " " ? "\u00A0" : char;

            return (
              <span key={currentCharIndex} className="relative">
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
          })}

          {/* Handle space between words */}
          {!isLastWord &&
            (() => {
              const spaceIndex = charIndex;
              charIndex++; // Count the space

              const isCursor = spaceIndex === typedChars.length;
              const userChar = typedChars[spaceIndex];
              const isCorrectSpace = userChar === " ";
              const isTyped = spaceIndex < typedChars.length;

              const spaceClassName = isTyped
                ? isCorrectSpace
                  ? "text-white"
                  : "text-red-600/75 bg-red-900/30"
                : "text-gray-500";

              return (
                <span className="relative" key={`space-${spaceIndex}`}>
                  {isCursor && (
                    <span
                      className={`absolute left-0 top-1 lg:top-[9px] w-0.5 h-6 bg-blue-400 cursor-blink ${
                        isIdle ? "animate-pulse" : ""
                      }`}
                    />
                  )}
                  <span className={spaceClassName}>&nbsp;</span>
                </span>
              );
            })()}
        </span>
      );
    });
  }, [randomWords, userInput, isIdle]);

  // Reset when timer stops - but only if we're not showing results
  useEffect(() => {
    if (
      !isRunning &&
      !completed &&
      (remaining === 0 || (time > 0 && remaining === 0))
    ) {
      // Timer finished, show results
      setCompleted(true);
      setEndTime(Date.now());
    }
  }, [time, isRunning, completed, remaining]);

  // Add more words dynamically
  useEffect(() => {
    if (
      typeof randomWords === "string" &&
      randomWords.split(" ").length - userInput.trim().split(" ").length <=
        10 &&
      !completed &&
      (time ?? 0) > 0
    ) {
      setRandomWords((prev) => prev + " " + generateWords(10));
    }
  }, [userInput, randomWords, completed, time, generateWords]);

  useEffect(() => {
    // This ensures our cursor position is always valid
    if (currentIndex > userInput.length) {
      setCurrentIndex(userInput.length);
    }
  }, [userInput, currentIndex]);

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
    setScrollOffset(0);
    setCurrentLine(0);
    setConsecutiveMistakes(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (resetTimer) {
      resetTimer();
    }
  }, [resetTimer]);

  // Load Next Random Words
  const loadNextRandomWords = useCallback(async () => {
    setRandomWords(generateWords());
    setUserInput("");
    setCurrentIndex(0);
    setCompleted(false);
    setStartTime(Date.now());
    setScrollOffset(0);
    setCurrentLine(0);
  }, [generateWords]);

  // Optimized input change handler
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const currentTime = Date.now();

      if (value === userInput) return;

      // Always allow deletion even with many mistakes
      if (value.length < userInput.length) {
        setUserInput(value);
        setCurrentIndex(value.length);
        setConsecutiveMistakes(0); // Reset on deletion
        return;
      }

      // Block typing if too many consecutive mistakes
      if (
        consecutiveMistakes >= MAX_CONSECUTIVE_MISTAKES &&
        value.length > userInput.length
      ) {
        return;
      }

      // Set idle state immediately
      setIsIdle(false);

      // Start timer on first input
      if (!startTime) {
        setStartTime(currentTime);
        if (startTimer) {
          startTimer();
        }
      }

      // Calculate if this was a mistake
      const isMistake =
        value.length > userInput.length &&
        value[value.length - 1] !== randomWords[value.length - 1];

      // Update consecutive mistakes count
      if (isMistake) {
        setConsecutiveMistakes((prev) => prev + 1);
      } else {
        setConsecutiveMistakes(0);
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
            }
          }

          setCorrectChars(correctFromStart);
          setIncorrectChars(value.length - correctFromStart);
          setMistakes(value.length - correctFromStart);

          // Check completion
          if (
            value.length === randomWords.length ||
            (time > 0 && remaining === 0)
          ) {
            setEndTime(currentTime);
            setCompleted(true);

            // Load next words if in timed mode with time remaining
            if ((time ?? 0) > 0 && (remaining ?? 0) > 0) {
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
      consecutiveMistakes,
      userInput,
    ]
  );

  const deletePreviousWord = useCallback(() => {
    let deleteTo = currentIndex - 1;
    // Find the start of the previous word
    while (deleteTo > 0 && userInput[deleteTo - 1] !== " ") {
      deleteTo--;
    }
    // Ensure we don't go negative
    deleteTo = Math.max(0, deleteTo);

    const newInput = userInput.substring(0, deleteTo);
    setUserInput(newInput);
    setCurrentIndex(deleteTo);
    setConsecutiveMistakes(0); // Reset consecutive mistakes when deleting
  }, [currentIndex, userInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        deletePreviousWord();
      }

      // Ensure the input stays focused only for word deletion
      if (e.key === "Backspace" && (e.ctrlKey || e.metaKey)) {
        e.stopPropagation();
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
    <div className="relative flex flex-col items-center -mt-5 sm:mt-17">
      {!completed && (time === -1 || (remaining ?? 0) > 0) ? (
        <div className="mt-12 sm:mt-0 flex flex-col relative">
          {showWpm && (
            <motion.div
              initial={{ y: -17, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -17, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="self-end p-5 sm:p-3 pr-0 my-2 bg-black/40 text-white  px-3 py-1 rounded-md font-mono shadow-lg backdrop-blur-sm"
            >
              {wpm} WPM
            </motion.div>
          )}

          {!isFocused &&
            !completed &&
            (time === -1 || (remaining ?? 0) > 0) &&
            !isHoveringNewTexts && (
              <div
                className="absolute w-full h-[30vh] bg-black/10 z-10 cursor-pointer mt-5"
                onClick={handleTextClick}
              >
                <div className="mx-auto flex flex-col sm:flex-row gap-2 items-center justify-center mt-14 p-2 text-blue-400 font-semibold text-lg md:text-xl text-center">
                  <Pointer className="block lg:hidden" />
                  <MousePointer className="hidden lg:block" />
                  <span>Click to focus and start typing</span>
                </div>
              </div>
            )}

          <div className="relative h-full w-full max-w-[900px] mx-auto">
            {/* Timer */}
            <div className="px-5 md:px-9 lg:px-0 mb-3 ml-1 lg:text-lg">
              {isRunning
                ? (remaining ?? 0) > 0
                  ? remaining
                  : ""
                : (time ?? 0) > 0
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
              className={`px-5 md:px-6 lg:px-0 relative text-xl lg:text-[1.7rem] text-center ${
                spaceMono.className
              } leading-relaxed mb-8 cursor-text px-2 
              transition-opacity duration-100 ease-in-out 
              ${!isFocused ? "blur-sm opacity-60" : "blur-0 opacity-100"}`}
              style={{ height: `${CONTAINER_HEIGHT}px` }}
              onClick={handleTextClick}
              onMouseDown={(e) => e.preventDefault()}
            >
              <div
                ref={containerRef}
                className="relative w-full h-full overflow-hidden"
              >
                <div
                  ref={wordsRef}
                  className="flex flex-wrap justify-center leading-relaxed transition-transform duration-200 ease-out"
                  style={{
                    transform: `translateY(-${scrollOffset}px)`,
                    lineHeight: `${LINE_HEIGHT}px`,
                  }}
                  onClick={() => inputRef.current?.focus()}
                >
                  {highlightedWords}
                </div>
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
              autoFocus
              className="absolute opacity-0 w-1 h-1 top-0 left-0"
              aria-hidden="true"
            />

            {/* Stats */}
            <div className="flex justify-between items-center -mt-14">
              <div className="text-lg font-semibold"></div>
            </div>
          </div>

          <div className="absolute -top-55 -right-4 -z-2 size-100 rounded-full bg-radial-[at_50%_50%] from-blue-500/20 to-black to-90%"></div>

          <button
            className="cursor-pointer mx-auto flex items-center justify-center mt-20 p-2 hover:text-blue-400 hover:bg-blue-950/30 rounded-sm text-gray-400 transition-colors"
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
        <div className="mt-30 sm:mt-4">
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
            sessionType={sessionType}
          />
        </div>
      )}
    </div>
  );
};

export default Words;
