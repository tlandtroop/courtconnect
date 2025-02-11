import { Calendar } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UpcomingGames = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Upcoming Games
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((game) => (
            <div
              key={game}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="space-y-1">
                <div className="font-medium">Pickup Game #{game}</div>
                <div className="text-sm text-gray-500">Local Court Name</div>
                <div className="text-sm text-gray-500">4/6 players joined</div>
              </div>
              <div>
                <div className="text-sm font-medium">2:00 PM</div>
                <div className="text-sm text-gray-500">Today</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingGames;
