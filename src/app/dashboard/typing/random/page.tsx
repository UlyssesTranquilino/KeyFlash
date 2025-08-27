"use client";
import { useState } from "react";
import { Infinity, Timer } from "lucide-react";
import Words from "@/app/typing/random/page";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTimer } from "@/app/context/TimerContext";
import { useWpm } from "@/app/context/WpmContext";
import { cn } from "@/lib/utils";

const allTime = [
  {
    value: 10,
    label: "10",
  },
  {
    value: 20,
    label: "20",
  },
  {
    value: 30,
    label: "30",
  },
  {
    value: 60,
    label: "60",
  },
  {
    value: -1,
    label: <Infinity />,
  },
];

const DashboardRandomType = () => {
  const { time, setTime, setRemaining, resetTimer } = useTimer();
  const { showWpm, setShowWpm } = useWpm();

  const [openTime, setOpenTime] = useState(false);
  return (
    <div>
      <div className="flex  items-center gap-3 p-1 sm:p-5 ">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Popover open={openTime} onOpenChange={setOpenTime}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="cursor-pointer justify-between flex items-center"
                  >
                    {time > 0 ? time : <Infinity />}
                    <Timer className="text-gray-400 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-18 p-0">
                  <Command>
                    <CommandList>
                      <CommandEmpty>No time found.</CommandEmpty>
                      <CommandGroup>
                        {allTime.map((timeOption: any) => (
                          <CommandItem
                            key={timeOption.value}
                            value={timeOption.value.toString()}
                            // In TypingTabs component, modify the time selection handler:
                            onSelect={(current) => {
                              const parsed = parseInt(current, 10);
                              if (parsed !== time) {
                                setTime(parsed);
                                setRemaining(parsed === -1 ? -1 : parsed);
                                setOpenTime(false);
                                // Removed: resetTimer();
                              } else {
                                setOpenTime(false);
                              }
                            }}
                          >
                            <div className="cursor-pointer flex items-center justify-center w-full">
                              {timeOption.label}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Time (sec)</p>
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
      <Words />
    </div>
  );
};

export default DashboardRandomType;
