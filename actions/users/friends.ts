"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";

export async function addFriend(friendId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Find the user in our database
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Find the friend
    const friend = await db.user.findUnique({
      where: { id: friendId },
    });

    if (!friend) {
      return { success: false, error: "Friend not found" };
    }

    // Can't add yourself as a friend
    if (user.id === friend.id) {
      return { success: false, error: "Cannot add yourself as a friend" };
    }

    // Check if already friends
    const alreadyFriends = await db.user.findFirst({
      where: {
        id: user.id,
        friends: {
          some: {
            id: friend.id,
          },
        },
      },
    });

    if (alreadyFriends) {
      return { success: false, error: "Already friends with this user" };
    }

    // Add friend relationship (bidirectional)
    await db.user.update({
      where: { id: user.id },
      data: {
        friends: {
          connect: { id: friend.id },
        },
      },
    });

    await db.user.update({
      where: { id: friend.id },
      data: {
        friends: {
          connect: { id: user.id },
        },
      },
    });

    // Revalidate paths
    revalidatePath(`/profile/${userId}`);
    revalidatePath(`/profile/${friend.clerkId}`);

    return { success: true };
  } catch (error) {
    console.error("[ADD_FRIEND]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add friend",
    };
  }
}

export async function removeFriend(friendId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Find the user in our database
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Find the friend
    const friend = await db.user.findUnique({
      where: { id: friendId },
    });

    if (!friend) {
      return { success: false, error: "Friend not found" };
    }

    // Check if actually friends
    const areFriends = await db.user.findFirst({
      where: {
        id: user.id,
        friends: {
          some: {
            id: friend.id,
          },
        },
      },
    });

    if (!areFriends) {
      return { success: false, error: "Not friends with this user" };
    }

    // Remove friend relationship (bidirectional)
    await db.user.update({
      where: { id: user.id },
      data: {
        friends: {
          disconnect: { id: friend.id },
        },
      },
    });

    await db.user.update({
      where: { id: friend.id },
      data: {
        friends: {
          disconnect: { id: user.id },
        },
      },
    });

    // Revalidate paths
    revalidatePath(`/profile/${userId}`);
    revalidatePath(`/profile/${friend.clerkId}`);

    return { success: true };
  } catch (error) {
    console.error("[REMOVE_FRIEND]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove friend",
    };
  }
}
