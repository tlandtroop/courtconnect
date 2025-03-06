import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type") || "upcoming"; // "upcoming" or "history"

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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

      return NextResponse.json(upcomingGames);
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

      return NextResponse.json(gameHistory);
    }
  } catch (error) {
    console.error("[GET_USER_GAMES]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
