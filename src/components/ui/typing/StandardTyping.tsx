"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  startTransition,
  useMemo,
} from "react";
import Results from "./Results";
import { motion } from "framer-motion";
import { spaceMono } from "@/app/ui/fonts";
import { RotateCcw, TriangleAlert, MousePointer, Pointer } from "lucide-react";
// Context
import { useWpm } from "@/app/context/WpmContext";
import { useEditText } from "@/app/context/AddTextContext";

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

const StandardTyping = ({ text }) => {
  const { showWpm } = useWpm();
  const { setOpenAddText } = useEditText();

  const [userInput, setUserInput] = useState("");
  const [isFocused, setIsFocused] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [isIdle, setIsIdle] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const textDisplayRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [completed, setCompleted] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [textData, setTextData] = useState(text);

  // Stats
  const [endTime, setEndTime] = useState<number | null>(null);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [testId, setTestId] = useState(Date.now());
  const [isHoveringNewTexts, setIsHoveringNewTexts] = useState(false);
  const [isClickingOnText, setIsClickingOnText] = useState(false);

  // Auto-scroll to cursor
  const scrollToCursor = useCallback(() => {
    if (cursorRef.current && textDisplayRef.current) {
      const cursor = cursorRef.current;
      const container = textDisplayRef.current;

      // Get cursor position relative to container
      const cursorRect = cursor.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Calculate if cursor is out of view
      const cursorTop =
        cursorRect.top - containerRect.top + container.scrollTop;
      const cursorBottom = cursorTop + cursorRect.height;

      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;
      const scrollBottom = scrollTop + containerHeight;

      // Scroll if cursor is above or below visible area
      if (cursorTop < scrollTop + 100) {
        // Cursor is above visible area
        container.scrollTop = Math.max(0, cursorTop - 100);
      } else if (cursorBottom > scrollBottom - 100) {
        // Cursor is below visible area
        container.scrollTop = cursorBottom - containerHeight + 100;
      }
    }
  }, []);

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

  // Scroll to cursor when user input changes
  useEffect(() => {
    if (userInput.length > 0) {
      // Use requestAnimationFrame to ensure DOM updates are complete
      requestAnimationFrame(() => {
        scrollToCursor();
      });
    }
  }, [userInput, scrollToCursor]);

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

  // Reset Test
  const resetTest = useCallback(() => {
    // Clear any pending debounce
    if (debouncedWpmUpdate.cancel) debouncedWpmUpdate.cancel();

    setUserInput("");
    setCurrentIndex(0);
    setStartTime(null);
    setWpm(0);
    setIsIdle(true);
    setCompleted(false);
    setCorrectChars(0);
    setIncorrectChars(0);
    setMistakes(0);
    setEndTime(null);
    setTestId(Date.now());

    // Reset scroll position
    if (textDisplayRef.current) {
      textDisplayRef.current.scrollTop = 0;
    }

    inputRef.current?.focus();
  }, [debouncedWpmUpdate]);

  // Highlighting Text
  const highlightedText = useMemo(() => {
    if (!textData) return null;

    const lines = textData.split("\n");
    const userInputChars = userInput.split("");
    let charIndex = 0;

    return lines.map((line, lineIndex) => {
      // Add a space at the end of the line (except last line)
      if (lineIndex < lines.length - 1) {
        line += "\n";
      }

      const words = line.split(" ");
      const lineElements = [];

      words.forEach((word, wordIndex) => {
        const wordChars = word.split("");

        // Word characters
        const wordSpans = wordChars.map((char) => {
          const currentCharIndex = charIndex++;
          const isCursor = currentCharIndex === userInput.length;
          const displayChar = char === " " ? "\u00A0" : char;

          let className = "text-gray-500";
          if (currentCharIndex < userInput.length) {
            className =
              userInput[currentCharIndex] === char
                ? "text-white"
                : "text-red-600/75 bg-red-900/30";
          }

          return (
            <span key={currentCharIndex} className="relative">
              {isCursor && (
                <span
                  ref={cursorRef}
                  className={`absolute left-0 top-1 lg:top-[9px] w-0.5 h-6 bg-blue-400 cursor-blink ${
                    isIdle ? "animate-pulse" : ""
                  }`}
                />
              )}
              <span className={className}>{displayChar}</span>
            </span>
          );
        });

        // Space after word (if not last)
        if (wordIndex < words.length - 1) {
          const spaceIndex = charIndex++;
          wordSpans.push(
            <span className="relative" key={`space-${spaceIndex}`}>
              {spaceIndex === userInput.length && (
                <span
                  ref={cursorRef}
                  className={`absolute left-0 top-1 lg:top-[9px] w-0.5 h-6 bg-blue-400 cursor-blink ${
                    isIdle ? "animate-pulse" : ""
                  }`}
                />
              )}
              <span
                className={
                  spaceIndex < userInput.length
                    ? userInput[spaceIndex] === " "
                      ? "text-white"
                      : "text-red-600/75 bg-red-900/30"
                    : "text-gray-500"
                }
              >
                &nbsp;
              </span>
            </span>
          );
        }

        lineElements.push(
          <span
            key={`${lineIndex}-${wordIndex}`}
            className="inline-block mr-1.5"
          >
            {wordSpans}
          </span>
        );
      });

      return (
        <div key={lineIndex} className="w-full">
          {lineElements}
        </div>
      );
    });
  }, [textData, userInput, isIdle]);

  const handleRefetch = useCallback(async () => {
    setLoading(true);
    setTextData("Upload again"); // Use context's setQuote
    resetTest();
    setLoading(false);

    setWpm(0);
    console.log("Refetch WPM: ", wpm);
  }, [setTextData, resetTest]);

  const handleReType = useCallback(
    (text: string) => {
      setTextData(text);
      resetTest();

      setWpm(0);
    },
    [setTextData, resetTest]
  );

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
      }

      // Update input immediately (high priority)
      setUserInput(value);
      setCurrentIndex(value.length);

      // Batch non-critical updates
      startTransition(() => {
        if (textData) {
          // Optimized character counting
          let correct = 0;
          const minLength = Math.min(value.length, textData.length);

          for (let i = 0; i < minLength; i++) {
            if (value[i] === textData[i]) {
              correct++;
            } else {
              break;
            }
          }

          setCorrectChars(correct);
          setIncorrectChars(value.length - correct);
          setMistakes(value.length - correct);

          // Check completion
          if (value.length === textData.length) {
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
    [textData, startTime, debouncedWpmUpdate]
  );

  const deletePreviousWord = useCallback(() => {
    let deleteTo = currentIndex - 1;
    while (deleteTo > 0 && userInput[deleteTo - 1] !== " ") deleteTo--;
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
    <div className="mt-10 relative flex flex-col items-center justify-center ">
      {!completed ? (
        <div className="mt-0 sm:mt-10 flex flex-col relative w-full ">
          {showWpm && (
            <motion.div
              initial={{ y: -17, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -17, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="self-end -top-15 absolute p-5 sm:p-3 pr-0 my-2 bg-black/40 text-white text-sm md:text-base px-3 py-1 rounded-md font-mono shadow-lg backdrop-blur-sm"
            >
              {userInput.length == 0 ? 0 : wpm} WPM
            </motion.div>
          )}

          {/* Overlay */}
          {!isFocused && !completed && !isHoveringNewTexts && (
            <div
              className="absolute w-full h-[30vh] bg-black/10 z-10 cursor-pointer mt-5"
              onClick={handleTextClick}
            >
              <div className="mx-auto flex flex-col sm:flex-row gap-2 items-center justify-center mt-14 p-2 text-blue-400 font-semibold  text-lg md:text-xl text-center">
                <Pointer className="block lg:hidden" />{" "}
                <MousePointer className=" hidden lg:block" />{" "}
                <span>Click to focus and start typing</span>
              </div>
            </div>
          )}

          <div className="relative  w-full max-w-[900px] mx-auto">
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

            <motion.div
              key={testId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              ref={textDisplayRef}
              className={`px-5 md:px-10 lg:px-0 relative text-xl lg:text-[1.6rem] text-center transition-opacity duration-100 ${
                spaceMono.className
              } leading-10 mb-8 max-h-[50vh] overflow-y-auto overflow-x-hidden scroll-smooth
 ${!isFocused ? "blur-sm opacity-60" : "blur-0 opacty-100"}`}
              onClick={handleTextClick}
              onMouseDown={(e) => e.preventDefault()} // Prevent text selection interfering with focus
            >
              <div className="whitespace-pre-wrap break-words font-mono text-left">
                {highlightedText}
              </div>
            </motion.div>

            <textarea
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

          <div className="absolute -top-55 -right-4 -z-2 size-100 rounded-full bg-radial-[at_50%_50%] from-blue-500/20 to-black to-90%"></div>

          <button
            className="mx-auto flex items-center justify-center mt-4 p-2 hover:text-blue-400 hover:bg-blue-950/30 rounded-sm text-gray-400 transition-colors"
            onClick={() => handleReType(textData)}
            disabled={loading}
            onMouseEnter={() => setIsHoveringNewTexts(true)}
            onMouseLeave={() => setIsHoveringNewTexts(false)}
          >
            <RotateCcw className="mr-2 scale-90" />
            {loading ? "Loading..." : "Reset"}
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
          totalChars={textData.length || 0}
          quote={textData || ""}
          author={""}
          mistakes={mistakes}
          handleRefetch={() => setOpenAddText(true)}
          handleRetype={handleReType}
        />
      )}
    </div>
  );
};

export default StandardTyping;
