"use client";

import { useEffect, useState } from "react";

const GoogleMaps = ({ searchValue }: any) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;
  const locKey = process.env.NEXT_PUBLIC_LOCATION_API;
  const locStr = "https://ipgeolocation.abstractapi.com/v1/?api_key=" + locKey;
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 37.7749, // Default coordinates (San Francisco)
    lng: -122.4194
  });
  useEffect(() => {
    // Get user's current location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.warn("Unable to retrieve user location, using default");
        }
      );
    }
  }, []);
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="bg-gray-200 h-[600px] rounded-lg flex items-center justify-center">
        <iframe
          className="bg-gray-200 h-[600px] rounded-lg flex items-center justify-center"
          width="100%"
          height="100%"
          loading="lazy"
          src={
            "https://www.google.com/maps/embed/v1/search?key=" +
            apiKey +
            "&q=" +
            searchValue +
            "&center=" +
            coordinates.lat + "," + coordinates.lng +
            "&zoom=15"
          }
          suppressHydrationWarning
        ></iframe>
      </div>
    </div>
  );
};

export default GoogleMaps;
