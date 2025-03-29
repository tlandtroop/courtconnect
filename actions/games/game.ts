"use server";

import db from "@/lib/db";

export async function getGame(gameId: string) {
  try {
    const game = await db.game.findUnique({
      where: { id: gameId },
      include: {
        court: true,
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
    });

    if (!game) {
      return { success: false, error: "Game not found" };
    }

    return { success: true, game };
  } catch (error) {
    console.error("[GET_GAME]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get game",
    };
  }
}
