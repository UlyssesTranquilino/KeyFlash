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
import Stats from "@/components/practice/Stats";

export function getRandomWords(length: number): string[] {
  const result = generate({ exactly: length });
  return Array.isArray(result) ? result : [result];
}

const Page = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Time
  const { testSeconds, testWords, testMode } = useTestMode();
  const [countDown, setCountDown] = useState(() => {
    if (testMode === "word") {
      return 180;
    }

    return testSeconds;
  });
  const [testTime, setTestTime] = useState(() => {
    if (testMode === "word") {
      return 180;
    }

    return testSeconds;
  });
  // Time Start End and Graph
  const [testStart, setTestStart] = useState(false);
  const [testEnd, setTestEnd] = useState(false);
  const [graphData, setGraphData] = useState<number[][]>([]);
  const [intervalId, setIntervalId] = useState(null);
  const [open, setOpen] = useState(false);

  // Correct and Incorrect Characters
  const [correctChars, setCorrectChars] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectChars, setIncorrectChar] = useState(0);
  const [extraChars, setExtraChars] = useState(0);

  const [initialRender, setInitialRender] = useState(false);
  const [wordsArray, setWordsArray] = useState(() => {
    if (testMode === "word") {
      return getRandomWords(testWords);
    }
    return getRandomWords(300);
  });

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

  // Create span refs
  const emptySpans = () => {
    return Array(wordsArray.length)
      .fill(0)
      .map((i) => createRef<HTMLSpanElement>());
  };

  const [wordsSpanRef, setWordsSpanRef] = useState(emptySpans());
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(0);

  // Start Timer
  const startTimer = () => {
    const invervalId = setInterval(timer, 1000);
    setIntervalId(intervalId);

    function timer() {
      setCountDown((prevCountDown) => {
        setCorrectChars((correctChars) => {
          setGraphData((data) => {
            return [
              ...data,
              [
                testTime - prevCountDown,
                Math.round(
                  correctChars / 5 / ((testTime - prevCountDown + 1) / 60)
                ),
              ],
            ];
          });
          return correctChars;
        });

        if (prevCountDown === 1) {
          setTestEnd(true);
          clearInterval(invervalId);
          return 0;
        }

        return prevCountDown - 1;
      });
    }
  };

  const resetTest = () => {
    setCurrCharIndex(0);
    setCurrWordIndex(0);
    setTestStart(false);
    setTestEnd(false);
    clearInterval(intervalId);

    if (testMode === "word") {
      setWordsArray(getRandomWords(testWords));
      setWordsSpanRef(emptySpans());
      setCountDown(180);
      setTestTime(180);
    } else {
      setWordsArray(getRandomWords(300));
      setWordsSpanRef(emptySpans());
      setCountDown(testSeconds);
      setTestTime(testSeconds);
    }
    setGraphData([]);
    setCorrectChars(0);
    setCorrectWords(0);
    setExtraChars(0);
    setIncorrectChar(0);
    resetWordSpanRefClassname();
    focusInput();
  };

  // Remove extra characters
  const resetWordSpanRefClassname = () => {
    wordsSpanRef.map((i) => {
      if (!i.current) return;
      Array.from(i.current.childNodes).map((j) => {
        if ((j as HTMLElement).className.includes("extra")) {
          (j as HTMLElement).remove();
        }
        (j as HTMLElement).className = "char";
      });
    });
    if (
      wordsSpanRef[0].current &&
      wordsSpanRef[0].current.childNodes[0] instanceof HTMLElement
    ) {
      (wordsSpanRef[0].current.childNodes[0] as HTMLElement).className =
        "char current";
    }
  };

  // Handle User Input
  const handleUserInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allCurrChars = wordsSpanRef[currWordIndex].current?.childNodes ?? [];

    if (!testStart) {
      startTimer();
      setTestStart(true);
    }

    // Space to next word
    if (e.keyCode === 32 && currCharIndex === allCurrChars.length) {
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

      //scrollinig line condition
      if (
        wordsSpanRef[currWordIndex + 1]?.current &&
        wordsSpanRef[currWordIndex]?.current &&
        wordsSpanRef[currWordIndex + 1].current !== null &&
        wordsSpanRef[currWordIndex].current !== null
      ) {
        if (
          wordsSpanRef[currWordIndex + 1].current!.offsetLeft <
          wordsSpanRef[currWordIndex].current!.offsetLeft
        ) {
          wordsSpanRef[currWordIndex].current!.scrollIntoView();
        }
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

  // Calculate WPM
  const calculateWPM = () => {
    return Math.round(
      correctChars / 5 / ((graphData[graphData.length - 1][0] + 1) / 60)
    );
  };

  // Calculate Accuracy
  const calculateAccuracy = () => {
    return Math.round((correctWords / currWordIndex) * 100);
  };

  useLayoutEffect(() => {
    if (initialRender) {
      resetTest();
    } else {
      setInitialRender(true);
    }
  }, [testSeconds, testWords, testMode]);
  // 3:41:57
  return (
    <div
      className={`h-screen font-mono ${spaceMono.className} text-gray-500 pt-20`}
    >
      <UpperMenu countDown={countDown} />
      {testEnd ? (
        <Stats
          wpm={calculateWPM()}
          accuracy={calculateAccuracy()}
          correctChars={correctChars}
          incorrectChars={incorrectChars}
          extraChars={extraChars}
          graphData={graphData}
          resetTest={resetTest}
        />
      ) : (
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
      )}

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
