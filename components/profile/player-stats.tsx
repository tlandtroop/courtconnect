import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { UserProfile } from "@/types";

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
      <CardContent className="p-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg p-2 text-center bg-gray-50 border border-gray-100 shadow-sm">
            <div className="font-bold text-3xl">
              {profile.rating.toFixed(1)}
            </div>
            <div className="text-sm font-medium mt-1">Rating</div>
          </div>
          <div className="rounded-lg p-2 text-center bg-gray-50 border border-gray-100 shadow-sm">
            <div className="font-bold text-3xl">{profile.gamesPlayed}</div>
            <div className="text-sm font-medium mt-1">Games Played</div>
          </div>
          <div className="rounded-lg p-2 text-center bg-gray-50 border border-gray-100 shadow-sm">
            <div className="font-bold text-3xl">{profile.courtsVisited}</div>
            <div className="text-sm font-medium mt-1">Courts Visited</div>
          </div>
          <div className="rounded-lg p-2 text-center bg-gray-50 border border-gray-100 shadow-sm">
            <div className="font-bold text-3xl">{profile.friends.length}</div>
            <div className="text-sm font-medium mt-1">Friends</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerStats;
