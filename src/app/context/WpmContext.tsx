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

type WpmContextType = {
  showWpm: boolean;
  setShowWpm: Dispatch<SetStateAction<boolean>>;
};

const WpmContext = createContext<WpmContextType | undefined>(undefined);

export function WpmProvider({ children }: { children: ReactNode }) {
  const [showWpm, setShowWpm] = useState(true);

  return (
    <WpmContext.Provider
      value={{
        showWpm,
        setShowWpm,
      }}
    >
      {children}
    </WpmContext.Provider>
  );
}

export const useWpm = () => {
  const context = useContext(WpmContext);
  if (!context) {
    throw new Error("useWpm must be used within a WpmProvider");
  }
  return context;
};
