import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/";

import db from "@/lib/db";

// Add a friend
export async function POST(
  request: Request,
  { params }: { params: { friendId: string } }
) {
  try {
    const { userId } = auth();
    const { friendId } = params;

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

    // Find the friend
    const friend = await db.user.findUnique({
      where: { id: friendId },
    });

    if (!friend) {
      return NextResponse.json({ error: "Friend not found" }, { status: 404 });
    }

    // Can't add yourself as a friend
    if (user.id === friend.id) {
      return NextResponse.json(
        { error: "Cannot add yourself as a friend" },
        { status: 400 }
      );
    }

    // Check if already friends
    const alreadyFriends = await db.user.findFirst({
      where: {
        id: user.id,
        friends: {
          some: {
            id: friend.id,
          },
        },
      },
    });

    if (alreadyFriends) {
      return NextResponse.json(
        { error: "Already friends with this user" },
        { status: 400 }
      );
    }

    // Add friend relationship (bidirectional)
    await db.user.update({
      where: { id: user.id },
      data: {
        friends: {
          connect: { id: friend.id },
        },
      },
    });

    await db.user.update({
      where: { id: friend.id },
      data: {
        friends: {
          connect: { id: user.id },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADD_FRIEND]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Remove a friend
export async function DELETE(
  request: Request,
  { params }: { params: { friendId: string } }
) {
  try {
    const { userId } = auth();
    const { friendId } = params;

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

    // Find the friend
    const friend = await db.user.findUnique({
      where: { id: friendId },
    });

    if (!friend) {
      return NextResponse.json({ error: "Friend not found" }, { status: 404 });
    }

    // Remove friend relationship (bidirectional)
    await db.user.update({
      where: { id: user.id },
      data: {
        friends: {
          disconnect: { id: friend.id },
        },
      },
    });

    await db.user.update({
      where: { id: friend.id },
      data: {
        friends: {
          disconnect: { id: user.id },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[REMOVE_FRIEND]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
