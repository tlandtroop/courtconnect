import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import db from "@/lib/db";

// Get user's favorite courts
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        favorites: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.favorites);
  } catch (error) {
    console.error("[GET_FAVORITE_COURTS]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add a court to favorites
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: clerkId } = auth();
    const { userId } = params;
    const { courtId } = await request.json();

    if (!clerkId || clerkId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const court = await db.court.findUnique({
      where: { id: courtId },
    });

    if (!court) {
      return NextResponse.json({ error: "Court not found" }, { status: 404 });
    }

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
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: clerkId } = auth();
    const { userId } = params;
    const { courtId } = await request.json();

    if (!clerkId || clerkId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
