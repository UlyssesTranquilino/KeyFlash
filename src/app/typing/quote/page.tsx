"use client";

import { useEffect, useState, useRef } from "react";
import { getRandomQuotes } from "../../../../utils/typing/getRandomQuotes";

import { Quote } from "@/types/quote";

// Fonts
import { spaceMono } from "@/app/ui/fonts";

// Icons
import { RotateCcw } from "lucide-react";

// Context
import { useQuote } from "@/app/context/QuoteContext";
import { useTimer } from "@/app/context/TimerContext";

const QuoteType = () => {
  // Contexts
  const { quote, setQuote } = useQuote();
  const { time, setTime, remaining, isRunning, startTimer, resetTimer } =
    useTimer();

  const [author, setAuthor] = useState("");
  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isIdle, setIsIdle] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      resetTest();
    };
    fetchQuotes();
  }, []);

  const [loading, setLoading] = useState(false);

  const handleRefetch = async () => {
    setLoading(true);
    const randomQuote = await getRandomQuotes();
    setQuote(randomQuote);
    setAuthor(randomQuote?.author || "");
    resetTest();
    setLoading(false);
  };

  const resetTest = () => {
    setUserInput("");
    setCurrentIndex(0);
    setStartTime(null);
    setWpm(0);
    setIsIdle(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    resetTimer();
  };

  const loadNextQuote = async () => {
    const randomQuote = await getRandomQuotes();
    setQuote(randomQuote);
    setAuthor(randomQuote?.author || "");
    setUserInput("");
    setCurrentIndex(0);
    setStartTime(Date.now()); // Keep timing the session
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Mark as active
    setIsIdle(false);

    if (!startTime) {
      setStartTime(Date.now());
      startTimer();
    }

    setUserInput(value);

    if (startTime && quote?.content) {
      const timeElapsed = (Date.now() - startTime) / 60000;
      const wordsTyped = value.trim().split(/\s+/).length;
      setWpm(Math.round(wordsTyped / timeElapsed));
    }

    setCurrentIndex(value.length);

    if (quote?.content && value === quote.content && remaining > 0) {
      // Automatically load next quote
      loadNextQuote();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " && quote?.content[currentIndex] !== " ") {
      e.preventDefault();
    }

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

    return (
      <div className="whitespace-pre-wrap">
        {quote.content.split("").map((char, index) => {
          let className = "inline-block ";

          if (index >= userInput.length) {
            className += "text-gray-500";
          } else if (char === userInput[index]) {
            className += "text-blue-100";
          } else {
            className += "text-red-700/80";
          }

          // Add fixed width to maintain layout
          className += " w-3 lg:w-4 text-center";

          // Only render cursor at current position
          if (index === currentIndex) {
            return (
              <span key={index} className="relative">
                <span className={className}>{char}</span>
                <span
                  className={`absolute top-0 left-0 w-0.5 h-7 bg-cyan-400 ${
                    isIdle
                      ? showCursor
                        ? "opacity-100"
                        : "opacity-0"
                      : "opacity-100"
                  }`}
                  style={{ marginLeft: "-1px" }}
                />
              </span>
            );
          }

          return (
            <span key={index} className={className}>
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}

        {/* Only show end cursor if we're actually at the end */}
        {currentIndex === quote.content.length && currentIndex !== 0 && (
          <span
            className={`inline-block w-0.5 h-7 bg-cyan-400 align-middle ${
              isIdle
                ? showCursor
                  ? "opacity-100"
                  : "opacity-0"
                : "opacity-100"
            }`}
          />
        )}
      </div>
    );
  };

  return (
    <div className="mt-22 relative">
      <div className="h-70 sm:h-50 w-full max-w-[800px] mx-auto px-5">
        {/* Timer */}
        <div className="px-1 mb-3">{remaining}</div>

        {/* Display the quote with color highlighting and cursor */}
        <div
          className={`text-xl lg:text-2xl text-center ${spaceMono.className} leading-8 mb-8 min-h-[120px] cursor-default`}
          onClick={() => inputRef.current?.focus()}
        >
          {renderQuoteWithHighlighting()}
        </div>

        {/* Invisible input field for typing */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="absolute opacity-0 w-0 h-0"
          autoFocus
          aria-hidden="true"
        />

        {/* Stats and author */}
        <div className="flex justify-between items-center">
          {/* WPM: {wpm} */}
          <div className="text-lg font-semibold"></div>
          <p className="text-sm lg:text-base italic text-right text-gray-500">
            — {quote?.author}
          </p>
        </div>
      </div>

      <div className="absolute -top-55 -right-4 -z-2 size-100 rounded-full bg-radial-[at_50%_50%] from-blue-500/20  to-black to-90%"></div>

      <button
        className="mx-auto flex items-center justify-center mt-4 p-2 hover:text-cyan-400 text-gray-400 transition-colors"
        onClick={handleRefetch}
        disabled={loading}
      >
        <RotateCcw className="mr-2 scale-90" />
        {loading ? "Loading..." : "New Quote"}
      </button>
    </div>
  );
};

export default QuoteType;
