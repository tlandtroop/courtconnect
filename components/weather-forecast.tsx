"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, Wind } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface WeatherData {
  day: string;
  condition: "sunny" | "cloudy" | "rainy" | "windy";
  temperature: number;
}

const WeatherForecast = () => {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from a weather API
    // For now, we'll simulate with mock data
    const mockWeather: WeatherData[] = [
      {
        day: "Today",
        condition: "sunny",
        temperature: 76,
      },
      {
        day: "Tomorrow",
        condition: "cloudy",
        temperature: 72,
      },
      {
        day: "Thursday",
        condition: "rainy",
        temperature: 68,
      },
    ];

    // Simulate API delay
    setTimeout(() => {
      setWeather(mockWeather);
      setLoading(false);
    }, 1000);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case "cloudy":
        return <Cloud className="h-6 w-6 text-gray-500" />;
      case "rainy":
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      case "windy":
        return <Wind className="h-6 w-6 text-blue-300" />;
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Sun className="w-5 h-5 mr-2" />
          Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        ) : (
          <div className="space-y-2">
            {weather.map((day) => (
              <div
                key={day.day}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getWeatherIcon(day.condition)}
                  <span className="font-medium">{day.day}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {day.temperature}°F
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
