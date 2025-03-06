import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@/types";

interface StatsProps {
  profile: UserProfile;
}

export default function Stats({ profile }: StatsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Your Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold">
              {profile.rating.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">Player Rating</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold ">{profile.gamesPlayed}</div>
            <div className="text-xs text-gray-500">Games Played</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold ">{profile.courtsVisited}</div>
            <div className="text-xs text-gray-500">Courts Visited</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold ">{profile.friends.length}</div>
            <div className="text-xs text-gray-500">Friends</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
