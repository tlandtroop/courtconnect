"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user already exists in our database
    const existingUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      // User exists, just update their information if needed
      const updatedUser = await db.user.update({
        where: { clerkId: userId },
        data: {
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          avatarUrl: user.imageUrl,
        },
      });

      revalidatePath(`/profile/${userId}`);
      revalidatePath("/dashboard");

      return { success: true, user: updatedUser };
    }

    // Create a new user in our database
    const primaryEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    );

    if (!primaryEmail) {
      return { success: false, error: "Email address is required" };
    }

    const email = primaryEmail.emailAddress;

    // Create username from email (temporary)
    const tempUsername = email.split("@")[0];

    // Create the user
    const newUser = await db.user.create({
      data: {
        clerkId: userId,
        email,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        username: tempUsername,
        avatarUrl: user.imageUrl,
        rating: 2.5, // Default rating for new users
        gamesPlayed: 0,
        courtsVisited: 0,
      },
    });

    revalidatePath(`/profile/${userId}`);
    revalidatePath("/dashboard");

    return { success: true, user: newUser };
  } catch (error) {
    console.error("[SYNC_USER]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sync user",
    };
  }
}

export async function getUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user already exists in our database
    const existingUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      // User exists, just return their info
      return { success: true, user: existingUser };
    }

    return { success: false, error: "User not found in database" };
  } catch (error) {
    console.error("[GET_USER]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get user",
    };
  }
}
