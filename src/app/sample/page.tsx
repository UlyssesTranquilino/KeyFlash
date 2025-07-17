"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  startTransition,
  useMemo,
} from "react";
import React from "react";
import { TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";
import { spaceMono } from "../ui/fonts";

const paragraph =
  "Want to improve your typing speed and have some fun?  In this beginner-friendly tutorial, we'll Want to improve your typing speed and have some fun?  In this beginner-friendly tutorial, we'll Want to improve your typing speed and have some fun?  In this beginner-friendly tutorial, we'll Want to improve your typing speed and have some fun?  In this beginner-friendly tutorial, we'll Want to improve your typing speed and have some fun?  In this beginner-friendly tutorial, we'll Want to improve your typing speed and have some fun?  In this beginner-friendly tutorial, we'll Want to improve your typing speed and have some fun?  In this beginner-friendly tutorial, we'll Want to improve your typing speed and have some fun?  In this beginner-friendly tutorial, we'llWant to improve your typing speed and have some fun?  In this beginner-friendly tutorial, we'llWant to improve your typing speed and have some fun?  In this beginner-friendly tutorial, we'llWant to improve your typing speed and have some fun?  In this beginner-friendly tutorial, we'llWant to improve your typing speed and have some fun?  In this beginner-friendly tutorial, we'llWant to improve your typing speed and have some fun?  In this beginner-friendly tutorial, we'llWant to improve your typing speed and have some fun?  In this beginner-friendly tutorial, we'llWant to improve your typing speed and have some fun?  In this beginner-friendly tutorial, we'll guide you through building your own Typing Speed Test Game App using React JS!   No prior React experience needed!  We'll break down everything step-by-step, from setting up the project to tracking your WPM (Words Per Minute), CPM (Characters Per Minute), Mistakes and Time Left.   Get ready to challenge yourself and level up your typing skills!";

const CopyStandardTyping = () => {
  const maxTime = 60;
  const [timeLeft, setTimeLeft] = useState(maxTime);

  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const [correctWrong, setCorrectWrong] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [wpm, setWpm] = useState<number>(0);
  const [cpm, setCpm] = useState<number>(0);

  // Ref
  const inputRef = useRef<HTMLInputElement>(null);
  const charRefs = useRef<any>([]);

  // Button
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      setCorrectWrong(Array(charRefs.current.length).fill(""));
    }
  }, []);

  useEffect(() => {
    let interval: any;

    if (isTyping && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);

        let correctChars = charIndex - mistakes;
        let totalTime = maxTime - timeLeft;

        let cpm = correctChars * (60 / totalTime);
        cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
        setCpm(Math.round(cpm));

        let wpm = Math.round((correctChars / 5 / totalTime) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        setWpm(wpm);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsTyping(false);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isTyping, timeLeft]);

  const handleChange = (e: any) => {
    const characters = charRefs.current;
    let currentChar = charRefs.current[charIndex];
    let typedChar = e.target.value.slice(-1);
    if (charIndex < characters.length && timeLeft > 0) {
      if (!isTyping) {
        setIsTyping(true);
      }

      if (typedChar === currentChar.textContent) {
        setCharIndex(charIndex + 1);
        correctWrong[charIndex] = "correct";
      } else {
        setCharIndex(charIndex + 1);
        setMistakes(mistakes + 1);
        correctWrong[charIndex] = "wrong";
      }

      if (charIndex === characters.length - 1) {
        setIsTyping(false);
      }
    } else {
      setIsTyping(false);
    }
  };

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

  return (
    <div className="mt-10 relative flex flex-col items-center justify-center max-w-[1100px] mx-auto">
      <div>
        {isCapsLockOn && (
          <motion.div
            initial={{ y: -17, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -17, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 text-blue-400 drop-shadow-[0_0_1px_#22d3ee]"
          >
            <TriangleAlert className="scale-90" />
            <h1 className="text-center text-sm md:text-base">Caps Lock On</h1>
          </motion.div>
        )}

        <input
          type="text"
          className="input-field"
          ref={inputRef}
          onChange={handleChange}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {paragraph.split("").map((char, index) => (
            <span
              key={char + index.toString()}
              className={`char text-xl lg:text-[1.7rem] text-center text-gray-500 leading-normal ${
                spaceMono.className
              }  ${index === charIndex ? "active" : ""} ${correctWrong[index]}`}
              ref={(e) => {
                charRefs.current[index] = e;
              }}
            >
              {char}
            </span>
          ))}
        </motion.div>
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

export default CopyStandardTyping;
