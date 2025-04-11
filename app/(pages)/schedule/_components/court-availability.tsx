"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Court } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GooglePlace {
  place_id: string;
  name: string;
  vicinity: string;
}

interface CourtAvailabilityProps {
  onCourtSelect: (court: Court | null) => void;
}

const CourtAvailability = ({ onCourtSelect }: CourtAvailabilityProps) => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 29.652,
    lng: 82.325,
  });
  const [searchRadius, setSearchRadius] = useState<number>(5000); // Default 5km radius

  useEffect(() => {
    // Get user's current location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Unable to retrieve user location:", error.message);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const url = `/api/courts?lat=${coordinates.lat}&lng=${coordinates.lng}&radius=${searchRadius}`;
        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to load courts");
        }

        const data = await response.json();

        if (data.status === "OK" && data.results) {
          const transformedCourts: Court[] = data.results.map(
            (place: GooglePlace) => {
              const addressParts = place.vicinity
                ? place.vicinity.split(",")
                : [];
              const city =
                addressParts.length > 0
                  ? addressParts[addressParts.length - 1].trim()
                  : "";

              return {
                id: place.place_id,
                name: place.name,
                address: place.vicinity || "",
                city: city,
                state: "",
                latitude: 0, // Will be updated with actual coordinates
                longitude: 0,
                amenities: [],
                images: [],
                reviewCount: 0,
              };
            }
          );

          setCourts(transformedCourts);
          setError(null);
          // Select the first court by default if available
          if (transformedCourts.length > 0) {
            const firstCourt = transformedCourts[0];
            setSelectedCourt(firstCourt);
            onCourtSelect(firstCourt);
          }
        } else {
          setError(data.error_message || "No courts found in your area");
        }
      } catch (error) {
        console.error("Error fetching courts:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching courts"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, [coordinates, searchRadius, onCourtSelect]);

  const handleCourtSelect = (court: Court) => {
    setSelectedCourt(court);
    onCourtSelect(court);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Courts</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Search Radius</Label>
              <Select
                value={searchRadius.toString()}
                onValueChange={(value) => setSearchRadius(parseInt(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select radius" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000">1 km</SelectItem>
                  <SelectItem value="5000">5 km</SelectItem>
                  <SelectItem value="10000">10 km</SelectItem>
                  <SelectItem value="25000">25 km</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {courts.map((court) => (
                <div
                  key={court.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedCourt?.id === court.id
                      ? "border-blue-500 bg-blue-50"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => handleCourtSelect(court)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{court.name}</h3>
                      <p className="text-sm text-gray-500">
                        {court.address}
                        {court.city && `, ${court.city}`}
                        {court.state && `, ${court.state}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourtAvailability;
