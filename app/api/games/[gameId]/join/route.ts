// app/api/games/[gameId]/join/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import db from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const { userId } = await auth();
    const { gameId } = params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user in our database
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the game
    const game = await db.game.findUnique({
      where: { id: gameId },
      include: {
        participants: true,
      },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Check if the game is in the past
    if (new Date(game.date) < new Date()) {
      return NextResponse.json(
        { error: "Cannot join a game that has already taken place" },
        { status: 400 }
      );
    }

    // Check if the game is full
    if (game.participants.length >= game.playersNeeded) {
      return NextResponse.json(
        { error: "Game is already full" },
        { status: 400 }
      );
    }

    // Check if user is already a participant
    const isParticipant = game.participants.some(
      (participant) => participant.id === user.id
    );

    if (isParticipant) {
      return NextResponse.json(
        { error: "You are already a participant in this game" },
        { status: 400 }
      );
    }

    // Add user to participants
    const updatedGame = await db.game.update({
      where: { id: gameId },
      data: {
        participants: {
          connect: { id: user.id },
        },
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
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error("[JOIN_GAME]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
