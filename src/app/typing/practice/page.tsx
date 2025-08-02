"use client";
import React, {
  createRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { generate } from "random-words";
import "../../../css/typing.css";
import { spaceMono } from "@/app/ui/fonts";
import UpperMenu from "@/components/practice/UpperMenu";
import { useTestMode } from "@/context/TestModeContext";

export function getRandomWords(length: number): string[] {
  const result = generate({ exactly: length });
  return Array.isArray(result) ? result : [result];
}

const Page = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input element on load and add cursor on the first word
  useEffect(() => {
    focusInput();
    const firstWordNode = wordsSpanRef[0].current?.childNodes[0];
    if (firstWordNode && firstWordNode instanceof HTMLElement) {
      firstWordNode.className = "current";
    }
  }, []);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const [wordsArray, setWordsArray] = useState(() => getRandomWords(200));

  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(0);

  // Create span refs
  const wordsSpanRef = useMemo(() => {
    return Array(wordsArray.length)
      .fill(0)
      .map(() => createRef<HTMLSpanElement>());
  }, [wordsArray]);

  const { testTime } = useTestMode();

  // Handle User Input
  const handleUserInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allCurrChars = wordsSpanRef[currWordIndex].current?.childNodes ?? [];

    // Space
    if (e.keyCode === 32) {
      // Logic for space

      if (allCurrChars.length <= currCharIndex) {
        // Removing cursor from last place in a word
        (allCurrChars[currCharIndex - 1] as HTMLElement).classList.remove(
          "current-right"
        );
      } else {
        // Removing cursor from in between of the word
        (allCurrChars[currCharIndex] as HTMLElement).classList.remove(
          "current"
        );
      }

      const nextWordNode =
        wordsSpanRef[currWordIndex + 1].current?.childNodes[0];
      if (nextWordNode && nextWordNode instanceof HTMLElement) {
        nextWordNode.className = "current";
      }
      setCurrWordIndex(currWordIndex + 1);
      setCurrCharIndex(0);
      return;
    }

    // Backspace
    if (e.keyCode === 8) {
      // Logic for backspace

      // Avoid backspace to previous word
      if (currCharIndex !== 0) {
        // Last character of word
        if (allCurrChars.length === currCharIndex) {
          if (
            (allCurrChars[currCharIndex - 1] as HTMLElement).className.includes(
              "extra"
            )
          ) {
            (allCurrChars[currCharIndex - 1] as HTMLElement).remove();
            (allCurrChars[currCharIndex - 2] as HTMLElement).className +=
              " current-right";
          } else {
            (allCurrChars[currCharIndex - 1] as HTMLElement).className =
              "current";
          }
          setCurrCharIndex(currCharIndex - 1);
          return;
        }

        (allCurrChars[currCharIndex] as HTMLElement).className = "";
        (allCurrChars[currCharIndex - 1] as HTMLElement).className = "current";
        setCurrCharIndex(currCharIndex - 1);
      }

      return;
    }

    if (currCharIndex === allCurrChars.length) {
      const newSpan = document.createElement("span");
      newSpan.innerText = e.key;
      newSpan.className = "incorrect extra current-right";
      (allCurrChars[currCharIndex - 1] as HTMLElement).classList.remove(
        "current-right"
      );

      wordsSpanRef[currWordIndex].current?.append(newSpan);

      setCurrCharIndex(currCharIndex + 1);
      return;
    }

    const currCharNode = allCurrChars[currCharIndex] as HTMLElement;
    if (e.key === currCharNode.innerText) {
      currCharNode.className = "correct";
    } else {
      currCharNode.className = "incorrect";
    }

    if (currCharIndex + 1 === allCurrChars.length) {
      const nextCharNodeRight = allCurrChars[currCharIndex] as HTMLElement;
      if (nextCharNodeRight) {
        nextCharNodeRight.className += " current-right";
      }
    } else {
      const nextCharNode = allCurrChars[currCharIndex + 1] as HTMLElement;
      if (nextCharNode) {
        nextCharNode.className = "current";
      }
    }
    setCurrCharIndex(currCharIndex + 1);
  };

  // 3:41:57
  return (
    <div
      className={`h-screen font-mono ${spaceMono.className} text-gray-500 pt-20`}
    >
      <UpperMenu countDown={testTime} />
      <div className="type-box" onClick={focusInput}>
        <div className="words">
          {wordsArray.map((word, index) => (
            <span key={index} className="word" ref={wordsSpanRef[index]}>
              {word.split("").map((char, index) => (
                <span key={char + index}>{char}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <input
        type="text"
        ref={inputRef}
        onKeyDown={handleUserInput}
        className="hidden-input"
      />
    </div>
  );
};

export default Page;
