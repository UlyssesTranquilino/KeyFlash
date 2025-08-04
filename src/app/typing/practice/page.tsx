"use client";
import React, {
  createRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
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
  const timerRef = useRef<number>();
  const animationFrameRef = useRef<number>();

  // Time
  const { testSeconds, testWords, testMode } = useTestMode();
  const [countDown, setCountDown] = useState(() => {
    return testMode === "word" ? 180 : testSeconds;
  });
  const [testTime, setTestTime] = useState(() => {
    return testMode === "word" ? 180 : testSeconds;
  });

  // Test state
  const [testStart, setTestStart] = useState(false);
  const [testEnd, setTestEnd] = useState(false);
  const [graphData, setGraphData] = useState<number[][]>([]);
  const [open, setOpen] = useState(false);

  // Stats
  const [correctChars, setCorrectChars] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectChars, setIncorrectChar] = useState(0);
  const [extraChars, setExtraChars] = useState(0);

  const [initialRender, setInitialRender] = useState(false);
  const [wordsArray, setWordsArray] = useState(() => {
    return testMode === "word"
      ? getRandomWords(Math.min(testWords, 100))
      : getRandomWords(100);
  });

  // Create span refs
  const wordsSpanRef = useMemo(() => {
    return Array(wordsArray.length)
      .fill(0)
      .map(() => createRef<HTMLSpanElement>());
  }, [wordsArray.length]);

  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(0);

  // Focus input and set initial cursor
  useEffect(() => {
    focusInput();
    const firstWordNode = wordsSpanRef[0]?.current?.childNodes[0];
    if (firstWordNode && firstWordNode instanceof HTMLElement) {
      firstWordNode.className = "current";
    }
  }, [wordsSpanRef]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Timer using requestAnimationFrame
  const startTimer = useCallback(() => {
    const startTime = Date.now();
    const duration = testTime * 1000;

    const updateTimer = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setCountDown(Math.ceil(remaining / 1000));

      // Update graph every 5 seconds
      if (Math.floor(elapsed / 1000) % 5 === 0) {
        setGraphData((data) => {
          const timeElapsed = testTime - Math.ceil(remaining / 1000);
          return [
            ...data,
            [
              timeElapsed,
              Math.round(correctChars / 5 / ((timeElapsed + 1) / 60)),
            ],
          ];
        });
      }

      if (remaining > 0) {
        animationFrameRef.current = requestAnimationFrame(updateTimer);
      } else {
        setTestEnd(true);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, [testTime, correctChars]);

  const resetTest = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setCurrCharIndex(0);
    setCurrWordIndex(0);
    setTestStart(false);
    setTestEnd(false);
    setGraphData([]);
    setCorrectChars(0);
    setCorrectWords(0);
    setExtraChars(0);
    setIncorrectChar(0);

    const newWords =
      testMode === "word"
        ? getRandomWords(Math.min(testWords, 100))
        : getRandomWords(100);

    setWordsArray(newWords);
    setCountDown(testMode === "word" ? 180 : testSeconds);
    setTestTime(testMode === "word" ? 180 : testSeconds);

    // Reset word classes
    requestAnimationFrame(() => {
      wordsSpanRef.forEach((wordRef) => {
        if (!wordRef.current) return;
        Array.from(wordRef.current.childNodes).forEach((charNode) => {
          if ((charNode as HTMLElement).className.includes("extra")) {
            (charNode as HTMLElement).remove();
          }
          (charNode as HTMLElement).className = "char";
        });
      });

      if (wordsSpanRef[0]?.current?.childNodes[0] instanceof HTMLElement) {
        (wordsSpanRef[0].current.childNodes[0] as HTMLElement).className =
          "char current";
      }
    });

    focusInput();
  }, [testMode, testWords, testSeconds, wordsSpanRef, focusInput]);

  // Handle User Input
  const handleUserInput = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const allCurrChars =
        wordsSpanRef[currWordIndex]?.current?.childNodes ?? [];

      if (!testStart) {
        startTimer();
        setTestStart(true);
      }

      // Space to next word
      if (e.keyCode === 32 && currCharIndex === allCurrChars.length) {
        if (allCurrChars.length <= currCharIndex) {
          (allCurrChars[currCharIndex - 1] as HTMLElement)?.classList?.remove(
            "current-right"
          );
        } else {
          (allCurrChars[currCharIndex] as HTMLElement)?.classList?.remove(
            "current"
          );
        }

        // Scrolling logic
        requestAnimationFrame(() => {
          if (
            wordsSpanRef[currWordIndex + 1]?.current &&
            wordsSpanRef[currWordIndex]?.current &&
            wordsSpanRef[currWordIndex + 1].current!.offsetLeft <
              wordsSpanRef[currWordIndex].current!.offsetLeft
          ) {
            wordsSpanRef[currWordIndex].current!.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }
        });

        const nextWordNode =
          wordsSpanRef[currWordIndex + 1]?.current?.childNodes[0];
        if (nextWordNode && nextWordNode instanceof HTMLElement) {
          nextWordNode.className = "current";
        }

        setCurrWordIndex((prev) => prev + 1);
        setCurrCharIndex(0);
        return;
      }

      // Backspace
      if (e.keyCode === 8) {
        if (currCharIndex !== 0) {
          if (allCurrChars.length === currCharIndex) {
            if (
              (
                allCurrChars[currCharIndex - 1] as HTMLElement
              )?.className?.includes("extra")
            ) {
              (allCurrChars[currCharIndex - 1] as HTMLElement).remove();
              (allCurrChars[currCharIndex - 2] as HTMLElement).className +=
                " current-right";
            } else {
              (allCurrChars[currCharIndex - 1] as HTMLElement).className =
                "current";
            }
            setCurrCharIndex((prev) => prev - 1);
            return;
          }

          (allCurrChars[currCharIndex] as HTMLElement).className = "";
          (allCurrChars[currCharIndex - 1] as HTMLElement).className =
            "current";
          setCurrCharIndex((prev) => prev - 1);
        }
        return;
      }

      if (currCharIndex === allCurrChars.length) {
        const newSpan = document.createElement("span");
        newSpan.innerText = e.key;
        newSpan.className = "incorrect extra current-right";
        (allCurrChars[currCharIndex - 1] as HTMLElement)?.classList?.remove(
          "current-right"
        );

        wordsSpanRef[currWordIndex].current?.append(newSpan);
        setCurrCharIndex((prev) => prev + 1);
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
      setCurrCharIndex((prev) => prev + 1);
    },
    [currWordIndex, currCharIndex, testStart, wordsSpanRef, startTimer]
  );

  // Calculate WPM
  const calculateWPM = useCallback(() => {
    return Math.round(
      correctChars / 5 / ((graphData[graphData.length - 1]?.[0] + 1) / 60) || 0
    );
  }, [correctChars, graphData]);

  // Calculate Accuracy
  const calculateAccuracy = useCallback(() => {
    return currWordIndex > 0
      ? Math.round((correctWords / currWordIndex) * 100)
      : 0;
  }, [correctWords, currWordIndex]);

  useLayoutEffect(() => {
    if (initialRender) {
      resetTest();
    } else {
      setInitialRender(true);
    }
  }, [testSeconds, testWords, testMode, resetTest]);

  return (
    <div className={`font-mono ${spaceMono.className} text-gray-500 pt-20`}>
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
                {word.split("").map((char, charIndex) => (
                  <span key={`${index}-${charIndex}`}>{char}</span>
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
