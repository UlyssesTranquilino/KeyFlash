"use client";

import { createContext, useState, useContext, ReactNode } from "react";

// 1. Define the context value type
type TestModeContextType = {
  testMode: string;
  setTestMode: React.Dispatch<React.SetStateAction<string>>;
  testSeconds: number;
  setTestSeconds: React.Dispatch<React.SetStateAction<number>>;
  testWords: number;
  setTestWords: React.Dispatch<React.SetStateAction<number>>;
};

// 2. Create the context with an explicit type (initially undefined)
const TestModeContext = createContext<TestModeContextType | undefined>(
  undefined
);

// 3. Provider with proper typing for children
export const TestModeContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [testMode, setTestMode] = useState("time"); // time or word
  const [testSeconds, setTestSeconds] = useState(15);
  const [testWords, setTestWords] = useState(10); // 10 or 20 or 30

  const values: TestModeContextType = {
    testSeconds,
    setTestSeconds,
    testWords,
    setTestWords,
    testMode,
    setTestMode,
  };

  return (
    <TestModeContext.Provider value={values}>
      {children}
    </TestModeContext.Provider>
  );
};

// 4. Custom hook with safety check
export const useTestMode = (): TestModeContextType => {
  const context = useContext(TestModeContext);
  if (!context) {
    throw new Error(
      "useTestMode must be used within a TestModeContextProvider"
    );
  }
  return context;
};
