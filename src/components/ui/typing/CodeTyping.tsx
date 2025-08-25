"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import Results from "@/components/ui/typing/Results";
import { useWpm } from "@/app/context/WpmContext";

// Memoize debounce utility
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number,
) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

interface CodeTypingProps {
  text: string;
  title?: string;
  description?: string;
  difficulty?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  sessionType?: string; // Optional, for future use
}

const CodeTyping: React.FC<CodeTypingProps> = ({
  text,
  title = "Custom Code",
  description = "Practice typing this code snippet",
  difficulty = "Medium",
  timeComplexity = "O(n)",
  spaceComplexity = "O(1)",
  sessionType = "multiple",
}) => {
  // Context
  const { showWpm } = useWpm();

  // Refs
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // State
  const [userInput, setUserInput] = useState("");
  const [isIdle, setIsIdle] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState({
    correctChars: 0,
    incorrectChars: 0,
    mistakes: 0,
  });
  const [wpm, setWpm] = useState(0);

  // Memoized difficulty style
  const difficultyElement = useMemo(() => {
    const formattedDifficulty =
      difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const colorClasses =
      {
        Easy: "text-green-300",
        Medium: "text-orange-300",
        Hard: "text-red-300",
      }[formattedDifficulty] || "text-orange-300";

    return (
      <div
        className={`bg-gray-900 ${colorClasses} px-2 w-auto flex items-center justify-center text-sm rounded-full p-1`}
      >
        {formattedDifficulty}
      </div>
    );
  }, [difficulty]);

  // Reset Text
  const resetTest = useCallback(() => {
    setUserInput("");
    setStartTime(null);
    setWpm(0);
    setIsIdle(true);
    setCompleted(false);
    setStats({ correctChars: 0, incorrectChars: 0, mistakes: 0 });
    inputRef.current?.focus();
  }, []);

  // Debounced WPM calculation
  const debouncedWpmUpdate = useMemo(
    () =>
      debounce((inputLength: number, start: number) => {
        const timeElapsed = (Date.now() - start) / 60000;
        const words = inputLength > 0 ? Math.max(1, inputLength / 5) : 0;
        setWpm(Math.round(words / timeElapsed));
      }, 100),
    [],
  );

  // Precompute line lengths for absolute index calculation
  const lineLengths = useMemo(() => {
    return text.split("\n").map((line) => line.length);
  }, [text]);

  // Highlight code
  const highlightedCode = useMemo(() => {
    if (!text) {
      return <div className="text-gray-500">No code to display...</div>;
    }

    const inputLength = userInput.length;
    const lines = text.split("\n");

    return lines.map((line, lineIndex) => {
      const lineStartIndex =
        lineIndex === 0
          ? 0
          : lineLengths
              .slice(0, lineIndex)
              .reduce((sum, len) => sum + len + 1, 0);

      return (
        <div key={lineIndex} className="relative min-h-[1.5rem]">
          <span className="absolute left-0 text-gray-700 select-none w-8 text-right pr-2">
            {lineIndex + 1}
          </span>
          <div className="pl-10">
            {line.length === 0 ? (
              <span className="text-gray-500">&nbsp;</span>
            ) : (
              line.split("").map((char, charIndex) => {
                const absoluteIndex = lineStartIndex + charIndex;
                const isCursor = absoluteIndex === inputLength;
                const isTyped = absoluteIndex < inputLength;
                const isCorrect = isTyped && userInput[absoluteIndex] === char;

                const className = isTyped
                  ? isCorrect
                    ? "text-white bg-green-900/20"
                    : "text-red-400 bg-red-900/30"
                  : "text-gray-500";

                const displayChar = char === " " ? "\u00A0" : char;

                return (
                  <span key={`${lineIndex}-${charIndex}`} className="relative">
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
              })
            )}
            {inputLength === lineStartIndex + line.length && (
              <span className="relative">
                <span
                  className={`absolute left-0 top-0 w-0.5 h-5 bg-blue-400 z-10 ${
                    isIdle ? "animate-pulse" : "animate-pulse"
                  }`}
                />
              </span>
            )}
          </div>
        </div>
      );
    });
  }, [text, userInput, isIdle, lineLengths]);

  // Input Change with character tracking
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const currentTime = Date.now();

      setIsIdle(false);

      if (!startTime) {
        setStartTime(currentTime);
      }

      setUserInput(value);

      // Character Counting
      let correct = 0;
      const minLength = Math.min(value.length, text.length);

      for (let i = 0; i < minLength; i++) {
        if (value[i] === text[i]) {
          correct++;
        } else {
          const incorrect = value.length - correct;
          setStats({
            correctChars: correct,
            incorrectChars: incorrect,
            mistakes: incorrect,
          });

          if (value.length === text.length) {
            setEndTime(currentTime);
            setCompleted(true);
          }

          if (startTime && value.length > 0) {
            debouncedWpmUpdate(value.length, startTime);
          }
          return;
        }
      }

      // Handle extra characters
      const incorrect =
        value.length > text.length ? value.length - text.length : 0;
      setStats({
        correctChars: correct,
        incorrectChars: incorrect,
        mistakes: incorrect,
      });

      if (value.length === text.length) {
        setEndTime(currentTime);
        setCompleted(true);
      }

      if (startTime && value.length > 0) {
        debouncedWpmUpdate(value.length, startTime);
      }
    },
    [text, startTime, debouncedWpmUpdate],
  );

  // Delete Previous Word
  const deletePreviousWord = useCallback(() => {
    let deleteTo = userInput.length - 1;
    while (deleteTo > 0 && userInput[deleteTo - 1] !== " ") deleteTo--;
    const newInput = userInput.substring(0, deleteTo);
    setUserInput(newInput);
  }, [userInput]);

  // Handle Key Down
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Backspace" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        deletePreviousWord();
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        let newInput = userInput;
        let newIndex = userInput.length;

        // Add spaces until we match the expected indentation
        while (newIndex < text.length && text[newIndex] === " ") {
          newInput += " ";
          newIndex++;
        }

        setUserInput(newInput);
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const nextCharIndex = userInput.length;

        if (
          nextCharIndex < text.length &&
          (text[nextCharIndex] === "\n" || text[nextCharIndex] === "")
        ) {
          let newInput = userInput + "\n";
          let newIndex = nextCharIndex + 1;

          // Automatically add indentation spaces
          while (newIndex < text.length && text[newIndex] === " ") {
            newInput += " ";
            newIndex++;
          }

          setUserInput(newInput);
          const syntheticEvent = {
            target: { value: newInput },
          } as React.ChangeEvent<HTMLTextAreaElement>;
          handleInputChange(syntheticEvent);
        }
      }
    },
    [deletePreviousWord, userInput, text, handleInputChange],
  );

  const handleInputFocus = useCallback(() => setIsFocused(true), []);
  const handleInputBlur = useCallback(() => setIsFocused(false), []);

  return (
    <div className="lg:pl-20 text-white min-h-screen relative">
      {!completed ? (
        <div className="px-4 pb-6 relative">
          {showWpm && (
            <motion.div
              initial={{ y: -17, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -17, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute -top-16 z-10 right-0 self-end p-5 sm:p-3 pr-0 my-2 bg-black/40 text-white text-sm md:text-base px-3 py-1 rounded-md font-mono shadow-lg backdrop-blur-sm"
            >
              {userInput.length === 0 ? 0 : wpm} WPM
            </motion.div>
          )}
          <div className="relative overflow-auto mt-12 bg-black p-6 rounded-lg border border-gray-700/40">
            <pre className="line-numbers">
              <code className="md:text-lg lg:text-lg font-mono leading-relaxed">
                {highlightedCode}
              </code>
            </pre>

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

          <div className="flex items-center justify-center gap-3 sm:gap-14 md:gap-22 lg:gap-28 my-10">
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
        <div className="mt-16">
          <Results
            wpm={wpm}
            startTime={startTime}
            endTime={endTime || Date.now()}
            accuracy={
              (stats.correctChars /
                (stats.correctChars + stats.incorrectChars)) *
              100
            }
            correctChars={stats.correctChars}
            incorrectChars={stats.incorrectChars}
            totalChars={text.length}
            quote={text}
            author={"code"}
            mistakes={stats.mistakes}
            handleRefetch={() => {}}
            handleRetype={resetTest}
            sessionType={sessionType}
          />
        </div>
      )}
    </div>
  );
};

export default CodeTyping;
