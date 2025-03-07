"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Calendar, CheckCircle, MapPin, Users, Award } from "lucide-react";
import Link from "next/link";

import Navbar from "@/components/navbar";
import UpcomingGames from "@/components/dashboard/upcoming-games";
import Weather from "@/components/dashboard/weather";
import RecentActivity from "@/components/dashboard/recent-activity";
import DashboardGoogleMaps from "@/components/dashboard/google-maps";
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
import { UserProfile } from "@/types";
import Stats from "@/components/dashboard/stats";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [nearbyGamesCount, setNearbyGamesCount] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        await fetch("/api/sync-user", { method: "POST" });

        const response = await fetch(`/api/users/${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();

        // Calculate profile completion percentage
        const requiredFields = [
          "name",
          "username",
          "bio",
          "location",
          "avatarUrl",
        ];
        const filledFields = requiredFields.filter((field) => !!data[field]);
        const completionPercentage = Math.round(
          (filledFields.length / requiredFields.length) * 100
        );

        setProfile({
          ...data,
          profileCompletionPercentage: completionPercentage,
        });

        // Fetch nearby games count (example)
        const gamesResponse = await fetch("/api/games/nearby");
        if (gamesResponse.ok) {
          const gamesData = await gamesResponse.json();
          setNearbyGamesCount(gamesData.count || 0);
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
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Header */}
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
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
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

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - 8/12 width */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Profile Completion Card (shown only if profile is incomplete) */}
            {profile && profile.profileCompletionPercentage !== 100 && (
              <Card className="bg-blue-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    Complete Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Profile completion</span>
                      <span>{profile.profileCompletionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${profile.profileCompletionPercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm">
                    Complete your profile to help others find you and match with
                    players of similar skill levels.
                  </div>
                  <div className="mt-3">
                    <Link href={`/profile/${user?.id}`}>
                      <Button variant="outline" size="sm">
                        Complete Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Map with Nearby Courts */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>Courts Near You</span>
                  <Link href="/courts">
                    <Button variant="outline">View All</Button>
                  </Link>
                </CardTitle>
                <CardDescription>
                  {nearbyGamesCount > 0
                    ? `${nearbyGamesCount} games scheduled nearby`
                    : "Explore pickleball courts in your area"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardGoogleMaps />
              </CardContent>
            </Card>

            {/* Upcoming Games */}
            <UpcomingGames />
          </div>

          {/* Right Column - 4/12 width */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Player Stats Card */}
            {profile && <Stats profile={profile} />}

            {/* Weather Widget */}
            <Weather />

            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
