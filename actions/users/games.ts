"use server";

import db from "@/lib/db";

export async function getUserGames(userId: string, type: string = "upcoming") {
  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Different query based on the type of games requested
    if (type === "upcoming") {
      const upcomingGames = await db.game.findMany({
        where: {
          OR: [
            { organizerId: user.id },
            { participants: { some: { id: user.id } } },
          ],
          date: {
            gte: new Date(),
          },
        },
        include: {
          court: true,
          participants: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          date: "asc",
        },
      });

      return { success: true, games: upcomingGames };
    } else {
      const gameHistory = await db.game.findMany({
        where: {
          OR: [
            { organizerId: user.id },
            { participants: { some: { id: user.id } } },
          ],
          date: {
            lt: new Date(),
          },
        },
        include: {
          court: true,
          participants: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
        take: 10, // Limit to the 10 most recent games
      });

      return { success: true, games: gameHistory };
    }
  } catch (error) {
    console.error("[GET_USER_GAMES]", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get user games",
    };
  }
}
