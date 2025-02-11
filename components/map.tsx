"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  courts?: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  }>;
  center?: [number, number];
  zoom?: number;
}

export default function Map({
  courts = [],
  center = [29.6516, -82.3248], // Default to Gainesville, FL
  zoom = 13,
}: MapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-[600px] w-full rounded-lg z-0"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {courts.map((court) => (
        <Marker key={court.id} position={[court.latitude, court.longitude]}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{court.name}</h3>
              {/* Add more court details here */}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
