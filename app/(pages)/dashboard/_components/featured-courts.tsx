"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getCourts } from "@/actions/courts";
import { getGames } from "@/actions/games/index";
import { Court, Game } from "@/types";

const FeaturedCourts = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [courtGames, setCourtGames] = useState<Record<string, Game[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourtsAndGames = async () => {
      try {
        // Fetch courts
        const courtsResult = await getCourts();

        if (courtsResult.success && courtsResult.courts) {
          const featuredCourts = courtsResult.courts.slice(0, 3);
          setCourts(featuredCourts as Court[]);

          // Fetch games for each court
          const gamesData: Record<string, Game[]> = {};

          for (const court of featuredCourts) {
            const gamesResult = await getGames({
              courtId: court.id,
              upcoming: true,
              limit: 2,
            });

            if (gamesResult.success && gamesResult.games) {
              // Filter games to only include upcoming games (today or in the future)
              const games = gamesResult.games as unknown as Game[];
              const upcomingGames = games.filter((game) =>
                isDateTodayOrFuture(game.date)
              );
              gamesData[court.id] = upcomingGames;
            }
          }

          setCourtGames(gamesData);
        }
      } catch (error) {
        console.error("Error fetching courts and games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourtsAndGames();
  }, []);

  // Helper function to check if a date is today or in the future
  const isDateTodayOrFuture = (dateString: string) => {
    try {
      // Log the date for debugging
      console.log("Checking date:", dateString);

      // Get the date parts only (no time, no timezone)
      const gameDate = new Date(dateString);
      const today = new Date();

      // Create date strings in YYYY-MM-DD format
      const gameDateStr = `${gameDate.getFullYear()}-${String(
        gameDate.getMonth() + 1
      ).padStart(2, "0")}-${String(gameDate.getDate()).padStart(2, "0")}`;
      const todayStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      // Log the comparison values
      console.log(`Comparing: Game date ${gameDateStr} >= Today ${todayStr}`);

      // Simple string comparison works reliably for YYYY-MM-DD format
      return gameDateStr >= todayStr;
    } catch (error) {
      console.error("Date comparison error:", error, "for date:", dateString);
      return false;
    }
  };

  // Check if a date is today
  const isToday = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();

      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    } catch (error) {
      console.error("Date comparison error:", error);
      return false;
    }
  };

  const formatGameDate = (dateString: string) => {
    try {
      if (isToday(dateString)) {
        return "Today";
      }

      const date = new Date(dateString);
      const today = new Date();

      // Check if it's tomorrow
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      if (
        date.getDate() === tomorrow.getDate() &&
        date.getMonth() === tomorrow.getMonth() &&
        date.getFullYear() === tomorrow.getFullYear()
      ) {
        return "Tomorrow";
      }

      return format(date, "MMM d");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const formatGameTime = (timeString: string) => {
    try {
      const time = new Date(timeString);
      return format(time, "h:mm a");
    } catch (error) {
      console.error("Time formatting error:", error);
      return "Invalid time";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Featured Courts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-24 w-24 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured Courts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {courts.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No courts available at this time.
            </div>
          ) : (
            courts.map((court) => (
              <div key={court.id}>
                <div className="flex gap-4 mb-3">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{court.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {court.city}, {court.state}
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/courts/${court.id}`}>
                        <Button variant="outline" size="sm">
                          View Court
                        </Button>
                      </Link>
                      <Link href={`/schedule?courtId=${court.id}`}>
                        <Button size="sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Games at this court */}
                <div className="ml-8 pl-4 border-l border-gray-200">
                  {courtGames[court.id]?.length ? (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-500">
                        Upcoming Games
                      </h4>
                      {courtGames[court.id].map((game) => (
                        <Link key={game.id} href={`/games/${game.id}`}>
                          <div className="bg-gray-50 hover:bg-gray-100 transition-colors p-2 rounded-md">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium text-sm">
                                  {game.gameType}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center">
                                  <Users className="h-3 w-3 mr-1" />
                                  {game.participants?.length || 0}/
                                  {game.playersNeeded}
                                </div>
                              </div>
                              <div>
                                <Badge variant="outline" className="text-xs">
                                  {formatGameDate(game.date)} •{" "}
                                  {formatGameTime(game.startTime)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 py-2">
                      No upcoming games.{" "}
                      <Link
                        href={`/schedule?courtId=${court.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        Schedule one!
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedCourts;
