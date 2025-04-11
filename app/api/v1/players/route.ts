import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

type WhereClause = {
  id?: { not: string };
  OR?: Array<{
    name?: { contains: string; mode: "insensitive" };
    username?: { contains: string; mode: "insensitive" };
    email?: { contains: string; mode: "insensitive" };
  }>;
  skillLevel?: string;
  location?: { contains: string; mode: "insensitive" };
};

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const skillLevel = searchParams.get("skillLevel");
    const location = searchParams.get("location");
    const sortBy = searchParams.get("sortBy") || "lastActive";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: WhereClause = {
      id: { not: userId },
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (skillLevel) {
      where.skillLevel = skillLevel;
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    const [players, total, currentUser] = await Promise.all([
      db.user.findMany({
        where,
        orderBy:
          sortBy === "games"
            ? { games: { _count: "desc" } }
            : sortBy === "recentlyActive"
            ? { lastActive: "desc" }
            : { [sortBy]: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          clerkId: true,
          name: true,
          username: true,
          email: true,
          skillLevel: true,
          location: true,
          avatarUrl: true,
          lastActive: true,
          createdAt: true,
          _count: {
            select: {
              games: true,
              createdGames: true,
            },
          },
        },
      }),
      db.user.count({ where }),
      db.user.findUnique({
        where: { clerkId: userId },
        select: {
          friends: {
            select: {
              id: true,
            },
          },
        },
      }),
    ]);

    // Get list of friend IDs
    const friendIds = currentUser?.friends.map((friend) => friend.id) || [];

    // Filter out the current user from the results and add computed fields
    const filteredPlayers = players
      .filter((player) => player.clerkId !== userId)
      .map((player) => ({
        ...player,
        id: player.clerkId,
        gamesPlayed: player._count.games + player._count.createdGames,
        isFriend: friendIds.includes(player.id),
      }));

    return NextResponse.json({
      data: filteredPlayers,
      pagination: {
        total: total - 1, // Subtract 1 to account for the current user
        page,
        limit,
        totalPages: Math.ceil((total - 1) / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}
