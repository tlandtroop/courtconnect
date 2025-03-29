"use server";

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getCourt(courtId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const court = await db.court.findUnique({
      where: { id: courtId },
      include: {
        games: {
          where: {
            date: {
              gte: new Date(),
            },
            status: "scheduled",
          },
          include: {
            organizer: {
              select: {
                id: true,
                clerkId: true,
                name: true,
                username: true,
                avatarUrl: true,
                rating: true,
              },
            },
            participants: {
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
          orderBy: {
            date: "asc",
          },
          take: 5,
        },
      },
    });

    if (!court) {
      return { success: false, error: "Court not found" };
    }

    return { success: true, court };
  } catch (error) {
    console.error("[GET_COURT]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get court",
    };
  }
}
