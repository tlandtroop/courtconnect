import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

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
    const sortBy = searchParams.get("sortBy") || "rating";
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

    const [players, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { [sortBy]: "desc" },
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
          rating: true,
          avatarUrl: true,
          gamesPlayed: true,
          winRate: true,
          lastActive: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    // Filter out the current user from the results
    const filteredPlayers = players.filter(
      (player) => player.clerkId !== userId
    );

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
