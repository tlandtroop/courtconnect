"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Loader2,
  MapPin,
  ChevronRight,
} from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Court } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";

interface GooglePlace {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  opening_hours?: {
    open_now: boolean;
  };
}

interface GameFormProps {
  preselectedCourtId?: string;
}

const GameForm = ({ preselectedCourtId }: GameFormProps) => {
  const router = useRouter();
  const [courtId, setCourtId] = useState<string>(preselectedCourtId || "");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("14:00"); // Default to 2:00 PM
  const [gameType, setGameType] = useState<string>("Pickleball - Doubles");
  const [skillLevel, setSkillLevel] = useState<string>("All Levels Welcome");
  const [playersNeeded, setPlayersNeeded] = useState<number>(4);
  const [notes, setNotes] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loadingCourts, setLoadingCourts] = useState(true);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const topTwoCourts = courts.slice(0, 2);
  const remainingCourts = courts.slice(2);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        // First try to get user's location
        let coordinates = { lat: 29.652, lng: -82.325 }; // Default to Gainesville
        if (navigator.geolocation) {
          try {
            const position = await new Promise<GeolocationPosition>(
              (resolve) => {
                navigator.geolocation.getCurrentPosition(
                  resolve,
                  (error) => {
                    console.warn("Geolocation error:", error);
                    // If geolocation fails, use default coordinates
                    resolve({
                      coords: {
                        latitude: coordinates.lat,
                        longitude: coordinates.lng,
                        accuracy: 0,
                        altitude: null,
                        altitudeAccuracy: null,
                        heading: null,
                        speed: null,
                      },
                      timestamp: Date.now(),
                    } as GeolocationPosition);
                  },
                  {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                  }
                );
              }
            );
            coordinates = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
          } catch (error) {
            console.warn(
              "Error getting location, using default coordinates:",
              error
            );
            // Continue with default coordinates
          }
        }

        // Fetch nearby courts from Google Places API
        const response = await fetch(
          `/api/courts?lat=${coordinates.lat}&lng=${coordinates.lng}&radius=5000`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch courts");
        }
        const data = await response.json();

        if (data.status === "OK" && data.results) {
          const transformedCourts: Court[] = data.results.map(
            (place: GooglePlace) => ({
              id: place.place_id,
              name: place.name,
              address: place.vicinity || "",
              city: "",
              state: "",
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
              amenities: [],
              images: place.photos
                ? [
                    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API}`,
                  ]
                : [],
              reviewCount: place.user_ratings_total || 0,
              rating: place.rating || 0,
              isOpen: place.opening_hours ? place.opening_hours.open_now : null,
            })
          );

          setCourts(transformedCourts);
          // Set default court ID if courts are available and no preselectedCourtId was provided
          if (transformedCourts.length > 0 && !preselectedCourtId) {
            setCourtId(transformedCourts[0].id);
            setSelectedCourt(transformedCourts[0]);
          }
        } else {
          throw new Error(data.error_message || "No courts found in your area");
        }
      } catch (error) {
        console.error("Error fetching courts:", error);
      } finally {
        setLoadingCourts(false);
      }
    };

    fetchCourts();
  }, [preselectedCourtId]);

  const handleCourtSelect = (court: Court) => {
    setSelectedCourt(court);
    setCourtId(court.id);

    // Update the courts array to move the selected court to the top
    const updatedCourts = [...courts];
    const courtIndex = updatedCourts.findIndex((c) => c.id === court.id);
    if (courtIndex !== -1) {
      const [selectedCourt] = updatedCourts.splice(courtIndex, 1);
      updatedCourts.unshift(selectedCourt);
      setCourts(updatedCourts);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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

    // Validate game time is not in the past
    const now = new Date();
    const gameDateTime = new Date(date);
    const [hours, minutes] = time.split(":").map(Number);
    gameDateTime.setHours(hours, minutes, 0, 0);

    if (gameDateTime < now) {
      setError("Cannot schedule a game in the past");
      return;
    }

    setIsSubmitting(true);

    try {
      // First, check if the court exists in our database
      const courtResponse = await fetch(
        `/api/v1/courts?googlePlaceId=${courtId}`
      );
      const courtData = await courtResponse.json();

      let finalCourtId;

      // If the court doesn't exist in our database, create it
      if (!courtData.court) {
        if (!selectedCourt) {
          throw new Error("No court selected");
        }

        const createCourtResponse = await fetch("/api/v1/courts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: selectedCourt.name,
            description: selectedCourt.name, // Using name as description if not provided
            latitude: selectedCourt.latitude,
            longitude: selectedCourt.longitude,
            address: selectedCourt.address || "",
            city: selectedCourt.city || "",
            state: selectedCourt.state || "",
            courtType: gameType.split(" - ")[0], // Extract sport type from gameType
            amenities: selectedCourt.amenities || [],
            images: selectedCourt.images || [],
            googlePlaceId: selectedCourt.id, // Use the Google Place ID
          }),
        });

        if (!createCourtResponse.ok) {
          throw new Error("Failed to create court");
        }

        const createCourtData = await createCourtResponse.json();
        if (!createCourtData.court) {
          throw new Error("Failed to create court");
        }

        finalCourtId = createCourtData.court.id;
      } else {
        finalCourtId = courtData.court.id;
      }

      // Format the date as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      // Create a date-time string in local timezone
      const startTimeString = `${formattedDate}T${time}:00`;
      const gameResponse = await fetch("/api/v1/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courtId: finalCourtId,
          date: formattedDate,
          startTime: startTimeString,
          gameType,
          skillLevel,
          playersNeeded,
          notes,
        }),
      });

      if (!gameResponse.ok) {
        throw new Error("Failed to create game");
      }

      const gameData = await gameResponse.json();
      if (!gameData.game) {
        throw new Error("Failed to create game");
      }

      toast.success("Game Created", {
        description: "Your game has been scheduled successfully",
      });

      // Redirect to the game page
      router.push(`/games/${gameData.game.id}`);
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Error creating game");
      toast.error("Error Creating Game", {
        description: "Failed to create the game. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageError = (courtId: string) => {
    setImageErrors((prev) => ({ ...prev, [courtId]: true }));
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
            {loadingCourts ? (
              <div className="text-center py-4">Loading courts...</div>
            ) : courts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No courts available.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {topTwoCourts.map((court) => (
                    <div
                      key={court.id}
                      className={`border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors ${
                        courtId === court.id ? "border-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => handleCourtSelect(court)}
                    >
                      <div className="flex gap-4">
                        {court.images &&
                        court.images.length > 0 &&
                        !imageErrors[court.id] ? (
                          <div className="w-20 h-20 rounded-lg overflow-hidden relative">
                            <Image
                              src={court.images[0]}
                              alt={court.name}
                              fill
                              className="object-cover"
                              onError={() => handleImageError(court.id)}
                              unoptimized
                              priority={false}
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                            <MapPin className="h-8 w-8" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{court.name}</div>
                          <div className="text-sm text-gray-500">
                            {court.address}
                          </div>
                          <div className="mt-2 flex gap-2">
                            {court.rating > 0 && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                {court.rating.toFixed(1)} ★ ({court.reviewCount}
                                )
                              </span>
                            )}
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                court.isOpen === null
                                  ? "bg-gray-100 text-gray-800"
                                  : court.isOpen
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {court.isOpen === null
                                ? "Hours Unknown"
                                : court.isOpen
                                ? "Open Now"
                                : "Closed"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {remainingCourts.length > 0 && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full">
                        View {remainingCourts.length} More Courts
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>All Courts</SheetTitle>
                      </SheetHeader>
                      <div className="mt-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                        {remainingCourts.map((court) => (
                          <div
                            key={court.id}
                            className={`border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors ${
                              courtId === court.id
                                ? "border-blue-500 bg-blue-50"
                                : ""
                            }`}
                            onClick={() => handleCourtSelect(court)}
                          >
                            <div className="flex gap-4">
                              {court.images &&
                              court.images.length > 0 &&
                              !imageErrors[court.id] ? (
                                <div className="w-20 h-20 rounded-lg overflow-hidden relative">
                                  <Image
                                    src={court.images[0]}
                                    alt={court.name}
                                    fill
                                    className="object-cover"
                                    onError={() => handleImageError(court.id)}
                                    unoptimized
                                    priority={false}
                                  />
                                </div>
                              ) : (
                                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                  <MapPin className="h-8 w-8" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{court.name}</div>
                                <div className="text-sm text-gray-500">
                                  {court.address}
                                </div>
                                <div className="mt-2 flex gap-2">
                                  {court.rating > 0 && (
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                      {court.rating.toFixed(1)} ★ (
                                      {court.reviewCount})
                                    </span>
                                  )}
                                  <span
                                    className={`text-xs px-2 py-1 rounded ${
                                      court.isOpen === null
                                        ? "bg-gray-100 text-gray-800"
                                        : court.isOpen
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {court.isOpen === null
                                      ? "Hours Unknown"
                                      : court.isOpen
                                      ? "Open Now"
                                      : "Closed"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div>
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div>
            <Label>Time</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          {/* Game Type */}
          <div>
            <Label>Game Type</Label>
            <Select value={gameType} onValueChange={setGameType}>
              <SelectTrigger>
                <SelectValue placeholder="Select game type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pickleball - Doubles">
                  Pickleball - Doubles
                </SelectItem>
                <SelectItem value="Pickleball - Singles">
                  Pickleball - Singles
                </SelectItem>
                <SelectItem value="Basketball - Full Court">
                  Basketball - Full Court
                </SelectItem>
                <SelectItem value="Basketball - Half Court">
                  Basketball - Half Court
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Skill Level */}
          <div>
            <Label>Skill Level</Label>
            <Select value={skillLevel} onValueChange={setSkillLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select skill level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Levels Welcome">
                  All Levels Welcome
                </SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Players Needed */}
          <div>
            <Label>Players Needed</Label>
            <Select
              value={playersNeeded.toString()}
              onValueChange={(value) => setPlayersNeeded(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select number of players" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Players</SelectItem>
                <SelectItem value="4">4 Players</SelectItem>
                <SelectItem value="6">6 Players</SelectItem>
                <SelectItem value="8">8 Players</SelectItem>
                <SelectItem value="10">10 Players</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Notes */}
          <div>
            <Label>Additional Notes (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional information about the game..."
            />
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
              "Schedule Game"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GameForm;
