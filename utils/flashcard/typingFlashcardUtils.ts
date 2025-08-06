export const parseFlashcardText = (text: string) => {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.includes("-"))
    .map((line, index) => {
      const [question, answer] = line.split("-").map((part) => part.trim());
      return {
        id: Date.now() + index,
        question,
        answer,
      };
    });
};

export const calculateWpm = (inputLength: number, startTime: number) => {
  const timeElapsed = (Date.now() - startTime) / 60000;
  const words = inputLength > 0 ? Math.max(1, inputLength / 5) : 0;
  return Math.round(words / timeElapsed);
};

export const deletePreviousWord = (
  currentInput: string,
  currentIndex: number
) => {
  let deleteTo = currentIndex - 1;
  while (deleteTo > 0 && currentInput[deleteTo - 1] !== " ") {
    deleteTo--;
  }
  return currentInput.substring(0, deleteTo);
};
