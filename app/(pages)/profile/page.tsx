"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function ProfileRedirect() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        router.push(`/profile/${user.id}`);
      } else {
        // Not logged in, redirect to sign in
        router.push("/sign-in");
      }
    }
  }, [user, isLoaded, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Redirecting to your profile...</p>
    </div>
  );
}
