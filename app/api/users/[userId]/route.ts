import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    console.log("API GET request received with params:", params);
    const { userId } = params;

    console.log("Looking up user with clerkId:", userId);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the user in our database using the URL parameter
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        games: {
          include: {
            court: true,
          },
          orderBy: {
            date: "desc",
          },
          take: 5, // Limit to recent games
        },
        createdGames: {
          include: {
            court: true,
          },
          where: {
            date: {
              gte: new Date(),
            },
          },
          orderBy: {
            date: "asc",
          },
        },
        favorites: true,
        friends: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            rating: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[GET_PROFILE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: clerkId } = await auth();
    const { userId } = params;

    // Only allow users to update their own profile
    if (!clerkId || clerkId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username, bio, location } = body;

    // Find the user first
    const existingUser = await db.user.findUnique({
      where: { clerkId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if username is already taken by another user
    if (username && username !== existingUser.username) {
      const usernameExists = await db.user.findUnique({
        where: { username },
      });

      if (usernameExists) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }
    }

    // Update the user profile
    const updatedUser = await db.user.update({
      where: { clerkId },
      data: {
        username,
        bio,
        location,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[UPDATE_PROFILE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
