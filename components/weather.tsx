import { CloudRain } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Weather = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudRain className="w-5 h-5" />
          Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl font-bold">72°</div>
            <div className="text-right">
              <div className="font-medium">Partly Cloudy</div>
              <div className="text-sm text-gray-500">Gainesville, FL</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="p-2 bg-white rounded">
              <div className="font-medium">75°</div>
              <div className="text-gray-500">High</div>
            </div>
            <div className="p-2 bg-white rounded">
              <div className="font-medium">65°</div>
              <div className="text-gray-500">Low</div>
            </div>
            <div className="p-2 bg-white rounded">
              <div className="font-medium">10%</div>
              <div className="text-gray-500">Rain</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Weather;
