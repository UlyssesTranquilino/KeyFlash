"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type TextContextType = {
  openEditText: boolean;
  setOpenEditText: Dispatch<SetStateAction<boolean>>;
};

const TextContext = createContext<TextContextType | undefined>(undefined);

export const TextContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openEditText, setOpenEditText] = useState<boolean>(false);

  return (
    <TextContext.Provider
      value={{
        openEditText,
        setOpenEditText,
      }}
    >
      {children}
    </TextContext.Provider>
  );
};

export const useFlashcard = () => {
  const context = useContext(TextContext);
  if (!context) {
    throw new Error("useCode must be used within a TextProvider");
  }
  return context;
};
