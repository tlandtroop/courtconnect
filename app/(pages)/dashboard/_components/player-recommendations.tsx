"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Star, MapPin, Calendar, UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { findPlayers } from "@/actions/players/index";
import { addFriend } from "@/actions/users/friends";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Player {
  id: string;
  clerkId: string;
  name: string;
  username: string;
  avatarUrl?: string;
  location?: string;
  rating: number;
  skillLevel: string;
}

const PlayerRecommendations = () => {
  const { user } = useUser();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingFriend, setAddingFriend] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendedPlayers = async () => {
      if (!user) return;

      try {
        const result = await findPlayers({
          sortBy: "rating",
          limit: 5,
        });

        if (result.success && result.players) {
          setPlayers(result.players as unknown as Player[]);
        }
      } catch (error) {
        console.error("Error fetching player recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRecommendedPlayers();
    }
  }, [user]);

  const handleAddFriend = async (e: React.MouseEvent, playerId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;
    setAddingFriend(playerId);

    try {
      const result = await addFriend(playerId);

      if (result.success) {
        toast.success("Friend added successfully!");
        // Remove player from recommendations
        setPlayers((current) => current.filter((p) => p.id !== playerId));
      } else {
        throw new Error(result.error || "Failed to add friend");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      toast.error("Failed to add friend");
    } finally {
      setAddingFriend(null);
    }
  };

  const handleScheduleGame = (e: React.MouseEvent, playerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/schedule?player=${playerId}`);
  };

  const getSkillLevelColor = (skillLevel: string) => {
    switch (skillLevel.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-purple-100 text-purple-800";
      case "all levels welcome":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Players You Might Like</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            ))}
          </div>
        ) : players.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p className="mb-3">
              No player recommendations available right now.
            </p>
            <Button variant="outline" onClick={() => router.push("/players")}>
              Browse Players
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {players.map((player) => (
              <Link
                href={`/profile/${player.clerkId}`}
                key={player.id}
                className="block"
              >
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={player.avatarUrl} />
                      <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="flex items-center text-sm text-gray-500 gap-2">
                        <span className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          {player.rating.toFixed(1)}
                        </span>
                        {player.location && (
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {player.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getSkillLevelColor(player.skillLevel)}>
                      {player.skillLevel}
                    </Badge>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={(e) => handleAddFriend(e, player.id)}
                      disabled={addingFriend === player.id}
                    >
                      {addingFriend === player.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="h-4 w-4 text-blue-500" />
                      )}
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={(e) => handleScheduleGame(e, player.id)}
                    >
                      <Calendar className="h-4 w-4 text-green-500" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}

            <div className="pt-3 text-center">
              <Button variant="link" onClick={() => router.push("/players")}>
                View All Players
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerRecommendations;
