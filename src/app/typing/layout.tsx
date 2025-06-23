import React from "react";
import TypingTabs from "@/components/ui/typing/TypingTabs";
import { QuoteProvider } from "../context/QuoteContext";
import { TimerProvider } from "../context/TimerContext";

export default function TypingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TimerProvider>
      <QuoteProvider>
        <div className=" text-foreground ">
          {/* Top Tabs */}
          <TypingTabs />

          {/* Page Content */}
          <div className="max-w-[1000px] mx-auto mt-6 px-4">{children}</div>
        </div>
      </QuoteProvider>
    </TimerProvider>
  );
}
