import { useState, useCallback } from "react";

export const useFlashcardState = (initialTerms: any[]) => {
  const [currentPhase, setCurrentPhase] = useState<"question" | "answer">(
    "question"
  );
  const [questionCompleted, setQuestionCompleted] = useState(false);
  const [cardCompleted, setCardCompleted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [allComplete, setAllComplete] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [answerTimeout, setAnswerTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const resetCurrentCard = useCallback(() => {
    setUserInput("");
    setUserAnswer("");
    setCurrentIndex(0);
    setCurrentPhase("question");
    setQuestionCompleted(false);
    setCardCompleted(false);
    setShowAnswer(false);
    setCorrect(false);
    if (answerTimeout) {
      clearTimeout(answerTimeout);
      setAnswerTimeout(null);
    }
  }, [answerTimeout]);

  return {
    currentPhase,
    setCurrentPhase,
    questionCompleted,
    setQuestionCompleted,
    cardCompleted,
    setCardCompleted,
    showAnswer,
    setShowAnswer,
    userInput,
    setUserInput,
    userAnswer,
    setUserAnswer,
    currentIndex,
    setCurrentIndex,
    correctCount,
    setCorrectCount,
    wrongCount,
    setWrongCount,
    allComplete,
    setAllComplete,
    isShuffled,
    setIsShuffled,
    resetCurrentCard,
    answerTimeout,
    setAnswerTimeout,
    correct,
    setCorrect,
  };
};
