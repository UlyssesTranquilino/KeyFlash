"use client";
import { useState, useRef, useEffect } from "react";

const paragraph =
  "Want to improve your typing speed and have some fun?  In this beginner-friendly tutorial, we'll guide you through building your own Typing Speed Test Game App using React JS!   No prior React experience needed!  We'll break down everything step-by-step, from setting up the project to tracking your WPM (Words Per Minute), CPM (Characters Per Minute), Mistakes and Time Left.   Get ready to challenge yourself and level up your typing skills!";

const page = () => {
  const maxTime = 60;
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [mistakes, setMistakes] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);

  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const charRefs = useRef<any>([]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const characters = charRefs.current;
    let currentChar = charRefs.current[charIndex];
    let typedChar = e.target.value.slice(-1);
    if (charIndex < characters.length && timeLeft > 0) {
      if (!isTyping) {
        setIsTyping(true);
      }

      if (typedChar === currentChar.textContent) {
        setCharIndex(charIndex + 1);
      } else {
        setCharIndex(charIndex + 1);
        setMistakes(mistakes + 1);
      }
    }
  };
  return (
    <div>
      <div>
        <input
          type="text"
          className="input-field"
          ref={inputRef}
          onChange={handleChange}
        />
        {paragraph.split("").map((char, index) => (
          <span className="char" ref={(e) => (charRefs.current[index] = e)}>
            {char}
          </span>
        ))}
      </div>

      <div className="mt-10">
        <p>Time: {timeLeft}</p>
        <p>Mistakes: {mistakes}</p>
        <p> WPM: {wpm}</p>
        <p>CPM: {cpm}</p>
      </div>
    </div>
  );
};

export default page;
