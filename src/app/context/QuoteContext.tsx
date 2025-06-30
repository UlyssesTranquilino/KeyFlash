"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Quote } from "@/types/quote";

type QuoteContextType = {
  quote: Quote | null;
  originalQuote: Quote | null;
  setQuote: (q: Quote) => void;
  lowerCaseQuote: () => void;
  startCaseQuote: () => void;
  isLowercase: boolean;
  cleanPunctuation: boolean;
  setCleanPunctuation: (clean: boolean) => void;
};

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [quote, setQuoteState] = useState<Quote | null>(null);
  const [originalQuote, setOriginalQuote] = useState<Quote | null>(null);
  const [isLowercase, setIsLowercase] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isLowercase") === "true";
    }
    return false;
  });
  const [cleanPunctuation, setCleanPunctuation] = useState<boolean>(false);

  // Apply case transformation consistently
  const transformQuoteContent = (content: string): string => {
    let transformed = content;
    if (isLowercase) {
      transformed = transformed.toLowerCase();
    }
    if (cleanPunctuation) {
      transformed = transformed
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
    }
    return transformed;
  };

  const setQuote = (q: Quote) => {
    setOriginalQuote(q);
    setQuoteState({
      ...q,
      content: transformQuoteContent(q.content),
    });
  };

  const lowerCaseQuote = () => {
    if (quote && originalQuote) {
      setQuoteState({
        ...quote,
        content: transformQuoteContent(originalQuote.content),
      });
      setIsLowercase(true);
      localStorage.setItem("isLowercase", "true");
    }
  };

  const startCaseQuote = () => {
    if (originalQuote) {
      setQuoteState(originalQuote);
      setIsLowercase(false);
      localStorage.setItem("isLowercase", "false");
    }
  };

  // Ensure case is applied when isLowercase changes
  useEffect(() => {
    if (originalQuote) {
      setQuote(originalQuote);
    }
  }, [isLowercase, cleanPunctuation]);

  return (
    <QuoteContext.Provider
      value={{
        quote,
        originalQuote,
        setQuote,
        lowerCaseQuote,
        startCaseQuote,
        isLowercase,
        cleanPunctuation,
        setCleanPunctuation,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error("useQuote must be used within a QuoteProvider");
  }
  return context;
};
