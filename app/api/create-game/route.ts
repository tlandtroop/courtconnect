import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

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

    // Parse the request body
    const body = await req.json();
    const {
      date,
      startTime,
      gameType,
      skillLevel,
      playersNeeded,
      notes,
      courtId,
    } = body;

    console.log("Received form data:", {
      date,
      startTime,
      courtId,
      gameType,
      skillLevel,
    });

    // Proper date handling
    let gameDate, gameStartTime;

    try {
      // For the date
      gameDate = new Date(date);
      if (isNaN(gameDate.getTime())) {
        throw new Error("Invalid date format");
      }

      if (startTime.match(/^\d{2}:\d{2}$/)) {
        const [hours, minutes] = startTime.split(":").map(Number);

        gameStartTime = new Date(gameDate);
        gameStartTime.setHours(hours, minutes, 0, 0);
      } else {
        gameStartTime = new Date(startTime);
      }

      if (isNaN(gameStartTime.getTime())) {
        throw new Error("Invalid start time format");
      }
    } catch (error) {
      console.error("Date parsing error:", error);
      return NextResponse.json(
        {
          error: "Invalid date or time format",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 400 }
      );
    }

    // Validate court exists
    const court = await db.court.findUnique({
      where: { id: courtId },
    });

    if (!court) {
      return NextResponse.json(
        { error: "Court not found", courtId },
        { status: 404 }
      );
    }

    console.log("Creating game with dates:", {
      gameDate: gameDate.toISOString(),
      gameStartTime: gameStartTime.toISOString(),
      courtId,
      court: court?.name,
      userId: user.id,
    });

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

    return NextResponse.json(game);
  } catch (error) {
    console.error("[CREATE_GAME]", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
