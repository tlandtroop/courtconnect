"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { UserProfile } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GameFinder from "@/app/(pages)/dashboard/_components/game-finder";
import FeaturedCourts from "@/app/(pages)/dashboard/_components/featured-courts";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`/api/v1/users?id=${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const data = await response.json();
        if (data.success && data.user) {
          setProfile(data.user as unknown as UserProfile);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && user) {
      fetchUserProfile();
    }
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to view your dashboard.</div>;
  }

  // This helper function is kept for potential future personalization features
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
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback>
                    {user.firstName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">
                    Welcome back, {user.firstName || "Player"}!
                  </h1>
                  <p className="text-gray-500">Ready to hit the courts?</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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

          <Link href={`/profile/${user?.id}`} className="block">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-amber-100 text-amber-700 p-2 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">My Profile</h3>
                  <p className="text-sm text-gray-500">View your profile</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="games" className="space-y-6">
          <TabsList>
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="courts">Courts</TabsTrigger>
          </TabsList>

          <TabsContent value="games" className="space-y-6">
            <GameFinder initialSortBy="date" />
          </TabsContent>

          <TabsContent value="courts" className="space-y-6">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12">
                <FeaturedCourts />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
