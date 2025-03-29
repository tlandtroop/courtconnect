"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import Navbar from "@/components/navbar";
import ProfileEditDialog from "@/components/profile-edit-dialog";
import { getUserProfile } from "@/actions/users/profile";
import PlayerStats from "@/components/profile/player-stats";
import Friends from "@/components/profile/friends";
import FavoriteCourts from "@/components/profile/favorite-courts";
import Games from "@/components/profile/games";
import { UserProfile } from "@/types";
import ProfileLoader from "@/components/profile/loader";
import ProfileNotFound from "@/components/profile/not-found";
import ProfileInfo from "@/components/profile/profile-info";

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const userId = params.userId as string;
  const isOwnProfile = currentUser?.id === userId;

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const result = await getUserProfile(userId);

      if (result.success && result.user) {
        setProfile(result.user as unknown as UserProfile);
      } else {
        throw new Error(`Failed to fetch profile: ${result.error}`);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && userId) {
      fetchProfile();
    } else {
      console.log("Not ready to fetch:", { isLoaded, userId });
    }
  }, [userId, isLoaded]);

  const handleProfileUpdated = () => {
    fetchProfile();
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <ProfileLoader />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <ProfileNotFound />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProfileInfo
          profile={profile}
          isOwnProfile={isOwnProfile}
          setIsEditDialogOpen={setIsEditDialogOpen}
        />

        <div className="space-y-6">
          <Games profile={profile} isOwnProfile={isOwnProfile} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Friends profile={profile} isOwnProfile={isOwnProfile} />
            <PlayerStats profile={profile} />
            <FavoriteCourts profile={profile} isOwnProfile={isOwnProfile} />
          </div>
        </div>
      </div>

      {isOwnProfile && (
        <ProfileEditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onProfileUpdated={handleProfileUpdated}
          userId={userId}
        />
      )}
    </div>
  );
}
