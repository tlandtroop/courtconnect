"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { format, isPast } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  MessageCircle,
  Share2,
  ChevronLeft,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Game, UserProfile } from "@/types";

import { getGame } from "@/actions/games/game";
import { getUserProfile } from "@/actions/users/profile";
import { joinGame, leaveGame } from "@/actions/games/participate";
import { isGameInPast, formatDate, formatTime } from "@/lib/date-utils";

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const gameId = params.gameId as string;

  const [game, setGame] = useState<Game | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        // Call server action to get game details
        const result = await getGame(gameId);

        if (result.success && result.game) {
          // Cast through unknown first to avoid type checking
          setGame(result.game as unknown as Game);
        } else {
          console.error("Error fetching game:", result.error);
          toast.error("Failed to load game details");
        }
      } catch (error) {
        console.error("Error fetching game:", error);
        toast.error("Failed to load game details");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;

      try {
        // Call server action to get user profile
        const result = await getUserProfile(user.id);

        if (result.success && result.user) {
          // Cast through unknown first to avoid type checking
          setUserProfile(result.user as unknown as UserProfile);
        } else {
          console.error("Error fetching user profile:", result.error);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (isLoaded && user) {
      fetchUserProfile();
    }
  }, [user, isLoaded]);

  // Handle joining a game
  const handleJoinGame = async () => {
    if (!user || !userProfile) {
      toast.error("You must be logged in to join a game");
      return;
    }

    try {
      setIsJoining(true);

      // Call server action to join game
      const result = await joinGame(gameId);

      if (!result.success) {
        throw new Error(result.error || "Failed to join game");
      }

      // Update the game data with the new participant
      if (result.game) {
        // Cast through unknown first to avoid type checking
        setGame(result.game as unknown as Game);
        toast.success("You have joined the game!");
      }
    } catch (error: unknown) {
      console.error("Error joining game:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to join the game"
      );
    } finally {
      setIsJoining(false);
    }
  };

  // Handle leaving a game
  const handleLeaveGame = async () => {
    try {
      setIsLeaving(true);

      // Call server action to leave game
      const result = await leaveGame(gameId);

      if (!result.success) {
        throw new Error(result.error || "Failed to leave game");
      }

      // Update the game data with the participant removed
      if (result.game) {
        // Cast through unknown first to avoid type checking
        setGame(result.game as unknown as Game);
        toast.success("You have left the game");
      }
    } catch (error: unknown) {
      console.error("Error leaving game:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to leave the game"
      );
    } finally {
      setIsLeaving(false);
      setShowLeaveDialog(false);
    }
  };

  // Check if the current user is already a participant
  const isParticipant = () => {
    if (!game || !userProfile || !game.participants) return false;

    return game.participants.some(
      (participant) => participant.id === userProfile.id
    );
  };

  // Check if the game is full
  const isGameFull = () => {
    if (!game || !game.participants) return false;

    return game.participants.length >= game.playersNeeded;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-lg text-gray-500">Loading game details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Game Not Found
              </h1>
              <p className="text-gray-500 mb-6">
                The game you&apos;re looking for doesn&apos;t exist or has been
                removed.
              </p>
              <Link href="/dashboard">
                <Button>Return to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>

        {/* Game Header Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{game.gameType}</h1>
                  <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-300 bg-blue-50"
                  >
                    {game.skillLevel}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(game.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(game.startTime)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  {game.court && game.court.id ? (
                    <Link href={`/courts/${game.court.id}`}>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        {game.court.name || "Court Details"}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      disabled
                    >
                      <MapPin className="h-4 w-4" />
                      {game.court?.name || "Court Not Available"}
                    </Button>
                  )}

                  <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                    <Users className="h-4 w-4" />
                    <span>
                      {game.participants?.length || 0}/{game.playersNeeded}{" "}
                      players
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {!isLoaded || !userProfile ? (
                  <div className="flex justify-center py-2">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  </div>
                ) : isGameInPast(game) ? (
                  <Badge
                    variant="secondary"
                    className="px-3 py-2 text-yellow-700 bg-yellow-100"
                  >
                    This game has already taken place
                  </Badge>
                ) : isParticipant() ? (
                  <div className="flex flex-col gap-2">
                    <Badge
                      variant="secondary"
                      className="px-3 py-2 text-green-700 bg-green-100"
                    >
                      You&apos;re joining this game
                    </Badge>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setShowLeaveDialog(true)}
                      disabled={
                        isLeaving ||
                        (game.organizer && game.organizer.id === userProfile.id)
                      }
                    >
                      {isLeaving ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {game.organizer && game.organizer.id === userProfile.id
                        ? "You're the organizer"
                        : "Leave Game"}
                    </Button>
                  </div>
                ) : isGameFull() ? (
                  <Badge
                    variant="secondary"
                    className="px-3 py-2 text-orange-700 bg-orange-100"
                  >
                    This game is full
                  </Badge>
                ) : (
                  <Button
                    onClick={handleJoinGame}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isJoining}
                  >
                    {isJoining ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Join This Game
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Game Details */}
            <Card>
              <CardHeader>
                <CardTitle>Game Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {game.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Notes from Organizer
                    </h3>
                    <p className="text-gray-700">{game.notes}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Organized by
                  </h3>
                  {game.organizer ? (
                    <Link href={`/profile/${game.organizer.clerkId || ""}`}>
                      <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <Avatar>
                          <AvatarImage src={game.organizer.avatarUrl} />
                          <AvatarFallback>
                            {game.organizer.name
                              ? game.organizer.name.charAt(0).toUpperCase()
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {game.organizer.name || "User"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {game.organizer.username
                              ? `@${game.organizer.username}`
                              : ""}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="p-3 text-gray-500">
                      Organizer information not available
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Equipment
                  </h3>
                  <p className="text-gray-700">
                    {game.gameType && game.gameType.includes("Pickleball") ? (
                      <>Bring your own paddle and pickleballs if possible.</>
                    ) : game.gameType &&
                      game.gameType.includes("Basketball") ? (
                      <>Bring a basketball if possible.</>
                    ) : (
                      <>No specific equipment listed.</>
                    )}
                  </p>
                </div>

                <Separator />

                <div className="flex gap-4">
                  <Button variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>

                  <Button variant="outline" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Contact Organizer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Court Details */}
            <Card>
              <CardHeader>
                <CardTitle>Court Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-gray-400" />
                </div>

                {!game.court ? (
                  <div className="text-center py-4 text-gray-500">
                    <p>Court information is not available.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Address
                      </h3>
                      <p className="text-gray-700">
                        {game.court.address || "No address provided"}
                        {game.court.city && game.court.state && (
                          <>
                            , {game.court.city}, {game.court.state}
                          </>
                        )}
                        {game.court.zipCode && <> {game.court.zipCode}</>}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Features
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {game.court.hasLights && (
                          <Badge variant="outline">Lights</Badge>
                        )}
                        {game.court.hasWaterFountain && (
                          <Badge variant="outline">Water Fountain</Badge>
                        )}
                        {game.court.hasRestrooms && (
                          <Badge variant="outline">Restrooms</Badge>
                        )}
                        {game.court.isPickleball && (
                          <Badge variant="outline">Pickleball</Badge>
                        )}
                        {game.court.isBasketball && (
                          <Badge variant="outline">Basketball</Badge>
                        )}
                        {!game.court.hasLights &&
                          !game.court.hasWaterFountain &&
                          !game.court.hasRestrooms &&
                          !game.court.isPickleball &&
                          !game.court.isBasketball && (
                            <span className="text-gray-500">
                              No features listed
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Side Content */}
          <div className="space-y-6">
            {/* Players Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Players</span>
                  <Badge className="bg-blue-100 text-blue-700">
                    {game.participants?.length || 0}/{game.playersNeeded}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {!game.participants || game.participants.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No players have joined yet.
                    </div>
                  ) : (
                    <>
                      {game.participants.map((participant) => (
                        <Link
                          href={`/profile/${participant.clerkId}`}
                          key={participant.id}
                          className="block"
                        >
                          <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <Avatar>
                              <AvatarImage src={participant.avatarUrl} />
                              <AvatarFallback>
                                {participant.name
                                  ? participant.name.charAt(0).toUpperCase()
                                  : "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">
                                {participant.name || "User"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {participant.username
                                  ? `@${participant.username}`
                                  : ""}
                              </div>
                            </div>
                            {participant.id === game.organizer.id && (
                              <Badge
                                variant="outline"
                                className="text-blue-600"
                              >
                                Organizer
                              </Badge>
                            )}
                          </div>
                        </Link>
                      ))}
                    </>
                  )}
                </div>

                {!isGameInPast(game) &&
                  !isGameFull() &&
                  !isParticipant() &&
                  userProfile && (
                    <div className="mt-4">
                      <Button
                        onClick={handleJoinGame}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={isJoining}
                      >
                        {isJoining ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Join This Game
                      </Button>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Recommended Games */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Games</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center py-4 text-gray-500">
                    <p>Recommended games will appear here.</p>
                    <Link href="/courts">
                      <Button variant="link" className="mt-2">
                        Find more games
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Leave Game Confirmation Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave this game?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave this game? Your spot will be made
              available for other players.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLeaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleLeaveGame();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isLeaving}
            >
              {isLeaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Leave Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
