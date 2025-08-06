import { useState, useEffect } from "react";

export const useFlashcardSettings = () => {
  const loadSettings = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("flashcardSettings");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  };

  const saveSettings = (settings: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("flashcardSettings", JSON.stringify(settings));
    }
  };

  const [isTypingMode, setIsTypingMode] = useState(() => {
    const saved = loadSettings();
    return saved?.isTypingMode ?? true;
  });

  const [isQuizMode, setIsQuizMode] = useState(() => {
    const saved = loadSettings();
    return saved?.isQuizMode ?? false;
  });

  const [blurAnswer, setBlurAnswer] = useState(true);

  useEffect(() => {
    saveSettings({
      isTypingMode,
      isQuizMode,
    });
  }, [isTypingMode, isQuizMode]);

  return {
    isTypingMode,
    setIsTypingMode,
    isQuizMode,
    setIsQuizMode,
    blurAnswer,
    setBlurAnswer,
  };
};
