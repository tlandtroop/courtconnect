"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Star,
  Users,
  MapPin,
  Loader2,
  Calendar,
  Clock,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import ProfileEditDialog from "@/components/profile-edit-dialog";
import { UserProfile } from "@/types";

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const userId = params.userId as string;
  const isOwnProfile = currentUser?.id === userId;

  // Function to fetch the profile data
  const fetchProfile = async () => {
    try {
      console.log("Fetching profile for userId:", userId);
      setLoading(true);

      const response = await fetch(`/api/users/${userId}`);

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error response:", errorData);
        throw new Error(
          `Failed to fetch profile: ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json();
      console.log("Profile data received:", data);
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && userId) {
      fetchProfile();
    } else {
      console.log("Not ready to fetch:", { isLoaded, userId });
    }
  }, [userId, isLoaded]);

  // Function to handle profile updates
  const handleProfileUpdated = () => {
    fetchProfile(); // Refresh the profile data
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-lg text-gray-500 flex flex-col items-center gap-2">
              <Loader2 className="size-6 animate-spin" />
              Loading profile...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-lg text-gray-500">Profile not found</div>
          </div>
        </div>
      </div>
    );
  }

  const renderGameDate = (date: string) => {
    const gameDate = new Date(date);
    const today = new Date();

    // Check if the date is today
    if (
      gameDate.getDate() === today.getDate() &&
      gameDate.getMonth() === today.getMonth() &&
      gameDate.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (
      gameDate.getDate() === tomorrow.getDate() &&
      gameDate.getMonth() === tomorrow.getMonth() &&
      gameDate.getFullYear() === tomorrow.getFullYear()
    ) {
      return "Tomorrow";
    }

    // Otherwise, show how far in the future/past
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header - Cover Image + Profile Info */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          {/* Cover Image */}
          <div className="h-48 w-full bg-gradient-to-r from-blue-400 to-blue-600 relative"></div>

          <div className="p-6 relative">
            {/* Avatar - positioned partly over the cover */}
            <div className="absolute -top-16 left-6 w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
              {profile.avatarUrl ? (
                <Image
                  width={128}
                  height={128}
                  src={profile.avatarUrl}
                  alt={profile.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-4xl font-bold">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="ml-36 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <Badge
                    variant="secondary"
                    className="text-blue-500 bg-blue-50"
                  >
                    {profile.rating.toFixed(1)} Rating
                  </Badge>
                </div>

                <p className="text-gray-500">@{profile.username}</p>

                {profile.location && (
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{profile.location}</span>
                  </div>
                )}
              </div>

              {/* Edit Profile Button (only shown if it's the user's own profile) */}
              {isOwnProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Bio - if available */}
            {profile.bio && (
              <div className="mt-6 text-gray-700 border-t pt-4">
                <p>{profile.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-3 bg-gray-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-500" />
                  Player Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-2">
                  <div className="p-4 text-center border-y border-r">
                    <div className="font-bold text-2xl ">
                      {profile.rating.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500">Rating</div>
                  </div>
                  <div className="p-4 text-center border-y">
                    <div className="font-bold text-2xl ">
                      {profile.gamesPlayed}
                    </div>
                    <div className="text-sm text-gray-500">Games Played</div>
                  </div>
                  <div className="p-4 text-center border-r">
                    <div className="font-bold text-2xl ">
                      {profile.courtsVisited}
                    </div>
                    <div className="text-sm text-gray-500">Courts Visited</div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="font-bold text-2xl ">
                      {profile.friends.length}
                    </div>
                    <div className="text-sm text-gray-500">Friends</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Friends List */}
            <Card>
              <CardHeader className="pb-3 bg-gray-50">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Friends
                  </div>
                  {profile.friends.length > 0 && (
                    <Link
                      href="/friends"
                      className="text-sm text-blue-500 hover:underline flex items-center"
                    >
                      View All
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {profile.friends.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    No friends added yet.
                    {isOwnProfile && (
                      <div className="mt-2">
                        <Link href="/players">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            Find Players
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {profile.friends.slice(0, 5).map((friend) => (
                      <Link href={`/profile/${friend.clerkId}`} key={friend.id}>
                        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                            {friend.avatarUrl ? (
                              <Image
                                width={40}
                                height={40}
                                src={friend.avatarUrl}
                                alt={friend.name || friend.username || "User"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">
                                {friend.name
                                  ? friend.name.charAt(0).toUpperCase()
                                  : "U"}
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium truncate">
                              {friend.name || friend.username || "User"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400" />
                              {friend.rating.toFixed(1)} rating
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Favorite Courts */}
            <Card>
              <CardHeader className="pb-3 bg-gray-50">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Favorite Courts
                  </div>
                  {profile.favorites.length > 0 && (
                    <Link
                      href="/courts"
                      className="text-sm text-blue-500 hover:underline flex items-center"
                    >
                      View All
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {profile.favorites.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    No favorite courts yet.
                    {isOwnProfile && (
                      <div className="mt-2">
                        <Link href="/courts">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            Find Courts
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {profile.favorites.slice(0, 3).map((court) => (
                      <Link href={`/courts/${court.id}`} key={court.id}>
                        <div className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                              <div className="font-medium">{court.name}</div>
                              <div className="text-sm text-gray-500">
                                {court.city}, {court.state}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area - Games */}
          <div className="lg:col-span-2 space-y-6">
            {/* Games Tabs */}
            <Card>
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger
                    value="upcoming"
                    onClick={() => setActiveTab("upcoming")}
                  >
                    Upcoming Games
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    onClick={() => setActiveTab("history")}
                  >
                    Game History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="p-6">
                  {profile.createdGames.length === 0 ? (
                    <div className="text-center text-gray-500 py-6">
                      No upcoming games.
                      {isOwnProfile && (
                        <div className="mt-4">
                          <Link href="/schedule">
                            <Button className="w-full sm:w-auto">
                              <Calendar className="w-4 h-4 mr-2" />
                              Schedule a Game
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profile.createdGames.map((game) => (
                        <Link href={`/games/${game.id}`} key={game.id}>
                          <div className="border rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">
                                    {game.gameType}
                                  </h3>
                                  <Badge variant="outline" className="text-xs">
                                    {game.skillLevel}
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {game.court.name}
                                </div>
                              </div>
                              <div className="text-right flex flex-col items-end">
                                <div className="text-sm font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                  {renderGameDate(game.date)}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTime(game.startTime)}
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 pt-3 border-t flex justify-between items-center">
                              <div className="flex -space-x-2">
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
                                          alt={
                                            participant.name || "Participant"
                                          }
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
                              </div>
                              <div className="text-sm text-gray-500">
                                {game.participants.length}/{game.playersNeeded}{" "}
                                players
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history" className="p-6">
                  {profile.games.length === 0 ? (
                    <div className="text-center text-gray-500 py-6">
                      No game history available.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profile.games.map((game) => (
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
                                  {new Date(game.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </div>
                                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                                  <Star className="w-3 h-3 mr-1 text-yellow-500" />
                                  {profile.rating.toFixed(1)}
                                </Badge>
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
          </div>
        </div>
      </div>

      {/* Profile Edit Dialog */}
      {isOwnProfile && (
        <ProfileEditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onProfileUpdated={handleProfileUpdated}
          userId={userId}
        />
      )}
    </div>
  );
}
