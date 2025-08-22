import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Shuffle, Rewind, RotateCcw, Keyboard, Check, X } from "lucide-react";

export const FlashcardControls = ({
  isQuizMode,
  isTypingMode,
  isShuffled,
  correctCount,
  wrongCount,
  current,
  count,
  onQuizModeChange,
  onTypingModeChange,
  onShuffle,
  onUnshuffle,
  onReset,
  onRestart,
}: {
  isQuizMode: boolean;
  isTypingMode: boolean;
  isShuffled: boolean;
  correctCount: number;
  wrongCount: number;
  current: number;
  count: number;
  onQuizModeChange: (value: boolean) => void;
  onTypingModeChange: (value: boolean) => void;
  onShuffle: () => void;
  onUnshuffle: () => void;
  onReset: () => void;
  onRestart: () => void;
}) => {
  return (
    <div className="w-full absolute right-1/2 -bottom-30 grid grid-cols-5 items-center translate-x-1/2">
      <div className="flex items-center justify-start flex-nowrap sm:items-center gap-2 sm:gap-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col switch gap-1 items-center">
              <Switch
                id="code-toggle"
                checked={isQuizMode}
                onCheckedChange={onQuizModeChange}
                className={cn(
                  "scale-80",
                  "data-[state=checked]:bg-blue-400",
                  "data-[state=checked]:border-blue-400",
                  "data-[state=checked]:ring-blue-400",
                )}
              />
              <Label
                htmlFor="code-toggle"
                className="text-sm flex items-center gap-2"
              >
                Quiz
              </Label>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Quiz Mode - Track your Progress</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "cursor-pointer flex items-center gap-2 py-2 hover:text-blue-400 hover:bg-blue-950/30 rounded-md transition-colors",
                isTypingMode ? "text-blue-400" : "text-gray-400",
              )}
              onClick={() => onTypingModeChange(!isTypingMode)}
            >
              <Keyboard className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Typing Mode {isTypingMode ? "On" : "Off"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "cursor-pointer flex items-center gap-2 py-2 hover:text-blue-400 hover:bg-blue-950/30 rounded-md transition-colors",
                isShuffled ? "text-blue-400" : "text-gray-400",
              )}
              onClick={isShuffled ? onUnshuffle : onShuffle}
            >
              <Shuffle className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isShuffled ? "Unshuffle Cards" : "Shuffle Cards"}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="w-full col-span-3 relative">
        <div className="text-center w-25 sm:w-34 mx-auto relative">
          <div className="text-gray-400 text-sm sm:text-base">
            {current + 1} / {count}
          </div>
        </div>
        {isQuizMode && (
          <div className="flex items-center justify-center text-sm gap-3 absolute -translate-x-1/67 p-4 w-full">
            <div className="flex gap-1">
              <Check className="text-green-400" />
              <span className="text-gray-300">{correctCount}</span>
            </div>
            <div className="flex gap-1">
              <X className="text-red-400" />
              <span className="text-gray-300">{wrongCount}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 sm:gap-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              disabled={isQuizMode}
              className="cursor-pointer flex my-14 items-center gap-2 py-2 hover:text-blue-400 hover:bg-blue-950/30 rounded-md text-gray-400 transition-colors"
              onClick={onReset}
            >
              <Rewind className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset Cards</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              disabled={isQuizMode}
              className="cursor-pointer flex my-14 items-center gap-2 py-2 hover:text-blue-400 hover:bg-blue-950/30 rounded-md text-gray-400 transition-colors"
              onClick={onRestart}
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Restart Card</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
