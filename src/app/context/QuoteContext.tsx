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

  // Apply lowercase mode automatically when a new quote is set
  const setQuote = (q: Quote) => {
    setOriginalQuote(q);
    console.log("Q: ", q);
    if (isLowercase) {
      const cleaned = q.content
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
        .replace(/\s{2,}/g, " ");
      setQuoteState({
        ...q,
        content: cleaned.trim(),
      });
    } else {
      setQuoteState(q);
    }
  };

  const lowerCaseQuote = () => {
    if (quote) {
      const cleaned = quote.content
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();

      setQuoteState({ ...quote, content: cleaned });
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

  return (
    <QuoteContext.Provider
      value={{
        quote,
        originalQuote,
        setQuote,
        lowerCaseQuote,
        startCaseQuote,
        isLowercase,
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
