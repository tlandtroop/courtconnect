"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import GameFinder from "@/app/(main)/dashboard/_components/game-finder";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Game } from "@/types";

export default function GamesPage() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("find");
  const [myGames, setMyGames] = useState<Game[]>([]);
  const [gameHistory, setGameHistory] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"date" | "players" | "skill">("date");

  const fetchMyGames = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch upcoming games
      const upcomingResponse = await fetch(
        `/api/v1/games?userId=${user.id}&type=upcoming`
      );
      if (!upcomingResponse.ok) {
        throw new Error("Failed to fetch upcoming games");
      }
      const upcomingData = await upcomingResponse.json();
      if (upcomingData.success && upcomingData.games) {
        setMyGames(upcomingData.games as unknown as Game[]);
      }

      // Fetch game history
      const historyResponse = await fetch(
        `/api/v1/games?userId=${user.id}&type=history`
      );
      if (!historyResponse.ok) {
        throw new Error("Failed to fetch game history");
      }
      const historyData = await historyResponse.json();
      if (historyData.success && historyData.games) {
        setGameHistory(historyData.games as unknown as Game[]);
      }
    } catch (error) {
      console.error("Error fetching user games:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded && user && activeTab === "my-games") {
      fetchMyGames();
    }
  }, [isLoaded, user, activeTab, fetchMyGames]);

  // Helper function to check if a date is today or in the future
  const isDateTodayOrFuture = (dateString: string) => {
    const inputDate = new Date(dateString);
    const today = new Date();

    // Compare only the date parts
    const inputDateOnly = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      inputDate.getDate()
    );

    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // Date is today or in the future
    return inputDateOnly >= todayOnly;
  };

  // Filter games to ensure they're properly categorized
  const upcomingGames = myGames.filter((game) =>
    isDateTodayOrFuture(game.date)
  );
  const pastGames = gameHistory.filter(
    (game) => !isDateTodayOrFuture(game.date)
  );

  console.log("Upcoming count:", upcomingGames.length);
  console.log("Past count:", pastGames.length);

  const formatGameDate = (date: string) => {
    return format(new Date(date), "EEEE, MMMM d");
  };

  const formatGameTime = (time: string) => {
    return format(new Date(time), "h:mm a");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Games</h1>
          <p className="text-gray-500">Find and manage your games</p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="find">Find Games</TabsTrigger>
              <TabsTrigger value="my-games">My Games</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-4">
              <Select
                value={sortBy}
                onValueChange={(value) =>
                  setSortBy(value as "date" | "players" | "skill")
                }
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date (Soonest)</SelectItem>
                  <SelectItem value="players">Available Spots</SelectItem>
                  <SelectItem value="skill">Skill Level</SelectItem>
                </SelectContent>
              </Select>

              <Link href="/schedule">
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Game
                </Button>
              </Link>
            </div>
          </div>

          <TabsContent value="find" className="space-y-4">
            <GameFinder />
          </TabsContent>

          <TabsContent value="my-games">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="h-24 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Upcoming Games */}
                <div>
                  {upcomingGames.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-gray-500 mb-4">
                          You haven&apos;t joined any upcoming games yet.
                        </p>
                        <Link href="/schedule">
                          <Button>Schedule a Game</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                      {upcomingGames.map((game) => (
                        <Link key={game.id} href={`/games/${game.id}`}>
                          <Card className="h-full hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-medium">
                                    {game.gameType}
                                  </h3>
                                  <div className="text-sm text-gray-500 flex items-center mt-1">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {game.court?.name || "Unknown court"}
                                  </div>
                                </div>
                                <Badge>{game.skillLevel}</Badge>
                              </div>

                              <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between">
                                  <div>
                                    <div className="text-sm font-medium">
                                      {formatGameDate(game.date)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {formatGameTime(game.startTime)}
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {game.participants?.length || 0}/
                                    {game.playersNeeded} players
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Game History */}
                <div>
                  <h2 className="text-lg font-medium mb-4">Game History</h2>
                  {pastGames.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-gray-500">No game history yet.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {pastGames.map((game) => (
                        <Link key={game.id} href={`/games/${game.id}`}>
                          <Card className="hover:bg-gray-50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium">
                                    {game.gameType}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {formatGameDate(game.date)} •{" "}
                                    {game.court?.name}
                                  </div>
                                </div>
                                <Badge variant="outline">
                                  {game.skillLevel}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
