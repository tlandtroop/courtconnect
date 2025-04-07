"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";

export async function getUserGames(userId: string, type: string = "upcoming") {
  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const today = new Date();

    // Set time to start of day for more reliable comparison
    today.setHours(0, 0, 0, 0);

    // Different query based on the type of games requested
    if (type === "upcoming") {
      const upcomingGames = await db.game.findMany({
        where: {
          OR: [
            { organizerId: user.id },
            { participants: { some: { id: user.id } } },
          ],
          date: {
            gte: today,
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
        },
        orderBy: {
          date: "asc",
        },
      });

      // Format dates for consistent handling on the client
      const formattedGames = upcomingGames.map((game) => ({
        ...game,
        date: game.date.toISOString(),
        startTime: game.startTime.toISOString(),
      }));

      console.log(
        `Found ${formattedGames.length} upcoming games for user ${userId}`
      );
      return { success: true, games: formattedGames };
    } else {
      // History games (those in the past)
      const gameHistory = await db.game.findMany({
        where: {
          OR: [
            { organizerId: user.id },
            { participants: { some: { id: user.id } } },
          ],
          date: {
            lt: today,
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
        },
        orderBy: {
          date: "desc",
        },
        take: 10, // Limit to the 10 most recent games
      });

      // Format dates for consistent handling on the client
      const formattedGames = gameHistory.map((game) => ({
        ...game,
        date: game.date.toISOString(),
        startTime: game.startTime.toISOString(),
      }));

      console.log(
        `Found ${formattedGames.length} past games for user ${userId}`
      );
      return { success: true, games: formattedGames };
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

export async function getGames({
  courtId,
  gameType,
  skillLevel,
  dateFrom,
  dateTo,
  createdBy,
  hasSpots,
  upcoming,
  page = 1,
  limit = 10,
}: {
  courtId?: string;
  gameType?: string;
  skillLevel?: string;
  dateFrom?: string;
  dateTo?: string;
  createdBy?: string;
  hasSpots?: boolean;
  upcoming?: boolean;
  page?: number;
  limit?: number;
}) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const skip = (page - 1) * limit;

    const query: any = {
      where: {},
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
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
      skip,
      take: limit,
    };

    // Apply filters if provided
    if (courtId) {
      query.where.courtId = courtId;
    }

    if (gameType) {
      query.where.gameType = gameType;
    }

    if (skillLevel) {
      const skillLevels = skillLevel.split(",");
      query.where.skillLevel = {
        in: skillLevels,
      };
    }

    // Date range filtering
    if (dateFrom || dateTo) {
      query.where.date = {};

      if (dateFrom) {
        query.where.date.gte = new Date(dateFrom);
      }

      if (dateTo) {
        query.where.date.lte = new Date(dateTo);
      }
    }

    // Only upcoming games
    if (upcoming) {
      if (!query.where.date) {
        query.where.date = {};
      }
      query.where.date.gte = new Date();
    }

    // Filter by creator
    if (createdBy) {
      // Find the user by clerkId
      const creator = await db.user.findUnique({
        where: { clerkId: createdBy },
      });

      if (creator) {
        query.where.organizerId = creator.id;
      }
    }

    // Execute the main query without the hasSpots filter
    const games = await db.game.findMany(query);

    // Filter games with available spots in JavaScript
    let filteredGames = games;
    if (hasSpots) {
      filteredGames = games.filter(
        (game) => game._count.participants < game.playersNeeded
      );
    }

    // Count total after filtering
    const totalGamesCount = filteredGames.length;

    return {
      success: true,
      games: filteredGames,
      pagination: {
        total: totalGamesCount,
        page,
        limit,
        pages: Math.ceil(totalGamesCount / limit),
      },
    };
  } catch (error) {
    console.error("[GET_GAMES]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get games",
    };
  }
}

export async function createGame({
  date,
  startTime,
  gameType,
  skillLevel,
  playersNeeded,
  notes,
  courtId,
}: {
  date: string;
  startTime: string;
  gameType: string;
  skillLevel: string;
  playersNeeded: number;
  notes?: string;
  courtId: string;
}) {
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

    // Proper date handling for timezone issues
    let gameDate, gameStartTime;

    try {
      // Parse the date parts to avoid timezone issues
      const [year, month, day] = date.split("-").map(Number);

      // Create date with local time components to prevent timezone shift
      gameDate = new Date(year, month - 1, day);

      // Handle time in a similar way
      if (startTime.match(/^\d{1,2}:\d{2}$/)) {
        const [hours, minutes] = startTime.split(":").map(Number);

        gameStartTime = new Date(year, month - 1, day);
        gameStartTime.setHours(hours, minutes, 0, 0);
      } else {
        // Fallback for other time formats
        gameStartTime = new Date(`${date}T${startTime}`);
      }

      console.log("Date being used:", {
        originalDate: date,
        parsedGameDate: gameDate,
        startTime,
        parsedGameStartTime: gameStartTime,
      });

      if (isNaN(gameDate.getTime()) || isNaN(gameStartTime.getTime())) {
        throw new Error("Invalid date or time format");
      }
    } catch (error) {
      console.error("Date parsing error:", error);
      return {
        success: false,
        error: `Invalid date or time format: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }

    // Validate court exists
    const court = await db.court.findUnique({
      where: { id: courtId },
    });

    if (!court) {
      return { success: false, error: `Court not found: ${courtId}` };
    }

    // Create a new game in the database
    const game = await db.game.create({
      data: {
        date: gameDate,
        startTime: gameStartTime,
        gameType,
        skillLevel,
        playersNeeded: Number(playersNeeded),
        notes,
        court: {
          connect: { id: courtId },
        },
        organizer: {
          connect: { id: user.id },
        },
        participants: {
          connect: { id: user.id },
        },
      },
      include: {
        court: true,
        participants: true,
      },
    });

    // Revalidate relevant paths
    revalidatePath("/games");
    revalidatePath(`/profile/${userId}`);
    revalidatePath("/dashboard");

    return { success: true, game };
  } catch (error) {
    console.error("[CREATE_GAME]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create game",
    };
  }
}

export async function getUpcomingGames() {
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

    const today = new Date();

    // Get upcoming games (today and future dates)
    const games = await db.game.findMany({
      where: {
        date: {
          gte: today,
        },
        status: "scheduled",
      },
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
      orderBy: {
        date: "asc",
      },
      take: 8,
    });

    // Format the games to match the expected type
    const formattedGames = games.map((game) => ({
      id: game.id,
      gameType: game.gameType,
      skillLevel: game.skillLevel,
      date: game.date.toISOString(),
      startTime: game.startTime.toISOString(),
      playersNeeded: game.playersNeeded,
      notes: game.notes || undefined,
      participants: game.participants,
      organizer: game.organizer,
      court: game.court,
    }));

    return { success: true, games: formattedGames };
  } catch (error) {
    console.error("[GET_UPCOMING_GAMES]", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch upcoming games",
    };
  }
}
