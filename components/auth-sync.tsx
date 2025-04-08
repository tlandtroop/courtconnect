"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export default function AuthSync() {
  const { isLoaded, isSignedIn, userId } = useAuth();

  useEffect(() => {
    const performSync = async () => {
      if (isLoaded && isSignedIn && userId) {
        try {
          const response = await fetch("/api/v1/auth/sync", {
            method: "POST",
          });
          if (!response.ok) {
            const data = await response.json();
            console.error("Failed to sync user with database:", data.error);
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
