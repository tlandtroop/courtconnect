import Link from "next/link";
import { Calendar, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UpcomingGames = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Upcoming Games
          </span>
          <Link href="/schedule">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Schedule Game
            </Button>
          </Link>
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
