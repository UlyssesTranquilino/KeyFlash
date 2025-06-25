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
  const [time, setTime] = useState(-1); // default 30 seconds
  const [remaining, setRemaining] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || time === -1) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, time]);

  const startTimer = () => {
    if (time > 0) {
      setRemaining(time);
    }
    setIsRunning(true);
  };

  // In TimerProvider
  const resetTimer = (newTime?: number) => {
    const updatedTime = newTime !== undefined ? newTime : time;
    if (newTime !== undefined) {
      setTime(newTime);
    }
    setRemaining(updatedTime === -1 ? -1 : updatedTime);
    setIsRunning(false);
  };

  return (
    <TimerContext.Provider
      value={{
        time,
        setTime,
        remaining,
        setRemaining,
        isRunning,
        startTimer,
        resetTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export const useTimer = () => useContext(TimerContext);
