"use client";

import React, { memo } from "react";

const TypingWord = memo(
  ({
    word,
    startIndex,
    userInput,
  }: {
    word: string;
    startIndex: number;
    userInput: string;
  }) => {
    const chars = word.split("");
    const elements = [];

    for (let i = 0; i < chars.length; i++) {
      const charIndex = startIndex + i;
      const userChar = userInput[charIndex];
      const isTyped = charIndex < userInput.length;
      const isCorrect = userChar === chars[i];
      const isCursor = charIndex === userInput.length;

      let className = isTyped
        ? isCorrect
          ? "text-white"
          : "text-red-600/75 bg-red-900/30"
        : "text-gray-500";

      elements.push(
        <span key={charIndex} className="relative">
          {isCursor && (
            <span className="absolute left-0 top-1 w-0.5 h-6 bg-blue-400 animate-pulse" />
          )}
          <span className={className}>{chars[i]}</span>
        </span>,
      );
    }
    return <span className="inline-block mr-1.5">{elements}</span>;
  },
);

export default TypingWord;
