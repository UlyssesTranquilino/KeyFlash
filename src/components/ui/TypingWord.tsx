// TypingWord.tsx
"use client";

import React, { memo, Fragment } from "react";
import { Character } from "./Character";

const TypingWord = memo(({ word, typedInput, isCurrent }) => {
  const chars = word.split("");
  const typedChars = typedInput.split("");
  const wordRef = React.useRef(null);

  return (
    <span ref={wordRef} className="typing-word inline-block mr-2 relative">
      <span className="typed-word">
        {typedChars.map((char, charIndex) => (
          <Character
            key={charIndex}
            char={char}
            expectedChar={chars[charIndex]}
            isCurrent={isCurrent && charIndex === typedInput.length - 1}
          />
        ))}
      </span>
      {chars.slice(typedChars.length).map((char, charIndex) => (
        <span key={typedChars.length + charIndex} className={`text-gray-500`}>
          {char}
        </span>
      ))}
      {/* Placeholder for overflowed characters */}
      {typedChars.length > chars.length &&
        typedChars.slice(chars.length).map((char, charIndex) => (
          <span
            key={`extra-${charIndex}`}
            className="text-red-600/75 bg-red-900/30"
          >
            {char}
          </span>
        ))}
    </span>
  );
});

export default TypingWord;
