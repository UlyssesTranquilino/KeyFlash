"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type TimerContextType = {
  time: number;
  setTime: Dispatch<SetStateAction<number>>;
  setRemaining: Dispatch<SetStateAction<number>>;
  remaining: number;
  isRunning: boolean;
  startTimer: () => void;
  resetTimer: () => void;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [time, setTime] = useState(30); // default 30 seconds
  const [remaining, setRemaining] = useState(30);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    console.log("Timer started with time:", time);

    const interval = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const startTimer = () => setIsRunning(true);

  const resetTimer = (newTime?: number) => {
    const updatedTime = newTime ?? time;
    setRemaining(updatedTime);
    setIsRunning(false);
  };

  return (
    <TimerContext.Provider
      value={{ time, setTime, remaining, isRunning, startTimer, resetTimer }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export const useTimer = () => useContext(TimerContext);
