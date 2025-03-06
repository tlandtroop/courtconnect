"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Star, Users, MapPin, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface Game {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  gameType: string;
  skillLevel: string;
  playersNeeded: number;
  notes?: string;
  court: {
    id: string;
    name: string;
  };
  participants: {
    id: string;
    name?: string;
    username?: string;
    avatarUrl?: string;
  }[];
}

interface Court {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
}

interface Friend {
  id: string;
  clerkId: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  rating: number;
}

interface UserProfile {
  id: string;
  clerkId: string;
  name?: string;
  username?: string;
  email: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  rating: number;
  gamesPlayed: number;
  courtsVisited: number;
  games: Game[];
  createdGames: Game[];
  favorites: Court[];
  friends: Friend[];
}

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  const userId = params.userId as string;
  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching profile for userId:", userId);
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

    if (isLoaded && userId) {
      fetchProfile();
    } else {
      console.log("Not ready to fetch:", { isLoaded, userId });
    }
  }, [userId, isLoaded]);

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

    // Check if it's tomorrow
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

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
              {profile.avatarUrl ? (
                <Image
                  width={32}
                  height={32}
                  src={profile.avatarUrl}
                  alt={profile.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <p className="text-gray-500">@{profile.username}</p>
                  {profile.location && (
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{profile.location}</span>
                    </div>
                  )}
                  {profile.bio && (
                    <p className="mt-3 text-gray-700">{profile.bio}</p>
                  )}
                </div>
                {isOwnProfile && (
                  <Link href={`/profile/edit/${userId}`}>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                      <Settings className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="font-bold text-xl">{profile.gamesPlayed}</div>
                  <div className="text-sm text-gray-500">Games Played</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">
                    {profile.rating.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">
                    {profile.friends.length}
                  </div>
                  <div className="text-sm text-gray-500">Friends</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">
                    {profile.courtsVisited}
                  </div>
                  <div className="text-sm text-gray-500">Courts Visited</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="col-span-8 space-y-6">
            {/* Games Tab Navigation */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex border-b">
                <button
                  className={`flex-1 py-3 text-center font-medium ${
                    activeTab === "upcoming"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("upcoming")}
                >
                  Upcoming Games
                </button>
                <button
                  className={`flex-1 py-3 text-center font-medium ${
                    activeTab === "history"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("history")}
                >
                  Game History
                </button>
              </div>

              {/* Upcoming Games */}
              {activeTab === "upcoming" && (
                <div className="p-6">
                  {profile.createdGames.length === 0 ? (
                    <div className="text-center text-gray-500 py-6">
                      No upcoming games.
                      {isOwnProfile && (
                        <div className="mt-2">
                          <Link href="/schedule">
                            <span className="text-blue-600 hover:underline">
                              Schedule a game
                            </span>
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profile.createdGames.map((game) => (
                        <div
                          key={game.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="space-y-1">
                            <div className="font-medium">{game.gameType}</div>
                            <div className="text-sm text-gray-500">
                              {game.court.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {game.participants.length}/{game.playersNeeded}{" "}
                              players joined
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {formatTime(game.startTime)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {renderGameDate(game.date)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Game History */}
              {activeTab === "history" && (
                <div className="p-6">
                  {profile.games.length === 0 ? (
                    <div className="text-center text-gray-500 py-6">
                      No game history available.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profile.games.map((game) => (
                        <div
                          key={game.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="space-y-1">
                            <div className="font-medium">{game.gameType}</div>
                            <div className="text-sm text-gray-500">
                              {game.court.name}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              {new Date(game.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1 mt-1 justify-end">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm font-medium">
                                {profile.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Favorite Courts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Favorite Courts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.favorites.length === 0 ? (
                  <div className="text-center text-gray-500 py-3">
                    No favorite courts yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile.favorites.map((court) => (
                      <Link href={`/courts/${court.id}`} key={court.id}>
                        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium">{court.name}</div>
                            <div className="text-sm text-gray-500">
                              {court.city}, {court.state}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Friends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Friends
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.friends.length === 0 ? (
                  <div className="text-center text-gray-500 py-3">
                    No friends added yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile.friends.map((friend) => (
                      <Link href={`/profile/${friend.clerkId}`} key={friend.id}>
                        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                            {friend.avatarUrl ? (
                              <Image
                                width={10}
                                height={10}
                                src={friend.avatarUrl}
                                alt={friend.name || friend.username || "User"}
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div>
                            <div className="font-medium">
                              {friend.name || friend.username || "User"}
                            </div>
                            <div className="text-sm text-gray-500">
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
          </div>
        </div>
      </div>
    </div>
  );
}
