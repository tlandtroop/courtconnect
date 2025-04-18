"use client";

import { useEffect, useState, useCallback } from "react";
import { Court } from "@prisma/client";

interface GoogleMapsProps {
  searchValue: string;
  courts: Court[];
}

const GoogleMaps = ({ searchValue }: GoogleMapsProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 29.652, // Default to Gainesville
    lng: -82.325,
  });

  const getLocation = useCallback(async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          }
        );
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      } catch (err) {
        console.warn("Unable to retrieve user location, using default:", err);
      }
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  if (!apiKey) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="bg-gray-200 h-[600px] rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Google Maps API key is not configured</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="bg-gray-200 h-[600px] rounded-lg flex items-center justify-center">
        <iframe
          className="w-full h-full rounded-lg"
          width="100%"
          height="100%"
          loading="lazy"
          src={
            "https://www.google.com/maps/embed/v1/search?key=" +
            apiKey +
            "&q=" +
            searchValue +
            "&center=" +
            coordinates.lat +
            "," +
            coordinates.lng +
            "&zoom=15"
          }
          suppressHydrationWarning
        ></iframe>
      </div>
    </div>
  );
};

export default GoogleMaps;
