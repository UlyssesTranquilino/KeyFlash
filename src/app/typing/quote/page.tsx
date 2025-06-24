"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { getRandomQuotes } from "../../../../utils/typing/getRandomQuotes";

import { Quote } from "@/types/quote";

// Fonts
import { spaceMono } from "@/app/ui/fonts";

// Icons
import { RotateCcw, TriangleAlert } from "lucide-react";

// Context
import { useQuote } from "@/app/context/QuoteContext";

import Results from "@/components/ui/typing/Results";

const QuoteType = () => {
  // Contexts
  const { quote, setQuote } = useQuote();

  const [author, setAuthor] = useState("");
  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isIdle, setIsIdle] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [completed, setCompleted] = useState(false);

  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  // Stats
  const [endTime, setEndTime] = useState<number | null>(null);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);

  // Check if Caps Lock is on
  useEffect(() => {
    const handleKeyEvent = (event: KeyboardEvent) => {
      if (event.getModifierState) {
        const isOn = event.getModifierState("CapsLock");
        setIsCapsLockOn(isOn);
      }
    };

    window.addEventListener("keydown", handleKeyEvent);
    window.addEventListener("keyup", handleKeyEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyEvent);
      window.removeEventListener("keyup", handleKeyEvent);
    };
  }, []);

  // Handle idle state and cursor blinking
  useEffect(() => {
    const handleActivity = () => {
      setIsIdle(false);

      // Reset idle timer
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }

      idleTimeoutRef.current = setTimeout(() => {
        setIsIdle(true);
      }, 1000); // 1 second of inactivity = idle
    };

    // Cursor blinking effect (only when idle)
    const cursorInterval = setInterval(() => {
      if (isIdle) {
        setShowCursor((prev) => !prev);
      } else {
        setShowCursor(true); // Always show when active
      }
    }, 500);

    return () => {
      clearInterval(cursorInterval);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [isIdle]);

  // Fetching Quotes on initial load
  useEffect(() => {
    const fetchQuotes = async () => {
      const randomQuote = await getRandomQuotes();
      setQuote(randomQuote);
      // Don't call resetTest() here - let the initial state handle it
    };
    fetchQuotes();
  }, []); // Empty dependency array for initial load only

  const [loading, setLoading] = useState(false);

  const handleRefetch = async () => {
    setLoading(true);
    const randomQuote = await getRandomQuotes();
    setQuote(randomQuote);
    setAuthor(randomQuote?.author || "");
    resetTest();
    setLoading(false);
  };

  const handleReType = (quoteData: any) => {
    setQuote(quoteData);
    setAuthor(quoteData.author || "");
    resetTest();
  };

  const resetTest = () => {
    setUserInput("");
    setCurrentIndex(0);
    setStartTime(null);
    setWpm(0);
    setIsIdle(true);
    setCompleted(false);
    setCorrectChars(0);
    setIncorrectChars(0);
    setMistakes(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const loadNextQuote = async () => {
    const randomQuote = await getRandomQuotes();
    setQuote(randomQuote);
    setAuthor(randomQuote?.author || "");
    setUserInput("");
    setCurrentIndex(0);
    setCompleted(false);
    setStartTime(Date.now()); // Keep timing the session
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Mark as active
    setIsIdle(false);

    if (!startTime) {
      setStartTime(Date.now());
    }

    // Calculate accuracy metrics
    if (quote?.content) {
      let correct = 0;
      let incorrect = 0;

      // Count correct characters from the beginning
      let correctFromStart = 0;
      for (let i = 0; i < Math.min(value.length, quote.content.length); i++) {
        if (value[i] === quote.content[i]) {
          correctFromStart++;
        } else {
          break;
        }
      }

      correct = correctFromStart;
      incorrect = value.length - correctFromStart;

      setCorrectChars(correct);
      setIncorrectChars(incorrect);
      setMistakes(incorrect);
    }

    setUserInput(value);

    if (startTime && quote?.content) {
      const timeElapsed = (Date.now() - startTime) / 60000;
      const wordsTyped = value.trim().split(/\s+/).length;
      setWpm(Math.round(wordsTyped / timeElapsed));
    }

    setCurrentIndex(value.length);

    // Check completion - user must type the exact quote
    if (quote?.content && value.length === quote.content.length) {
      setEndTime(Date.now());
      setCompleted(true);

      // Only load next quote if in timed mode with time remaining
      // if (time > 0 && remaining > 0) {
      //   loadNextQuote();
      //   setCompleted(false); // Reset for next quote
      // }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Ctrl+Backspace - delete previous word
    if (e.key === "Backspace" && e.ctrlKey) {
      e.preventDefault();
      deletePreviousWord();
    }
  };

  const deletePreviousWord = () => {
    // Find the last word boundary (space or start of input)
    let deleteTo = currentIndex - 1;
    while (deleteTo > 0 && userInput[deleteTo - 1] !== " ") {
      deleteTo--;
    }

    const newInput = userInput.substring(0, deleteTo);
    setUserInput(newInput);
    setCurrentIndex(deleteTo);
  };

  const renderQuoteWithHighlighting = () => {
    if (!quote?.content) return null;

    // Split the quote into words
    const words = quote.content
      .split(/(\s+)/)
      .filter((word) => word.length > 0);
    const userChars = userInput.split("");
    let currentCharIndex = 0;
    const elements = [];

    for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
      const word = words[wordIndex];
      const wordChars = word.split("");
      const wordElements = [];

      for (let charIndex = 0; charIndex < wordChars.length; charIndex++) {
        const char = wordChars[charIndex];
        let className = "text-gray-500";

        if (currentCharIndex < userChars.length) {
          className =
            userChars[currentCharIndex] === char
              ? "text-white"
              : "text-red-600/75 bg-red-900/30";
        }

        const isCursor = currentCharIndex === userInput.length;

        wordElements.push(
          <span key={`${wordIndex}-${charIndex}`} className="inline">
            {isCursor && (
              <span
                className={`inline-block w-0.5 h-6 bg-cyan-400 align-middle ml-[-2px] ${
                  isIdle
                    ? showCursor
                      ? "opacity-100"
                      : "opacity-0"
                    : "opacity-100"
                }`}
              />
            )}
            <span className={className}>{char === " " ? "\u00A0" : char}</span>
          </span>
        );

        currentCharIndex++;
      }

      // Wrap the entire word in a span that won't break
      elements.push(
        <span key={`word-${wordIndex}`} className="whitespace-nowrap">
          {wordElements}
        </span>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-x-1 leading-relaxed text-left">
        {elements}
      </div>
    );
  };

  return (
    <div className="mt-22 relative ">
      {/* Show typing interface if:
        - Time is infinite (-1) AND not completed OR
        - Time is set AND remaining time > 0
    */}
      {!completed ? (
        <div>
          <div className="relative h-70 sm:h-50 lg:h-60 w-full max-w-[900px] mx-auto ">
            {isCapsLockOn && (
              <motion.div
                initial={{ y: -17, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -17, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 text-cyan-400 drop-shadow-[0_0_1px_#22d3ee]"
              >
                <TriangleAlert className="scale-90" />
                <h1 className="text-center text-sm md:text-base">
                  Caps Lock On
                </h1>
              </motion.div>
            )}

            {/* Display the quote with color highlighting and cursor */}
            <motion.div
              key={quote?.content} // triggers re-animation when the quote changes
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`relative text-xl lg:text-[1.7rem] text-center ${spaceMono.className} leading-8 mb-8 h-[160px] sm:h-[200px] cursor-text overflow-hidden`}
              onClick={() => inputRef.current?.focus()}
            >
              {renderQuoteWithHighlighting()}
            </motion.div>

            {/* Hidden input field for capturing keystrokes */}
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="absolute opacity-0 w-0 h-0 pointer-events-none"
              autoFocus
              aria-hidden="true"
            />

            {/* Stats and author */}
            <div className="flex justify-between items-center -mt-14">
              {/* WPM: {wpm} */}
              <div className="text-lg font-semibold"></div>
              <p className="text-sm lg:text-base italic text-right text-gray-500">
                — {quote?.author}
              </p>
            </div>
          </div>

          <div className="absolute -top-55 -right-4 -z-2 size-100 rounded-full bg-radial-[at_50%_50%] from-blue-500/20  to-black to-90%"></div>

          <button
            className="mx-auto flex items-center justify-center mt-4 p-2 hover:text-blue-400 hover:bg-blue-950/30 rounded-sm text-gray-400 transition-colors"
            onClick={handleRefetch}
            disabled={loading}
          >
            <RotateCcw className="mr-2 scale-90" />
            {loading ? "Loading..." : "New Quote"}
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
          totalChars={quote?.content?.length || 0}
          quote={quote?.content || ""}
          author={quote?.author || ""}
          mistakes={mistakes}
          handleRefetch={loadNextQuote}
          handleRetype={handleReType}
        />
      )}
    </div>
  );
};

export default QuoteType;
