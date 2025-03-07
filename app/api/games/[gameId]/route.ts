// app/api/games/[gameId]/route.ts
import { NextResponse } from "next/server";

import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const { gameId } = await params;

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
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("[GET_GAME]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
