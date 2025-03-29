import Link from "next/link";
import { Calendar, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUpcomingGames } from "@/actions/games";
import { Game } from "@/types";

const UpcomingGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const result = await getUpcomingGames();
        if (result.success && result.games) {
          setGames(result.games as unknown as Game[]);
        }
      } catch (error) {
        console.error("Error fetching upcoming games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Upcoming Games
          </span>
          <Link href="/schedule">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Schedule Game
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading games...</div>
        ) : games.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No upcoming games. Schedule one now!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {games.map((game) => (
              <Link
                href={`/games/${game.id}`}
                key={game.id}
                className="block hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{game.gameType}</div>
                    <div className="text-sm text-gray-500">
                      {game.court.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {game.participants.length}/{game.playersNeeded} players
                      joined
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {format(new Date(game.startTime), "h:mm a")}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(game.date), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingGames;
