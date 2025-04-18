"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import ProfileEditDialog from "@/app/(main)/profile/_components/profile-edit-dialog";
import Friends from "@/app/(main)/profile/_components/friends";
import Games from "@/app/(main)/profile/_components/games";
import { UserProfile } from "@/types";
import ProfileNotFound from "@/app/(main)/profile/_components/not-found";
import ProfileInfo from "@/app/(main)/profile/_components/profile-info";

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const userId = params.userId as string;
  const isOwnProfile = currentUser?.id === userId;

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch(`/api/v1/users?id=${params.userId}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch user profile");
      }
      const data = await response.json();
      if (data.success && data.user) {
        setUserProfile(data.user as unknown as UserProfile);
      } else {
        throw new Error(data.error || "Failed to fetch user profile");
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  }, [params.userId]);

  useEffect(() => {
    if (params.userId) {
      fetchUserProfile();
    }
  }, [params.userId, fetchUserProfile]);

  const handleProfileUpdated = useCallback(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  if (!loading && !userProfile) {
    return (
      <div className="min-h-screen">
        <ProfileNotFound />
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {userProfile && (
          <>
            <ProfileInfo
              profile={userProfile}
              isOwnProfile={isOwnProfile}
              setIsEditDialogOpen={setIsEditDialogOpen}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-300px)]">
              <Games profile={userProfile} isOwnProfile={isOwnProfile} />
              <Friends profile={userProfile} isOwnProfile={isOwnProfile} />
            </div>
          </>
        )}
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
