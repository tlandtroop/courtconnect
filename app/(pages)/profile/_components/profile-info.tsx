import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { UserProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface ProfileInfoProps {
  profile: UserProfile;
  isOwnProfile: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
}

const ProfileInfo = ({
  profile,
  isOwnProfile,
  setIsEditDialogOpen,
}: ProfileInfoProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border">
      <div className="h-48 w-full bg-gradient-to-r from-blue-400 to-blue-600 relative"></div>

      <div className="p-6 relative">
        <div className="absolute -top-16 left-6 w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
          {profile.avatarUrl ? (
            <Image
              width={128}
              height={128}
              src={profile.avatarUrl}
              alt={profile.name || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-4xl font-bold">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>

        <div className="ml-36 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              {profile.skillLevel && (
                <Badge variant="secondary" className="text-blue-500 bg-blue-50">
                  {profile.skillLevel}
                </Badge>
              )}
            </div>

            <p className="text-gray-500">@{profile.username}</p>

            {profile?.location && (
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{profile.location}</span>
              </div>
            )}
          </div>

          {isOwnProfile && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Settings className="w-4 h-4" />
              Edit Profile
            </Button>
          )}
        </div>

        {profile.bio && (
          <div className="mt-6 text-gray-700 border-t pt-4">
            <p>{profile.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
