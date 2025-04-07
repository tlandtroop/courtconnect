"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Calendar, CheckCircle, MapPin, Users, Award } from "lucide-react";
import Link from "next/link";

import FeaturedCourts from "@/app/(pages)/dashboard/_components/featured-courts";
import PlayerRecommendations from "@/app/(pages)/dashboard/_components/player-recommendations";
import GameFinder from "@/app/(pages)/dashboard/_components/game-finder";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Stats from "@/components/stats";
import { UserProfile } from "@/types";

import { getDashboardProfile } from "@/actions/users/profile";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileCompletionPercentage, setProfileCompletionPercentage] =
    useState(0);
  const [activeTab, setActiveTab] = useState("games");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Remove this line:
        // await syncUser();

        // Keep the profile fetch:
        const result = await getDashboardProfile(user.id);

        if (result.success && result.user) {
          // Calculate profile completion percentage
          const requiredFields = [
            "name",
            "username",
            "bio",
            "location",
            "avatarUrl",
          ];
          const filledFields = requiredFields.filter(
            (field) => !!result.user[field as keyof typeof result.user]
          );
          const completionPercentage = Math.round(
            (filledFields.length / requiredFields.length) * 100
          );

          setProfile({
            ...(result.user as unknown as UserProfile),
            profileCompletionPercentage: completionPercentage,
          });
        } else {
          console.error("Error fetching profile:", result.error);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchUserProfile();
    }
  }, [user, isLoaded]);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          {loading || !profile ? (
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={user?.imageUrl}
                    alt={user?.fullName || "User"}
                  />
                  <AvatarFallback>
                    {user?.firstName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Good {getTimeOfDay()}, {user?.firstName || "Player"}!
                  </h1>
                  <p className="text-gray-500">
                    {profile.gamesPlayed > 0
                      ? `You've played ${profile.gamesPlayed} games so far`
                      : "Ready to schedule your first game?"}
                  </p>
                </div>
              </div>

              {profileCompletionPercentage < 100 && (
                <Card className="w-full md:w-auto bg-blue-50 border-blue-100">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium">Complete Your Profile</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${profileCompletionPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">
                        {profileCompletionPercentage}%
                      </span>
                      <Link href={`/profile/${user?.id}`}>
                        <Button size="sm" variant="outline">
                          Complete
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/schedule" className="block">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">Schedule Game</h3>
                  <p className="text-sm text-gray-500">Create a new game</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/courts" className="block">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">Find Courts</h3>
                  <p className="text-sm text-gray-500">
                    Discover places to play
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/players" className="block">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-purple-100 text-purple-700 p-2 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">Find Players</h3>
                  <p className="text-sm text-gray-500">Connect with others</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/profile/${user?.id}`} className="block">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-amber-100 text-amber-700 p-2 rounded-lg">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">My Profile</h3>
                  <p className="text-sm text-gray-500">View your stats</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="courts">Courts</TabsTrigger>
            <TabsTrigger value="players">Players</TabsTrigger>
          </TabsList>

          <TabsContent value="games" className="space-y-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column - Game Finder */}
              <div className="col-span-12 lg:col-span-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Find Games Near You</CardTitle>
                    <CardDescription>
                      Browse and join upcoming games
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GameFinder />
                  </CardContent>
                </Card>
              </div>

              <div className="col-span-12 lg:col-span-4 space-y-6">
                {profile && <Stats profile={profile} />}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courts" className="space-y-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column - Featured Courts */}
              <div className="col-span-12 lg:col-span-8">
                <FeaturedCourts />
              </div>

              {/* Right Column */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                {profile && <Stats profile={profile} />}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="players" className="space-y-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="col-span-12 lg:col-span-8">
                <PlayerRecommendations />
              </div>

              {/* Right Column */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                {profile && <Stats profile={profile} />}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
