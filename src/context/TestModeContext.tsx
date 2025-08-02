"use client";

import { createContext, useState, useContext, ReactNode } from "react";

// 1. Define the context value type
type TestModeContextType = {
  testTime: number;
  setTestTime: React.Dispatch<React.SetStateAction<number>>;
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
  const [testTime, setTestTime] = useState<number>(15);

  const values: TestModeContextType = {
    testTime,
    setTestTime,
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
