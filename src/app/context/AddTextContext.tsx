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
import { text } from "stream/consumers";

type AddTextContextType = {
  openAddText: boolean;
  setOpenAddText: Dispatch<SetStateAction<boolean>>;
};

const textContext = createContext<AddTextContextType | undefined>(undefined);

export function AddTextProvider({ children }: { children: ReactNode }) {
  const [openAddText, setOpenAddText] = useState(true);

  return (
    <textContext.Provider
      value={{
        openAddText,
        setOpenAddText,
      }}
    >
      {children}
    </textContext.Provider>
  );
}

export const useEditText = () => {
  const context = useContext(textContext);
  if (!context) {
    throw new Error("useText must be within a AddTextProvider");
  }
  return context;
};
