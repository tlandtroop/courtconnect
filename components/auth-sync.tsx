// components/auth-sync.tsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

/**
 * This component synchronizes the Clerk user with our database
 * It should be included in the RootLayout or in pages that require authentication
 */
export default function AuthSync() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const syncUser = async () => {
      if (isLoaded && isSignedIn && userId) {
        try {
          // Call your API endpoint to sync user data
          const response = await fetch("/api/sync-user", {
            method: "POST",
          });

          if (!response.ok) {
            console.error("Failed to sync user with database");
          }
        } catch (error) {
          console.error("Error syncing user with database:", error);
        }
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, userId]);

  return null; // This component doesn't render anything
}
