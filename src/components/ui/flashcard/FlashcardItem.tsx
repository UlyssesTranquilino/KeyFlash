import { motion } from "framer-motion";
import {
  CheckCircle,
  Eye,
  EyeClosed,
  SkipForward,
  CircleX,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Virtualized Flashcard Item Component
export const FlashcardItem = ({
  item,
  index,
  isActive,
  currentPhase,
  setCurrentPhase,
  questionCompleted,
  cardCompleted,
  isTypingMode,
  blurAnswer,
  setBlurAnswer,
  userAnswer,
  setUserAnswer,
  userInput,
  highlightedText,
  handleTextClick,
  handleAnswerSubmit,
  showAnswer,
  correct,
  handleFlipCard,
  answerInputRef,
  skipQuestion,
}) => {
  if (!isActive) {
    return <div className="h-100 md:h-110" />; // Placeholder for non-active items
  }

  return (
    <div className="mt-2 max-w-[1100px] rounded-2xl bg-gray-900/70 relative overflow-hidden h-100 md:h-110">
      <div
        className="flex flex-col items-center justify-center h-full p-2 md:p-4"
        onClick={handleFlipCard}
        style={{ perspective: "1000px" }}
        tabIndex={0}
      >
        <motion.div
          className="w-full h-full relative"
          animate={{
            rotateY: currentPhase === "question" ? 0 : 180,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Front of the card (question) */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              display: currentPhase === "question" ? "flex" : "none",
            }}
          >
            <div className="absolute top-6 right-0 w-full items-center flex justify-between px-3">
              <div className="flex items-center gap-3">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPhase("question");
                  }}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm cursor-pointer ${
                    currentPhase === "question"
                      ? "bg-blue-600/20 text-blue-400"
                      : questionCompleted
                        ? "bg-green-600/20 text-green-400"
                        : "bg-gray-600/20 text-gray-400"
                  }`}
                >
                  {questionCompleted && <CheckCircle className="w-4 h-4" />}
                  <span className="text-xs">Question</span>
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPhase("answer");
                  }}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm cursor-pointer ${
                    currentPhase === "answer"
                      ? "bg-blue-600/20 text-blue-400"
                      : cardCompleted
                        ? "bg-green-600/20 text-green-400"
                        : "bg-gray-600/20 text-gray-400"
                  }`}
                >
                  {cardCompleted && <CheckCircle className="w-4 h-4" />}
                  <span className="text-xs">Answer</span>
                </div>
              </div>

              {isTypingMode && (
                <div className="flex gap-3 items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={skipQuestion}
                        className={cn(
                          "p-2 cursor-pointer rounded-md transition-colors",

                          "text-gray-300 hover:text-white",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900",
                        )}
                        aria-label="Skip question"
                      >
                        <SkipForward className="w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Skip to answer (Ctrl+Enter)</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBlurAnswer(!blurAnswer);
                        }}
                        className={cn(
                          "cursor-pointer flex items-center gap-2 text-[0.9rem] transition px-3 lg:px-2",
                          blurAnswer
                            ? "text-blue-400"
                            : "text-gray-400 hover:text-white",
                        )}
                      >
                        {!blurAnswer ? (
                          <Eye className="scale-78" />
                        ) : (
                          <EyeClosed className="scale-78" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{!blurAnswer ? "Hide Answer" : "Show Answer"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>

            <h2 className="text-sm md:text-base text-center text-gray-400 mb-4 mt-10">
              {isTypingMode ? "Type the question:" : "Question:"}
            </h2>

            <div className="text-center flex items-center justify-center w-full max-w-[600px]">
              <motion.div
                key={`${index}-question`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`text-xl md:text-2xl text-center font-mono leading-relaxed mb-8 sm:px-4 cursor-text whitespace-pre transition-all duration-300`}
                onClick={handleTextClick}
                onMouseDown={(e) => e.preventDefault()}
              >
                {isTypingMode ? (
                  <div className="flex flex-wrap justify-center text-center mx-auto">
                    {highlightedText}
                  </div>
                ) : (
                  <p className="whitespace-pre-line">{item?.question}</p>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Back of the card (answer) */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              display: currentPhase === "answer" ? "flex" : "none",
            }}
          >
            <div className="absolute top-3 right-0 w-full items-center flex justify-between px-3">
              <div className="flex items-center gap-3">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPhase("question");
                  }}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm cursor-pointer ${
                    currentPhase === "question"
                      ? "bg-blue-600/20 text-blue-400"
                      : questionCompleted
                        ? "bg-green-600/20 text-green-400"
                        : "bg-gray-600/20 text-gray-400"
                  }`}
                >
                  {questionCompleted && <CheckCircle className="w-4 h-4" />}
                  <span className="text-xs">Question</span>
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPhase("answer");
                  }}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm cursor-pointer ${
                    currentPhase === "answer"
                      ? "bg-blue-600/20 text-blue-400"
                      : cardCompleted
                        ? "bg-green-600/20 text-green-400"
                        : "bg-gray-600/20 text-gray-400"
                  }`}
                >
                  {cardCompleted && <CheckCircle className="w-4 h-4" />}
                  <span className="text-xs">Answer</span>
                </div>
              </div>

              {cardCompleted && currentPhase === "answer" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full text-center"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 rounded-full">
                    <span className="text-gray-300 text-sm">
                      Press{" "}
                      <kbd className="px-2 py-1 text-xs font-mono bg-gray-700 rounded-md text-gray-200">
                        SPACE
                      </kbd>
                      to continue
                    </span>
                  </div>
                </motion.div>
              )}

              {isTypingMode && (
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBlurAnswer(!blurAnswer);
                        }}
                        className={cn(
                          "cursor-pointer flex items-center gap-2 text-[0.9rem] transition px-3 lg:px-2",
                          blurAnswer
                            ? "text-blue-400"
                            : "text-gray-400 hover:text-white",
                        )}
                      >
                        {!blurAnswer ? (
                          <Eye className="scale-78" />
                        ) : (
                          <EyeClosed className="scale-78" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{!blurAnswer ? "Hide Answer" : "Show Answer"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>

            <h2 className="text-sm md:text-base text-gray-400 mb-4 mt-10">
              {isTypingMode
                ? blurAnswer
                  ? "Type your answer and press Enter:"
                  : "Type the answer:"
                : "Answer:"}
            </h2>

            <div className="text-center flex items-center justify-center w-full max-w-[600px]">
              {blurAnswer && !showAnswer && isTypingMode ? (
                <div className="w-full">
                  <input
                    value={userAnswer}
                    type="text"
                    className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="Type your answer here..."
                    onKeyDown={handleAnswerSubmit}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    autoFocus
                    ref={answerInputRef}
                  />
                </div>
              ) : (
                <motion.div
                  key={`${index}-answer`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`text-xl md:text-2xl text-center font-mono leading-relaxed mb-8 sm:px-4 cursor-text whitespace-pre transition-all duration-300`}
                  onClick={handleTextClick}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {isTypingMode ? (
                    <div className="flex flex-wrap justify-center text-center mx-auto">
                      {highlightedText}
                    </div>
                  ) : (
                    <p className="whitespace-pre-line">{item?.answer}</p>
                  )}
                </motion.div>
              )}
            </div>

            {blurAnswer && showAnswer && (
              <div className="mt-4 p-4 bg-gray-800 rounded-md w-full">
                <p className="text-gray-400 mb-2">Correct answer:</p>
                <p className="text-white text-xl">{item?.answer}</p>
              </div>
            )}

            {cardCompleted && correct && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-green-400 text-center mt-6"
              >
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <span className="text-sm">
                  {blurAnswer ? "Correct Answer!" : "Card completed!"}
                </span>
              </motion.div>
            )}

            {cardCompleted && !correct && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center mt-6"
              >
                <CircleX className="text-red-400 w-8 h-8 mx-auto mb-2" />
                <span className="text-red-400 text-sm">Wrong Answer!</span>
                <div className="mt-1">Correct Answer: {item?.answer}</div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
