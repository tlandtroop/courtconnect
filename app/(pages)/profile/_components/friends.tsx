import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { UserProfile } from "@/types";

interface FriendsProps {
  profile: UserProfile;
  isOwnProfile: boolean;
}

const Friends = ({ profile, isOwnProfile }: FriendsProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-3 bg-gray-50">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Friends
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {profile.friends.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No friends added yet.
            {isOwnProfile && (
              <div className="mt-2">
                <Link href="/players">
                  <Button variant="outline" size="sm" className="w-full">
                    Find Players
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {profile.friends.slice(0, 5).map((friend) => (
              <Link href={`/profile/${friend.clerkId}`} key={friend.id}>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                    {friend.avatarUrl ? (
                      <Image
                        width={40}
                        height={40}
                        src={friend.avatarUrl}
                        alt={friend.name || friend.username || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">
                        {friend.name
                          ? friend.name.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium truncate">
                      {friend.name || friend.username || "User"}
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

export default Friends;
