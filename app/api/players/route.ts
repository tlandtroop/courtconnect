import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);

    // Optional query parameters
    const search = searchParams.get("search");
    const skillLevel = searchParams.get("skillLevel");
    const location = searchParams.get("location");
    const sortBy = searchParams.get("sortBy") || "rating";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Base query to find all users except the current user
    const query: any = {
      where: {
        NOT: {
          clerkId: userId,
        },
      },
      select: {
        id: true,
        clerkId: true,
        name: true,
        username: true,
        avatarUrl: true,
        location: true,
        rating: true,
        skillLevel: true,
        gamesPlayed: true,
        winRate: true,
        createdAt: true,
        lastActive: true,
        _count: {
          select: {
            friends: true,
          },
        },
      },
    };

    // Add search filter if provided
    if (search) {
      query.where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          username: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Add skill level filter if provided
    if (skillLevel) {
      const skillLevels = skillLevel.split(",");
      query.where.skillLevel = {
        in: skillLevels,
      };
    }

    // Add location filter if provided
    if (location) {
      query.where.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    // Sorting logic
    switch (sortBy) {
      case "rating":
        query.orderBy = { rating: "desc" };
        break;
      case "games":
        query.orderBy = { gamesPlayed: "desc" };
        break;
      case "winRate":
        query.orderBy = { winRate: "desc" };
        break;
      case "recentlyActive":
        query.orderBy = { lastActive: "desc" };
        break;
      default:
        query.orderBy = { rating: "desc" };
    }

    // Pagination
    const skip = (page - 1) * limit;
    query.skip = skip;
    query.take = limit;

    // Execute the query to get players
    const players = await db.user.findMany(query);

    // Get total count for pagination
    const totalCount = await db.user.count({
      where: query.where,
    });

    // Find which players are friends with the current user
    const currentUser = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        friends: {
          select: {
            id: true,
          },
        },
      },
    });

    const friendIds = currentUser?.friends.map((friend) => friend.id) || [];

    // Add the isFriend field to each player
    const playersWithFriendStatus = players.map((player) => ({
      ...player,
      isFriend: friendIds.includes(player.id),
      _count: undefined, // Remove _count from the response
      friendsCount: player._count.friends, // Replace with friendsCount
    }));

    return NextResponse.json({
      players: playersWithFriendStatus,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("[GET_PLAYERS]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
