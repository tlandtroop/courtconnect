"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { syncUser } from "@/actions/auth/sync-user";

/**
 * This component synchronizes the Clerk user with our database
 * It should be included in the RootLayout or in pages that require authentication
 */
export default function AuthSync() {
  const { isLoaded, isSignedIn, userId } = useAuth();

  useEffect(() => {
    const performSync = async () => {
      if (isLoaded && isSignedIn && userId) {
        try {
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
