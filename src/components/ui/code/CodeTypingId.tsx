"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import Results from "@/components/ui/typing/Results";
import { useWpm } from "@/app/context/WpmContext";

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

interface CodeTypingProps {
  code: string;
  title?: string;
  description?: string;
  language: string;
  difficulty?: string;
  time_complexity?: string;
  space_complexity?: string;
}

const CodeTypingId = ({ codeData }: { codeData: CodeTypingProps }) => {
  const text = codeData.code;
  const title = codeData.title;
  const description = codeData.description;
  const difficulty = codeData.difficulty;
  const time_complexity = codeData.time_complexity;
  const space_complexity = codeData.space_complexity;
  const language = codeData.language;

  // Typing state
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userInput, setUserInput] = useState("");
  const [isIdle, setIsIdle] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Debounced WPM calculation
  const debouncedWpmUpdate = useMemo(
    () =>
      debounce((inputLength: any, start: any) => {
        const timeElapsed = (Date.now() - start) / 60000;
        const words = inputLength > 0 ? Math.max(1, inputLength / 5) : 0;
        setWpm(Math.round(words / timeElapsed));
      }, 100),
    []
  );

  // Highlight code
  const highlightedCode = useMemo(() => {
    if (!text) {
      return <div className="text-gray-500">No code to display...</div>;
    }

    const inputLength = userInput.length;

    return (
      <>
        {text.split("\n").map((line: string, lineIndex: number) => (
          <div key={lineIndex} className="relative min-h-[1.5rem]">
            {/* Line number */}
            <span className="absolute left-0 text-gray-700 select-none w-8 text-right pr-2">
              {lineIndex + 1}
            </span>
            {/* Line content */}
            <div className="pl-10">
              {line.length === 0 ? (
                <span className="text-gray-500">&nbsp;</span>
              ) : (
                line.split("").map((char: string, charIndex: number) => {
                  let absoluteIndex = 0;
                  for (let i = 0; i < lineIndex; i++) {
                    absoluteIndex += text.split("\n")[i].length + 1;
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
              {/* Handle cursor at end of line */}
              {(() => {
                let lineEndIndex = 0;
                for (let i = 0; i <= lineIndex; i++) {
                  if (i < lineIndex) {
                    lineEndIndex += text.split("\n")[i].length + 1;
                  } else {
                    lineEndIndex += text.split("\n")[i].length;
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
  }, [text, userInput, isIdle]);

  // Input Change with character tracking
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const currentTime = Date.now();

      // Set idle state immediately
      setIsIdle(false);

      // Start timer on first input
      if (!startTime) {
        setStartTime(currentTime);
      }

      // Update input immediately
      setUserInput(value);
      setCurrentIndex(value.length);

      // Character Counting - count all correct characters from start
      let correct = 0;
      let incorrect = 0;
      const minLength = Math.min(value.length, text.length);

      for (let i = 0; i < minLength; i++) {
        if (value[i] === text[i]) {
          correct++;
        } else {
          incorrect = value.length - correct;
          break;
        }
      }

      // If we've typed more than the code length, all extra characters are incorrect
      if (value.length > text.length) {
        incorrect += value.length - text.length;
      }

      setCorrectChars(correct);
      setInCorrectChars(incorrect);
      setMistakes(incorrect);

      // Check completion - must match exactly
      if (value.length === text.length) {
        setEndTime(currentTime);
        setCompleted(true);
      }

      // Update WPM with debouncing
      if (startTime && value.length > 0) {
        debouncedWpmUpdate(value.length, startTime);
      }
    },
    [text, startTime, debouncedWpmUpdate]
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
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Backspace" && e.ctrlKey) {
        e.preventDefault();
        deletePreviousWord();
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        const nextCharIndex = userInput.length;
        if (nextCharIndex < text.length) {
          let newInput = userInput;
          let newIndex = nextCharIndex;

          // Add spaces until we match the expected indentation
          while (newIndex < text.length && text[newIndex] === " ") {
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
        const nextCharIndex = userInput.length;

        if (
          (nextCharIndex < text.length && text[nextCharIndex] === "\n") ||
          text[nextCharIndex] === ""
        ) {
          let newInput = userInput + "\n";
          let newIndex = nextCharIndex + 1;

          // Automatically add indentation spaces that follow the newline
          while (newIndex < text.length && text[newIndex] === " ") {
            newInput += " ";
            newIndex++;
          }

          // Update state with the new input and cursor position
          setUserInput(newInput);
          setCurrentIndex(newIndex);

          // Trigger input change handling
          const syntheticEvent = {
            target: { value: newInput },
          } as React.ChangeEvent<HTMLTextAreaElement>;
          handleInputChange(syntheticEvent);
        }
        return;
      }
    },
    [deletePreviousWord, userInput, text, handleInputChange]
  );

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return <div className="lg:pl-20 text-white min-h-screen relative"></div>;
};

export default CodeTypingId;
