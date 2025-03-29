"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function findPlayers({
  search,
  skillLevel,
  location,
  sortBy = "rating",
  page = 1,
  limit = 10,
}: {
  search?: string;
  skillLevel?: string;
  location?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const skip = (page - 1) * limit;

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
      skip,
      take: limit,
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

    // Add sorting
    switch (sortBy) {
      case "rating":
        query.orderBy = { rating: "desc" };
        break;
      case "games":
        query.orderBy = { gamesPlayed: "desc" };
        break;
      case "name":
        query.orderBy = { name: "asc" };
        break;
      case "recent":
        query.orderBy = { lastActive: "desc" };
        break;
      default:
        query.orderBy = { rating: "desc" };
    }

    // Get total count for pagination
    const totalCount = await db.user.count({
      where: query.where,
    });

    // Execute the query
    const players = await db.user.findMany(query);

    return {
      success: true,
      players,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        page,
        limit,
      },
    };
  } catch (error) {
    console.error("[FIND_PLAYERS]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to find players",
    };
  }
}
