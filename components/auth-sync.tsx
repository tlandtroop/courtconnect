"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { syncUser } from "@/actions/auth/sync-user";

export default function AuthSync() {
  const { isLoaded, isSignedIn, userId } = useAuth();

  useEffect(() => {
    const performSync = async () => {
      if (isLoaded && isSignedIn && userId) {
        try {
          // We'll keep this call here, but make it more efficient
          const result = await syncUser();

          if (!result.success) {
            console.error("Failed to sync user with database:", result.error);
          }
        } catch (error) {
          console.error("Error syncing user with database:", error);
        }
      }
    };

    performSync();
  }, [isLoaded, isSignedIn, userId]);

  return null;
}
