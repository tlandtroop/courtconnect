"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";

export async function getUserProfile(userId: string) {
  try {
    console.log("Looking up user with clerkId:", userId);

    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    // Find the user in our database using the URL parameter
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        games: {
          include: {
            court: true,
          },
          orderBy: {
            date: "desc",
          },
          take: 5,
        },
        createdGames: {
          include: {
            court: true,
          },
          where: {
            date: {
              gte: new Date(),
            },
          },
          orderBy: {
            date: "asc",
          },
        },
        favorites: true,
        friends: {
          select: {
            id: true,
            clerkId: true,
            name: true,
            username: true,
            avatarUrl: true,
            rating: true,
          },
        },
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return { success: true, user };
  } catch (error) {
    console.error("[GET_PROFILE]", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get user profile",
    };
  }
}

export async function updateUserProfile(
  userId: string,
  data: { username?: string; bio?: string; location?: string }
) {
  try {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
      return { success: false, error: "Unauthorized" };
    }

    // Find the user by clerk ID
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Ensure users can only update their own profiles
    if (userId !== currentUserId) {
      return { success: false, error: "Cannot update another user's profile" };
    }

    // Check if username is already taken
    if (data.username) {
      const existingUser = await db.user.findFirst({
        where: {
          username: data.username,
          NOT: {
            id: user.id,
          },
        },
      });

      if (existingUser) {
        return { success: false, error: "Username is already taken" };
      }
    }

    // Update user profile
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        username: data.username,
        bio: data.bio,
        location: data.location,
      },
    });

    // Revalidate paths
    revalidatePath(`/profile/${userId}`);
    revalidatePath("/dashboard");

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("[UPDATE_PROFILE]", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update user profile",
    };
  }
}
