"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GameFinder from "@/app/(pages)/dashboard/_components/game-finder";
import FeaturedCourts from "@/app/(pages)/dashboard/_components/featured-courts";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded]);

  if (!isLoaded || loading) {
    return;
  }

  if (!user) {
    return <div>Please sign in to view your dashboard.</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="mb-6">
        <Card className="mb-4">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link href="/schedule" className="block">
          <Card className="hover:shadow-md transition-shadow h-full">
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
          <Card className="hover:shadow-md transition-shadow h-full">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium">Find Courts</h3>
                <p className="text-sm text-gray-500">Discover places to play</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/profile/${user?.id}`} className="block">
          <Card className="hover:shadow-md transition-shadow h-full">
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
      <Tabs defaultValue="games" className="space-y-4">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="games" className="flex-1 md:flex-none">
            Games
          </TabsTrigger>
          <TabsTrigger value="courts" className="flex-1 md:flex-none">
            Courts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="games" className="space-y-4">
          <GameFinder initialSortBy="date" />
        </TabsContent>

        <TabsContent value="courts" className="space-y-4">
          <FeaturedCourts />
        </TabsContent>
      </Tabs>
    </div>
  );
}
