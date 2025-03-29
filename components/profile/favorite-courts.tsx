import Link from "next/link";
import { Star, MapPin, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";

interface FavoriteCourtProps {
  profile: UserProfile;
  isOwnProfile: boolean;
}

const FavoriteCourts = ({ profile, isOwnProfile }: FavoriteCourtProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-3 bg-gray-50">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Favorite Courts
          </div>
          {profile.favorites.length > 0 && (
            <Link
              href="/courts"
              className="text-sm text-blue-500 hover:underline flex items-center"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {profile.favorites.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No favorite courts yet.
            {isOwnProfile && (
              <div className="mt-2">
                <Link href="/courts">
                  <Button variant="outline" size="sm" className="w-full">
                    Find Courts
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {profile.favorites.slice(0, 3).map((court) => (
              <Link href={`/courts/${court.id}`} key={court.id}>
                <div className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium">{court.name}</div>
                      <div className="text-sm text-gray-500">
                        {court.city}, {court.state}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoriteCourts;
