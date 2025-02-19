import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WeatherForecast = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3].map((forecast) => (
            <div
              key={forecast}
              className="flex items-center justify-between p-2"
            >
              <div className="text-sm">2:00 PM</div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="text-sm">72°</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
