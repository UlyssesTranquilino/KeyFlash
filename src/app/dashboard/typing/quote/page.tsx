"use client";
import { useState } from "react";
import QuoteType from "@/app/typing/quote/page";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuote } from "@/app/context/QuoteContext";
import { useWpm } from "@/app/context/WpmContext";

const DashboardQuoteType = () => {
  const [isLowerCase, setIsLowerCase] = useState(true);
  const { lowerCaseQuote, startCaseQuote, isLowercase } = useQuote();
  const { showWpm, setShowWpm } = useWpm();

  return (
    <div>
      <div className="flex items-center gap-3 p-1 sm:p-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                if (isLowercase) {
                  startCaseQuote();
                } else {
                  lowerCaseQuote();
                }
              }}
              className={cn(
                "cursor-pointer flex items-center gap-2 text-sm transition px-2",
                isLowercase ? "text-blue-400" : "text-gray-400 hover:text-white"
              )}
            >
              <AArrowDown />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isLowercase ? "Original case" : "Simplify text"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setShowWpm(!showWpm)}
              className={cn(
                "cursor-pointer flex items-center gap-2 text-[0.9rem] transition px-3 lg:px-2",
                showWpm ? "text-blue-400" : "text-gray-400 hover:text-white"
              )}
            >
              WPM
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Words per minute</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <QuoteType />
    </div>
  );
};

export default DashboardQuoteType;
