"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SimpleResultsProps {
  correctCount: number;
  totalCards: number;
  onRestart: () => void;
  isQuizMode: boolean;
}

export const SimpleResults = ({
  correctCount,
  totalCards,
  onRestart,
  isQuizMode,
}: SimpleResultsProps) => {
  const [open, setOpen] = useState(true); // show when component mounts
  const wrongCount = totalCards - correctCount;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            <DialogTitle className="text-2xl text-center">
              All Flashcards Completed!
            </DialogTitle>
            <DialogDescription className="text-center mt-2">
              Great job! You've finished all {totalCards} flashcards.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Stats */}
          {isQuizMode && (
            <div className="bg-gray-900/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-center mb-4">
                Your Results
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-green-500 text-3xl font-bold">
                    {correctCount}
                  </div>
                  <div className="text-gray-400 text-sm">Correct Answers</div>
                </div>
                <div className="text-center">
                  <div className="text-red-500 text-3xl font-bold">
                    {wrongCount}
                  </div>
                  <div className="text-gray-400 text-sm">Wrong Answers</div>
                </div>
              </div>
            </div>
          )}
          {/* Action */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => {
                onRestart();
                setOpen(false);
              }}
              className="cursor-pointer flex-1 bg-blue-950/30 hover:bg-blue-950 text-white border-0 py-2"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Practice Again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
