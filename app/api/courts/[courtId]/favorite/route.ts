import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import db from "@/lib/db";

// Add a court to favorites
export async function POST(
  request: Request,
  { params }: { params: { courtId: string } }
) {
  try {
    const { userId } = auth();
    const { courtId } = params;

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

    // Find the court
    const court = await db.court.findUnique({
      where: { id: courtId },
    });

    if (!court) {
      return NextResponse.json({ error: "Court not found" }, { status: 404 });
    }

    // Add court to favorites
    await db.user.update({
      where: { id: user.id },
      data: {
        favorites: {
          connect: { id: court.id },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADD_FAVORITE_COURT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Remove a court from favorites
export async function DELETE(
  request: Request,
  { params }: { params: { courtId: string } }
) {
  try {
    const { userId } = auth();
    const { courtId } = params;

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

    // Remove court from favorites
    await db.user.update({
      where: { id: user.id },
      data: {
        favorites: {
          disconnect: { id: courtId },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[REMOVE_FAVORITE_COURT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
