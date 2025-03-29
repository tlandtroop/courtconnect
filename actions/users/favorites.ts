"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";

export async function getUserFavorites(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        favorites: true,
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return { success: true, favorites: user.favorites };
  } catch (error) {
    console.error("[GET_FAVORITE_COURTS]", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get favorite courts",
    };
  }
}

export async function addFavoriteCourt(courtId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const court = await db.court.findUnique({
      where: { id: courtId },
    });

    if (!court) {
      return { success: false, error: "Court not found" };
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        favorites: {
          connect: { id: court.id },
        },
      },
    });

    // Revalidate paths
    revalidatePath(`/profile/${userId}`);
    revalidatePath("/courts");

    return { success: true };
  } catch (error) {
    console.error("[ADD_FAVORITE_COURT]", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to add favorite court",
    };
  }
}

export async function removeFavoriteCourt(courtId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const court = await db.court.findUnique({
      where: { id: courtId },
    });

    if (!court) {
      return { success: false, error: "Court not found" };
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        favorites: {
          disconnect: { id: court.id },
        },
      },
    });

    // Revalidate paths
    revalidatePath(`/profile/${userId}`);
    revalidatePath("/courts");

    return { success: true };
  } catch (error) {
    console.error("[REMOVE_FAVORITE_COURT]", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to remove favorite court",
    };
  }
}
