"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type CodeContextType = {
  language: string;
  topic: string;
  setLanguage: Dispatch<SetStateAction<string>>;
  setTopic: Dispatch<SetStateAction<string>>;
};

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export const CodeContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguage] = useState<string>("any");
  const [topic, setTopic] = useState<string>("any");

  return (
    <CodeContext.Provider
      value={{
        language,
        topic,
        setTopic,
        setLanguage,
      }}
    >
      {children}
    </CodeContext.Provider>
  );
};

export const useCode = () => {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error("useCode must be used within a CodeProvider");
  }
  return context;
};
