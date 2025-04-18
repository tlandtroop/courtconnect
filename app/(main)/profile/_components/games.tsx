import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";

interface GamesProps {
  profile: UserProfile;
  isOwnProfile: boolean;
}

const Games = ({ profile, isOwnProfile }: GamesProps) => {
  const isInPast = (dateString: string) => {
    try {
      const inputDate = new Date(dateString);
      const today = new Date();

      const inputDateOnly = new Date(inputDate);
      inputDateOnly.setHours(0, 0, 0, 0);

      const todayOnly = new Date(today);
      todayOnly.setHours(0, 0, 0, 0);

      return inputDateOnly < todayOnly;
    } catch (error) {
      console.error("Date comparison error:", error);
      return false;
    }
  };

  const allGames = [...(profile.createdGames || []), ...(profile.games || [])];

  const uniqueGames = Array.from(
    new Map(allGames.map((game) => [game.id, game])).values()
  );

  console.log("Game data example:", uniqueGames[0]);

  // Format time for display
  const formatTime = (
    timeString: string | Date | undefined,
    date: string | Date
  ) => {
    try {
      // If timeString is undefined, use the time from the date field
      if (!timeString) {
        const dateTime = new Date(date);
        return dateTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      }

      const dateObj =
        typeof timeString === "string" ? new Date(timeString) : timeString;
      return dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Time formatting error:", error);
      return "Time unavailable";
    }
  };

  // Format the game date for display
  const renderGameDate = (date: string | Date) => {
    try {
      // Convert to string if it's a Date object
      const dateString =
        typeof date === "object" && date instanceof Date
          ? date.toISOString()
          : String(date);

      console.log("Formatting date:", {
        original: date,
        converted: dateString,
      });

      const gameDate = new Date(dateString);
      const today = new Date();

      // Reset time parts to midnight for comparison
      const gameDateOnly = new Date(gameDate);
      gameDateOnly.setHours(0, 0, 0, 0);

      const todayOnly = new Date(today);
      todayOnly.setHours(0, 0, 0, 0);

      // Check if it's today
      if (gameDateOnly.getTime() === todayOnly.getTime()) {
        return "Today";
      }

      // Check if it's tomorrow
      const tomorrowOnly = new Date(todayOnly);
      tomorrowOnly.setDate(todayOnly.getDate() + 1);

      if (gameDateOnly.getTime() === tomorrowOnly.getTime()) {
        return "Tomorrow";
      }

      // If the date is invalid, return a fallback
      if (isNaN(gameDate.getTime())) {
        console.log("Invalid date:", { date, gameDate });
        return "Date unavailable";
      }

      return formatDistanceToNow(gameDate, { addSuffix: true });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Date unavailable";
    }
  };

  // Split into upcoming and past games
  const upcomingGames = uniqueGames.filter((game) => !isInPast(game.date));
  const pastGames = uniqueGames.filter((game) => isInPast(game.date));

  console.log("Game counts:", {
    all: uniqueGames.length,
    upcoming: upcomingGames.length,
    past: pastGames.length,
  });

  // Log the first upcoming game for debugging
  if (upcomingGames.length > 0) {
    console.log("First upcoming game:", {
      id: upcomingGames[0].id,
      date: upcomingGames[0].date,
      startTime: upcomingGames[0].startTime,
      playersNeeded: upcomingGames[0].playersNeeded,
      participants: upcomingGames[0].participants?.length,
    });
  }

  return (
    <Card className="overflow-hidden h-full">
      <Tabs defaultValue="upcoming" className="w-full h-full flex flex-col">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Games</TabsTrigger>
          <TabsTrigger value="history">Game History</TabsTrigger>
        </TabsList>

        <TabsContent
          value="upcoming"
          className="p-6 max-h-[600px] overflow-y-auto flex-1"
        >
          {upcomingGames.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No upcoming games.
              {isOwnProfile && (
                <div className="mt-4">
                  <Link href="/schedule">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule a Game
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingGames.map((game) => (
                <Link href={`/games/${game.id}`} key={game.id}>
                  <div className="border rounded-xl p-4 hover:shadow-md transition-shadow bg-white mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{game.gameType}</h3>
                          <Badge variant="outline" className="text-xs">
                            {game.skillLevel}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {game.court?.name || "Unknown Court"}
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="text-sm font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded">
                          {renderGameDate(game.date)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(game.startTime, game.date)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t flex justify-between items-center">
                      <div className="flex -space-x-2">
                        {game.participants && game.participants.length > 0 ? (
                          <>
                            {game.participants
                              .slice(0, 3)
                              .map((participant, i) => (
                                <div
                                  key={i}
                                  className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200"
                                >
                                  {participant.avatarUrl ? (
                                    <Image
                                      width={32}
                                      height={32}
                                      src={participant.avatarUrl}
                                      alt={participant.name || "Participant"}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-xs font-bold">
                                      {participant.name
                                        ? participant.name
                                            .charAt(0)
                                            .toUpperCase()
                                        : "U"}
                                    </div>
                                  )}
                                </div>
                              ))}
                            {game.participants.length > 3 && (
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                                +{game.participants.length - 3}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-sm text-gray-500">
                            No participants yet
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {game.participants?.length || 0}/{game.playersNeeded}{" "}
                        players
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="history"
          className="p-6 max-h-[600px] overflow-y-auto flex-1"
        >
          {pastGames.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No game history available.
            </div>
          ) : (
            <div className="space-y-4">
              {pastGames.map((game) => (
                <Link href={`/games/${game.id}`} key={game.id}>
                  <div className="border rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{game.gameType}</h3>
                        <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {game.court.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-500">
                          {new Date(game.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default Games;
