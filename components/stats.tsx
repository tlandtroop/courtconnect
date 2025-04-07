import React from "react";
import { UserProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Calendar, MapPin, Users } from "lucide-react";

interface PlayerStatsProps {
  profile: UserProfile;
}

const PlayerStats = ({ profile }: PlayerStatsProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-3 bg-gray-50">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-blue-500" />
          Player Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold">
                {profile.rating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">Rating</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold">{profile.gamesPlayed}</div>
              <div className="text-sm text-gray-500">Games</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold">{profile.courtsVisited}</div>
              <div className="text-sm text-gray-500">Courts</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold">
                {profile.friends?.length || 0}
              </div>
              <div className="text-sm text-gray-500">Friends</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerStats;
