import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Prisma, Game, Court, User } from "@prisma/client";

type GameWithRelations = Game & {
  _count: {
    participants: number;
  };
  court: Court;
  organizer: Pick<User, "id" | "clerkId" | "name" | "username" | "avatarUrl">;
  participants: Pick<
    User,
    "id" | "clerkId" | "name" | "username" | "avatarUrl"
  >[];
};

// Helper function for consistent error responses
const errorResponse = (message: string, status: number = 400) => {
  return NextResponse.json({ success: false, error: message }, { status });
};

// Helper function for successful responses
const successResponse = (data: Record<string, unknown>) => {
  return NextResponse.json({ success: true, ...data });
};

// Middleware for authentication
const withAuth = async (handler: (userId: string) => Promise<NextResponse>) => {
  const { userId } = await auth();
  if (!userId) {
    return errorResponse("Unauthorized", 401);
  }
  return handler(userId);
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameId = searchParams.get("id");
  const userId = searchParams.get("userId");
  const type = searchParams.get("type") || "upcoming";

  if (gameId) {
    return withAuth(async () => {
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
              },
            },
            participants: {
              select: {
                id: true,
                clerkId: true,
                name: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        });

        if (!game) {
          return errorResponse("Game not found", 404);
        }

        return successResponse({ game });
      } catch (error) {
        console.error("[GET_GAME]", error);
        return errorResponse("Failed to get game");
      }
    });
  }

  if (userId) {
    return withAuth(async () => {
      try {
        const user = await db.user.findUnique({
          where: { clerkId: userId },
        });

        if (!user) {
          return errorResponse("User not found", 404);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const whereClause = {
          AND: [
            {
              OR: [
                { organizerId: user.id },
                { participants: { some: { id: user.id } } },
              ],
            },
            {
              OR:
                type === "upcoming"
                  ? [
                      {
                        // Games on a future date
                        date: {
                          gt: new Date(
                            today.getFullYear(),
                            today.getMonth(),
                            today.getDate()
                          ),
                        },
                      },
                      {
                        // Games today but haven't started yet
                        AND: [
                          {
                            date: {
                              equals: new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                today.getDate()
                              ),
                            },
                          },
                          {
                            startTime: {
                              gt: new Date(),
                            },
                          },
                        ],
                      },
                    ]
                  : [
                      {
                        // Games on a past date
                        date: {
                          lt: new Date(
                            today.getFullYear(),
                            today.getMonth(),
                            today.getDate()
                          ),
                        },
                      },
                      {
                        // Games today that have already started
                        AND: [
                          {
                            date: {
                              equals: new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                today.getDate()
                              ),
                            },
                          },
                          {
                            startTime: {
                              lte: new Date(),
                            },
                          },
                        ],
                      },
                    ],
            },
          ],
        };

        const games = await db.game.findMany({
          where: whereClause,
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
            date: type === "upcoming" ? "asc" : "desc",
          },
        });

        return successResponse({ games });
      } catch (error) {
        console.error("[GET_USER_GAMES]", error);
        return errorResponse("Failed to get user games");
      }
    });
  }

  // Get all games with filters
  return withAuth(async () => {
    try {
      const courtId = searchParams.get("courtId");
      const gameType = searchParams.get("gameType");
      const skillLevel = searchParams.get("skillLevel");
      const dateFrom = searchParams.get("dateFrom");
      const dateTo = searchParams.get("dateTo");
      const createdBy = searchParams.get("createdBy");
      const hasSpots = searchParams.get("hasSpots") === "true";
      const upcoming = searchParams.get("upcoming") === "true";
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");

      const skip = (page - 1) * limit;

      const query: Prisma.GameFindManyArgs = {
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
            },
          },
          participants: {
            select: {
              id: true,
              clerkId: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              participants: true,
            },
          },
        },
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
        skip,
        take: limit,
      };

      if (courtId) query.where!.courtId = courtId;
      if (gameType) query.where!.gameType = gameType;
      if (skillLevel) {
        const skillLevels = skillLevel.split(",");
        query.where!.skillLevel = { in: skillLevels };
      }
      if (dateFrom || dateTo) {
        query.where!.date = {
          gte: dateFrom ? new Date(dateFrom) : undefined,
          lte: dateTo ? new Date(dateTo) : undefined,
        };
      }
      if (upcoming) {
        const now = new Date();
        query.where!.OR = [
          {
            // Games on a future date
            date: {
              gt: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            },
          },
          {
            // Games today but haven't started yet
            AND: [
              {
                date: {
                  equals: new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate()
                  ),
                },
              },
              {
                startTime: {
                  gt: now,
                },
              },
            ],
          },
        ];
      }
      if (createdBy) {
        const creator = await db.user.findUnique({
          where: { clerkId: createdBy },
        });
        if (creator) {
          query.where!.organizerId = creator.id;
        }
      }

      const games = (await db.game.findMany(query)) as GameWithRelations[];
      const totalCount = await db.game.count({ where: query.where });

      let filteredGames = games;
      if (hasSpots) {
        filteredGames = games.filter(
          (game) => game._count.participants < game.playersNeeded
        );
      }

      return successResponse({
        games: filteredGames,
        pagination: {
          total: totalCount,
          pages: Math.ceil(totalCount / limit),
          page,
          limit,
        },
      });
    } catch (error) {
      console.error("[GET_GAMES]", error);
      return errorResponse("Failed to get games");
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(async (userId: string) => {
    try {
      const body = await request.json();
      const {
        date,
        startTime,
        gameType,
        skillLevel,
        playersNeeded,
        notes,
        courtId,
      } = body;

      const user = await db.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return errorResponse("User not found", 404);
      }

      const court = await db.court.findUnique({
        where: { id: courtId },
      });

      if (!court) {
        return errorResponse("Court not found", 404);
      }

      // Parse the date string into a Date object in local timezone
      const [year, month, day] = date.split("-").map(Number);
      const gameDate = new Date(year, month - 1, day);
      gameDate.setHours(0, 0, 0, 0);

      // Parse the start time in local timezone
      const startTimeDate = new Date(startTime);

      // Validate game is not in the past
      const now = new Date();
      if (startTimeDate < now) {
        return errorResponse("Cannot schedule a game in the past", 400);
      }

      const game = await db.game.create({
        data: {
          date: gameDate,
          startTime: startTimeDate,
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

      console.log("API - Created game date:", game.date);
      console.log("API - Created game startTime:", game.startTime);

      revalidatePath("/games");
      revalidatePath(`/profile/${userId}`);
      revalidatePath("/dashboard");

      return successResponse({ game });
    } catch (error) {
      console.error("[CREATE_GAME]", error);
      return errorResponse("Failed to create game");
    }
  });
}

export async function PATCH(request: NextRequest) {
  return withAuth(async (userId: string) => {
    try {
      const body = await request.json();
      const { gameId, action } = body;

      if (!gameId || !action) {
        return errorResponse("Missing required fields");
      }

      const user = await db.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return errorResponse("User not found", 404);
      }

      const game = await db.game.findUnique({
        where: { id: gameId },
        include: {
          participants: true,
        },
      });

      if (!game) {
        return errorResponse("Game not found", 404);
      }

      if (action === "join") {
        // Parse the game date and time in local timezone
        const gameDate = new Date(game.date);
        const gameTime = new Date(game.startTime);

        // Create date objects for comparison without time components
        const now = new Date();
        const nowDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const gameDateOnly = new Date(
          gameDate.getFullYear(),
          gameDate.getMonth(),
          gameDate.getDate()
        );

        // If the game is on a future date, it's definitely not in progress
        if (gameDateOnly > nowDate) {
          // Game is in the future, allow joining
        } else if (gameDateOnly.getTime() === nowDate.getTime()) {
          // Game is today, compare the times
          if (now > gameTime) {
            return errorResponse("Cannot join a game that has already started");
          }
        } else {
          // Game is on a past date
          return errorResponse(
            "Cannot join a game that has already taken place"
          );
        }

        if (game.participants.length >= game.playersNeeded) {
          return errorResponse("Game is already full");
        }

        const isParticipant = game.participants.some(
          (participant) => participant.id === user.id
        );

        if (isParticipant) {
          return errorResponse("You are already a participant in this game");
        }

        const updatedGame = await db.game.update({
          where: { id: gameId },
          data: {
            participants: {
              connect: { id: user.id },
            },
          },
          include: {
            court: true,
            organizer: true,
            participants: true,
          },
        });

        revalidatePath(`/games/${gameId}`);
        revalidatePath(`/profile/${userId}`);
        revalidatePath("/dashboard");

        return successResponse({ game: updatedGame });
      } else if (action === "leave") {
        const isParticipant = game.participants.some(
          (participant) => participant.id === user.id
        );

        if (!isParticipant) {
          return errorResponse("You are not a participant in this game");
        }

        const updatedGame = await db.game.update({
          where: { id: gameId },
          data: {
            participants: {
              disconnect: { id: user.id },
            },
          },
          include: {
            court: true,
            organizer: true,
            participants: true,
          },
        });

        revalidatePath(`/games/${gameId}`);
        revalidatePath(`/profile/${userId}`);
        revalidatePath("/dashboard");

        return successResponse({ game: updatedGame });
      }

      return errorResponse("Invalid action");
    } catch (error) {
      console.error("[UPDATE_GAME]", error);
      return errorResponse("Failed to update game");
    }
  });
}
