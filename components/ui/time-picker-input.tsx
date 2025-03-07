"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface TimePickerInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  setTime: (time: string) => void;
}

export function TimePickerInput({
  className,
  setTime,
  ...props
}: TimePickerInputProps) {
  const [selectedTime, setSelectedTime] = React.useState("");
  const [isTimePopoverOpen, setIsTimePopoverOpen] = React.useState(false);

  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = [0, 15, 30, 45];

  const handleTimeOptionClick = (hour: number, minute: number) => {
    const formattedHour = hour.toString().padStart(2, "0");
    const formattedMinute = minute.toString().padStart(2, "0");
    const timeString = `${formattedHour}:${formattedMinute}`;

    setSelectedTime(timeString);
    setTime(timeString);
    setIsTimePopoverOpen(false);
  };

  const handleManualTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
    setTime(e.target.value);
  };

  return (
    <Popover open={isTimePopoverOpen} onOpenChange={setIsTimePopoverOpen}>
      <div className="relative w-full">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedTime && "text-muted-foreground"
            )}
            type="button"
          >
            <Clock className="mr-2 h-4 w-4" />
            {selectedTime ? formatTimeDisplay(selectedTime) : "Select time"}
          </Button>
        </PopoverTrigger>
        <Input
          type="time"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          value={selectedTime}
          onChange={handleManualTimeChange}
          {...props}
        />
      </div>
      <PopoverContent className="w-auto p-0">
        <div className="p-3">
          <div className="text-center mb-2 font-medium">Select Time</div>
          <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
            {hourOptions.map((hour) =>
              minuteOptions.map((minute) => (
                <Button
                  key={`${hour}-${minute}`}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "text-xs",
                    selectedTime ===
                      `${hour.toString().padStart(2, "0")}:${minute
                        .toString()
                        .padStart(2, "0")}` &&
                      "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  )}
                  onClick={() => handleTimeOptionClick(hour, minute)}
                >
                  {formatTimeOption(hour, minute)}
                </Button>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function formatTimeOption(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
}

function formatTimeDisplay(time: string): string {
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (isNaN(hour) || isNaN(minute)) {
    return time;
  }

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minuteStr} ${period}`;
}

// Export this for backwards compatibility
export const TimePickerDemo = TimePickerInput;
