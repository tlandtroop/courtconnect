"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { TimePickerInput } from "@/components/ui/time-picker-input";

const GameForm = () => {
  const [courtId, setCourtId] = useState<string>("1");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [gameType, setGameType] = useState<string>("Pickleball - Doubles");
  const [skillLevel, setSkillLevel] = useState<string>("All Levels Welcome");
  const [playersNeeded, setPlayersNeeded] = useState<number>(4);
  const [notes, setNotes] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check if required fields are filled
    if (
      !courtId ||
      !date ||
      !time ||
      !gameType ||
      !skillLevel ||
      !playersNeeded
    ) {
      setError("All fields except Additional Notes are required");
      return;
    }

    setIsSubmitting(true);

    // Format date and time for API
    const formattedDate = format(date, "yyyy-MM-dd");

    const gameData = {
      courtId,
      date: formattedDate,
      startTime: time,
      gameType,
      skillLevel,
      playersNeeded,
      notes,
    };

    try {
      // Send data to API route to create a new game
      const response = await fetch("/api/create-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        throw new Error("Failed to create game");
      } else {
        toast("Game Created", {
          description: "A game has been created successfully",
        });

        // Reset form or redirect here if needed
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error creating game");
      toast("Error Creating Game", {
        description: "A game could not be created",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule a New Game</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Court Selection */}
          <div>
            <Label className="text-sm font-medium mb-2">Select Court</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {[1, 2].map((court) => (
                <div
                  key={court}
                  className={`border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors ${
                    courtId === court.toString()
                      ? "border-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => setCourtId(court.toString())}
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                      Court
                    </div>
                    <div>
                      <div className="font-medium">Court Name #{court}</div>
                      <div className="text-sm text-gray-500">
                        2.3 miles away
                      </div>
                      <div className="mt-2 flex gap-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="flex items-center space-x-2">
                <TimePickerInput setTime={setTime} className="w-full" />
              </div>
            </div>
          </div>

          {/* Game Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gameType">Game Type</Label>
              <Select defaultValue={gameType} onValueChange={setGameType}>
                <SelectTrigger id="gameType">
                  <SelectValue placeholder="Select game type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pickleball - Singles">
                    Pickleball - Singles
                  </SelectItem>
                  <SelectItem value="Pickleball - Doubles">
                    Pickleball - Doubles
                  </SelectItem>
                  <SelectItem value="Basketball - 3v3">
                    Basketball - 3v3
                  </SelectItem>
                  <SelectItem value="Basketball - 5v5">
                    Basketball - 5v5
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skillLevel">Skill Level</Label>
              <Select defaultValue={skillLevel} onValueChange={setSkillLevel}>
                <SelectTrigger id="skillLevel">
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="All Levels Welcome">
                    All Levels Welcome
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="playersNeeded">Number of Players Needed</Label>
              <Input
                id="playersNeeded"
                type="number"
                value={playersNeeded}
                onChange={(e) => setPlayersNeeded(Number(e.target.value))}
                placeholder="Enter number of players"
                min={1}
                max={20}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional information about the game..."
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Game...
              </>
            ) : (
              "Create Game"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GameForm;
