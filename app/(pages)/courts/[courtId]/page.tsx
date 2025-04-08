"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Users,
  ChevronRight,
  Plus,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CourtGameParticipant {
  id: string;
  clerkId: string;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  rating: number;
}

interface CourtGame {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date | null;
  gameType: string;
  skillLevel: string;
  playersNeeded: number;
  notes: string | null;
  status: string;
  participants: CourtGameParticipant[];
  organizer: CourtGameParticipant;
}

interface CourtDetail {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  courtType: string | null;
  amenities: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  games: CourtGame[];
}

export default function CourtDetailPage() {
  const params = useParams();
  const [court, setCourt] = useState<CourtDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const courtId = params.courtId as string;
        const response = await fetch(`/api/v1/courts?id=${courtId}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to load court details");
        }
        const data = await response.json();
        if (data.success) {
          setCourt(data.court as CourtDetail);
        } else {
          setError(data.error || "Failed to load court details");
        }
      } catch (error) {
        console.error("Error fetching court:", error);
        setError("An error occurred while fetching the court details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourt();
  }, [params.courtId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading court details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !court) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-500">{error || "Court not found"}</p>
            <Link href="/courts">
              <Button variant="link" className="mt-4">
                Back to Courts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/courts" className="hover:text-blue-600">
            Courts
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="font-medium text-gray-700">{court.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Court Info */}
          <div className="col-span-2 space-y-6">
            {/* Court Header */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{court.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {court.address || `${court.city}, ${court.state}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-blue-500 text-blue-500" />
                    <span className="font-medium">
                      {court.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({court.reviewCount})
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="mt-4 flex flex-wrap gap-2">
                  {/* Court Type */}
                  {court.courtType && (
                    <Badge variant="outline" className="bg-gray-50">
                      {court.courtType}
                    </Badge>
                  )}

                  {/* Amenities */}
                  {court.amenities &&
                    court.amenities.map((amenity: string) => (
                      <Badge
                        key={amenity}
                        variant="outline"
                        className="bg-gray-50"
                      >
                        {amenity}
                      </Badge>
                    ))}
                </div>

                {/* Court Image or Map Placeholder */}
                <div className="mt-6 relative rounded-lg overflow-hidden bg-gray-200 h-64 flex items-center justify-center">
                  {court.images && court.images.length > 0 ? (
                    <Image
                      src={court.images[0]}
                      alt={court.name}
                      width={800}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">
                      Court image not available
                    </div>
                  )}
                </div>

                {/* Court Description */}
                {court.description && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-800 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600">{court.description}</p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between pt-2 border-t">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Available 6:00 AM - 10:00 PM</span>
                </div>
                <Link
                  href={`/schedule?courtId=${court.id}`}
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Game Here
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Upcoming Games at this Court */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Games</CardTitle>
                  <Link href={`/schedule?courtId=${court.id}`}>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Game
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {court.games && court.games.length > 0 ? (
                  <div className="space-y-4">
                    {court.games.map((game: CourtGame) => (
                      <Link href={`/games/${game.id}`} key={game.id}>
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="space-y-1">
                            <div className="font-medium">{game.gameType}</div>
                            <div className="text-sm text-gray-500">
                              <Badge variant="outline" className="mr-2">
                                {game.skillLevel}
                              </Badge>
                              <span className="inline-flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {game.participants.length}/{game.playersNeeded}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
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
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <Calendar className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p>No upcoming games at this court</p>
                    <Link href={`/schedule?courtId=${court.id}`}>
                      <Button variant="link" className="mt-2">
                        Schedule a game
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Location Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-200 rounded-lg h-48 mb-4 flex items-center justify-center">
                  {/* Map placeholder - would be replaced with actual map component */}
                  <MapPin className="h-8 w-8 text-gray-400" />
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-1">{court.address}</p>
                  <p>
                    {court.city}, {court.state} {court.zipCode}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    window.open(
                      `https://maps.google.com/?q=${court.latitude},${court.longitude}`,
                      "_blank"
                    )
                  }
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Open in Maps
                </Button>
              </CardFooter>
            </Card>

            {/* Court Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Court Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium mb-2">Amenities</div>
                  <div className="flex flex-wrap gap-2">
                    {court.amenities && court.amenities.length > 0 ? (
                      court.amenities.map((amenity: string) => (
                        <Badge
                          key={amenity}
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {amenity}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">
                        No amenities listed
                      </span>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="font-medium mb-2">Court Type</div>
                  <Badge className="bg-green-50 text-green-700 border-green-200">
                    {court.courtType || "Not specified"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
