import { MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Map from "./map";

const sampleCourts = [
  {
    id: "1",
    name: "Northside Park Courts",
    latitude: 29.707423,
    longitude: -82.353998,
  },
  {
    id: "2",
    name: "Trinity Church Courts",
    latitude: 29.707749,
    longitude: -82.382047,
  },
];

const MapPreview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Nearby Courts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-200 rounded-lg flex items-center justify-center">
          <Map courts={sampleCourts} />
        </div>
      </CardContent>
    </Card>
  );
};

export default MapPreview;
