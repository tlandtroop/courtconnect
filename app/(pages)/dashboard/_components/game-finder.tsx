import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, Filter } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getGames } from "@/actions/games/index";
import { Game } from "@/types";

interface GameFinderProps {
  initialCourtId?: string;
  initialSkillLevel?: string;
  initialGameType?: string;
}

const GameFinder: React.FC<GameFinderProps> = ({
  initialCourtId,
  initialSkillLevel,
  initialGameType,
}) => {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [courtId, setCourtId] = useState(initialCourtId || "");
  const [gameType, setGameType] = useState(initialGameType || "");
  const [skillLevel, setSkillLevel] = useState(initialSkillLevel || "");
  const [hasSpots, setHasSpots] = useState(true);
  const [upcoming, setUpcoming] = useState(true);
  const [sortBy, setSortBy] = useState<"date" | "players" | "skill">("date");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchGames();
  }, [courtId, gameType, skillLevel, hasSpots, upcoming, page, sortBy]);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const result = await getGames({
        courtId: courtId || undefined,
        gameType: gameType || undefined,
        skillLevel: skillLevel || undefined,
        hasSpots,
        upcoming,
        page,
        limit: 5,
      });

      if (result.success && result.games) {
        setGames(result.games as unknown as Game[]);
        setTotalPages(result.pagination?.pages || 1);
      } else {
        console.error("Error fetching games:", result.error);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewGame = (gameId: string) => {
    router.push(`/games/${gameId}`);
  };

  const clearFilters = () => {
    setCourtId("");
    setGameType("");
    setSkillLevel("");
    setHasSpots(true);
    setUpcoming(true);
  };

  const formatGameDate = (date: string) => {
    const gameDate = new Date(date);
    const today = new Date();

    if (
      gameDate.getDate() === today.getDate() &&
      gameDate.getMonth() === today.getMonth() &&
      gameDate.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (
      gameDate.getDate() === tomorrow.getDate() &&
      gameDate.getMonth() === tomorrow.getMonth() &&
      gameDate.getFullYear() === tomorrow.getFullYear()
    ) {
      return "Tomorrow";
    }

    return format(gameDate, "MMM d");
  };

  const formatGameTime = (time: string) => {
    return format(new Date(time), "h:mm a");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 items-center">
          <h2 className="text-xl font-semibold">Find Games</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
        <div className="flex gap-2">
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
          <Button onClick={() => router.push("/schedule")} size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Game Type
                </label>
                <Select value={gameType} onValueChange={setGameType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All game types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All game types</SelectItem>
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

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Skill Level
                </label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="All skill levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All skill levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="All Levels Welcome">
                      All Levels Welcome
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col justify-end">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={hasSpots}
                      onChange={(e) => setHasSpots(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    Has open spots
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={upcoming}
                      onChange={(e) => setUpcoming(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    Upcoming only
                  </label>
                </div>

                <Button
                  variant="link"
                  onClick={clearFilters}
                  className="self-end mt-2 h-8 px-0"
                >
                  Clear filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
              There are no games matching your search criteria.
            </p>
            <div className="flex justify-center">
              <Button onClick={() => router.push("/schedule")}>
                Schedule a Game
              </Button>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center text-sm">
                  <span className="mx-2">
                    Page {page} of {totalPages}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameFinder;
