"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { MapPin, Plus } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourtGameParticipant {
  id: string;
  name: string | null;
  avatarUrl: string | null;
}

interface CourtGame {
  id: string;
  date: Date;
  startTime: Date;
  gameType: string;
  skillLevel: string;
  playersNeeded: number;
  participants: CourtGameParticipant[];
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
  courtType: string | null;
  amenities: string[];
  images: string[];
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
      <div className="min-h-screen">
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
      <div className="min-h-screen">
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Court Header */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{court.name}</CardTitle>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {court.address || `${court.city}, ${court.state}`}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Court Image */}
                <div className="relative rounded-lg overflow-hidden bg-gray-200 h-64">
                  {court.images && court.images.length > 0 ? (
                    <Image
                      src={court.images[0]}
                      alt={court.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      No image available
                    </div>
                  )}
                </div>

                {/* Court Description */}
                {court.description && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">About</h3>
                    <p className="text-gray-600">{court.description}</p>
                  </div>
                )}

                {/* Court Type and Amenities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Court Type */}
                  {court.courtType && (
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">
                        Court Type
                      </h3>
                      <p className="text-gray-600">{court.courtType}</p>
                    </div>
                  )}

                  {/* Amenities */}
                  {court.amenities && court.amenities.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">
                        Amenities
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {court.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Games */}
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
                    {court.games.map((game) => (
                      <div
                        key={game.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{game.gameType}</h3>
                            <p className="text-sm text-gray-500">
                              {format(new Date(game.date), "EEEE, MMMM d")} at{" "}
                              {format(new Date(game.startTime), "h:mm a")}
                            </p>
                            <p className="text-sm text-gray-500">
                              {game.skillLevel} • {game.participants.length}/
                              {game.playersNeeded} players
                            </p>
                          </div>
                          <Link href={`/games/${game.id}`}>
                            <Button variant="outline" size="sm">
                              View Game
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No upcoming games scheduled
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Location Card */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <a
                      href={`https://www.google.com/maps/place/${encodeURIComponent(
                        court.address || court.name
                      )}/@${court.latitude},${court.longitude},17z`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      {court.address}
                    </a>
                    {court.city && court.state && (
                      <p className="text-sm text-gray-500">
                        {court.city}, {court.state}
                      </p>
                    )}
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps/place/${encodeURIComponent(
                    court.address || court.name
                  )}/@${court.latitude},${court.longitude},17z`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button variant="outline" className="w-full">
                    <MapPin className="h-4 w-4 mr-2" />
                    Open in Google Maps
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
