"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type FlashcardContextType = {
  openEditFlashcard: boolean;
  blurAnswer: boolean;
  setBlurAnswer: Dispatch<SetStateAction<boolean>>;
  setOpenEditFlashcard: Dispatch<SetStateAction<boolean>>;
};

const FlashcardContext = createContext<FlashcardContextType | undefined>(
  undefined
);

export const FlashcardContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openEditFlashcard, setOpenEditFlashcard] = useState<boolean>(false);
  const [blurAnswer, setBlurAnswer] = useState<boolean>(true);
  return (
    <FlashcardContext.Provider
      value={{
        openEditFlashcard,
        blurAnswer,
        setOpenEditFlashcard,
        setBlurAnswer,
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
};

export const useFlashcard = () => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error("useCode must be used within a FlashcardProvider");
  }
  return context;
};
