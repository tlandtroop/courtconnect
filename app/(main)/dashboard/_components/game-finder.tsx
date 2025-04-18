import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Game } from "@/types";

interface GameFinderProps {
  initialSortBy?: "date" | "players" | "skill";
}

const GameFinder: React.FC<GameFinderProps> = () => {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit] = useState(5);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/v1/games?page=1&limit=${limit}&sortBy=date&sortOrder=asc&upcoming=true`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch games");
      }
      const data = await response.json();
      if (data.success && data.games) {
        setGames(data.games);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const handleViewGame = (gameId: string) => {
    router.push(`/games/${gameId}`);
  };

  const formatGameDate = (dateString: string) => {
    try {
      const gameDate = new Date(dateString);
      const today = new Date();

      // Compare dates without time components
      const gameDateOnly = new Date(
        gameDate.getFullYear(),
        gameDate.getMonth(),
        gameDate.getDate()
      );

      const todayOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      // Check if it's today
      if (gameDateOnly.getTime() === todayOnly.getTime()) {
        return "Today";
      }

      // Check if it's tomorrow
      const tomorrow = new Date(todayOnly);
      tomorrow.setDate(today.getDate() + 1);

      if (
        gameDateOnly.getTime() ===
        new Date(
          tomorrow.getFullYear(),
          tomorrow.getMonth(),
          tomorrow.getDate()
        ).getTime()
      ) {
        return "Tomorrow";
      }

      return format(gameDate, "MMM d");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const formatGameTime = (timeString: string) => {
    try {
      return format(new Date(timeString), "h:mm a");
    } catch (error) {
      console.error("Time formatting error:", error);
      return "Invalid time";
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-60" />
                  </div>
                  <Skeleton className="h-10 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : games.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-4 flex justify-center">
              <Calendar className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium mb-2">No games found</h3>
            <p className="text-gray-500 mb-4">
              There are no upcoming games scheduled.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => router.push("/schedule")}
                className="text-blue-600 hover:text-blue-800"
              >
                Schedule a Game
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {games.map((game) => (
            <Card
              key={game.id}
              className="hover:shadow-md cursor-pointer transition-shadow"
              onClick={() => handleViewGame(game.id)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{game.gameType}</h3>
                      <Badge variant="outline">{game.skillLevel}</Badge>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      {game.court?.name || "Unknown court"}
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1 text-blue-500" />
                        <span>
                          {game.participants?.length || 0}/{game.playersNeeded}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <Avatar className="h-5 w-5 mr-1">
                          <AvatarImage
                            src={game.organizer?.avatarUrl || ""}
                            alt="Organizer"
                          />
                          <AvatarFallback>
                            {game.organizer?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span>{game.organizer?.name || "Unknown"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm font-medium mb-1">
                      {formatGameDate(game.date)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatGameTime(game.startTime)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameFinder;
